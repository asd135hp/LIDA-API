import { ActuatorDTO, ActuatorCommandDTO } from "../../../../model/v1/read/actuatorDto";
import { Actuator, ActuatorCommand, UpdatingActuator } from "../../../../model/v1/write/actuators";
import { ACTUATOR_LIMIT, logger } from "../../../../constants";
import { PublisherImplementor } from "../../../../model/patterns/subscriptionImplementor";
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import DatabaseAddEvent from "../../../../model/v1/events/databaseAddEvent";
import DatabaseUpdateEvent from "../../../../model/v1/events/databaseUpdateEvent";
import { persistentFirebaseConnection } from "./firebaseService";
import { Option, Some, None } from "../../../../model/patterns/option"
import { filterDatabaseEvent } from "../../../../utility/filterDatabaseEvent";
import DatabaseErrorEvent from "../../../../model/v1/events/databaseErrorEvent";
import { createWriteEvent, getRealtimeContent } from "../../../../utility/shorthandOps";

const realtime = persistentFirebaseConnection.realtimeService
const realtimeActuator = "actuators"
const realtimeActuatorCommand = "actuatorCommand"

const commandIdKey = "actuatorCommandId"

const firestore = persistentFirebaseConnection.firestoreService
const firestoreActuator = "actuators"
const firestoreActuatorCommand = "actuatorCommand"

export default class ActuatorService {
  private publisher: PublisherImplementor<DatabaseEvent>;

  constructor(publisher?: PublisherImplementor<DatabaseEvent>){
    this.publisher = publisher
  }

  /**
   * Dumps all actuator details in the database
   * @returns 
   */
  async getActuators(): Promise<Option<ActuatorDTO[]>> {
    let result: Option<any[]> = await getRealtimeContent(realtimeActuator, null, { limitToFirst: ACTUATOR_LIMIT });

    logger.debug(`All actuators: ${result}`)
    return result.map(arr => {
      const newArr = arr.map(json => ActuatorDTO.fromJson(json) as ActuatorDTO)
      return Some(newArr)
    })
  }

  /**
   * Get all actuator details by its designated type
   * @param type Type of actuator
   * @returns All actuator details with matched type
   */
  async getActuatorsByType(type: string): Promise<Option<ActuatorDTO[]>> {
    let result: Option<any[]> = await getRealtimeContent(realtimeActuator, "type", { equalToValue: type })

    logger.debug(`Actuators by type: ${result}`)
    return result.map(arr => {
      const newArr = arr.map(json => ActuatorDTO.fromJson(json) as ActuatorDTO)
      return Some(newArr)
    })
  }

  /**
   * Get a single actuator detail by name
   * @param name Name of the actuator, should be unique
   * @returns A single actuator detail with a matched name
   */
  async getActuatorByName(name: string): Promise<Option<ActuatorDTO>> {
    let result: Option<any[]> = await getRealtimeContent(realtimeActuator, "name", { equalToValue: name })

    logger.debug(`Actuator by name: ${result}`)
    // get the only object in the object
    return result.map(arr => Some(ActuatorDTO.fromJson(arr[0]) as ActuatorDTO))
  }
  
  /**
   * Get all actuator commands that is pending to be executed irl
   * @param limitToFirst From index 0 to this limit number exclusive, get all commands in the database
   * @returns List of actuator commands
   */
  async getActuatorCommands(limitToFirst?: number): Promise<Option<ActuatorCommandDTO[]>> {
    let result: Option<any[]> = await getRealtimeContent(realtimeActuatorCommand, "timeStamp", { limitToFirst })

    logger.debug(`${limitToFirst || ("All " + result.unwrapOr([]).length)} actuator command(s): ${result}`)
    // converts all json into respective DTO
    return result.map(arr => {
      const newArr = arr.map(json => ActuatorCommandDTO.fromJson(json) as ActuatorCommandDTO)
      return Some(newArr)
    })
  }
  
  /**
   * Get the oldest actuator command that was pushed but not resolved (yet)
   * @returns A sole actuator command which has the oldest timestamp out of the list
   */
  async getOldestActuatorCommand(): Promise<Option<ActuatorCommandDTO>> {
    let result = await this.getActuatorCommands(1)
    return result.map(arr => Some(arr.pop()))
  }

  /**
   * Add a single actuator detail to the database
   * @param actuator Details about the actuator
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  async addActuator(actuator: Actuator): Promise<DatabaseEvent> {
    if(typeof(actuator.isRunning) === 'undefined') actuator.isRunning = true

    return await createWriteEvent({
      data: actuator,
      protectedMethods: {
        async write(_: DatabaseEvent){
          // check for the existance of given actuator in the database
          const result = await firestore.queryCollection(
            firestoreActuator,
            collectionRef => collectionRef.where("name", "==", actuator.name).get()
          )
          if(!result.empty){
            logger.error(`An actuator of the same name has already existed in the database: "${actuator.name}"`)
            return Promise.reject(`400An actuator with the same name "${actuator.name}" has already existed in the database`)
          }

          // add content without using an array
          await firestore.addContentToCollection(firestoreActuator, actuator)
        },
        async read(){
          // check for content existence before pushing since
          // it will lead to ambiguity if not done so
          let result: Option<any[]> = await getRealtimeContent(
            realtimeActuator,
            "name",
            { equalToValue: actuator.name }
          )
          if(result.match.isNone()) await realtime.pushContent(actuator, realtimeActuator)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 131"
    }, DatabaseAddEvent)
  }

  /**
   * Update a single actuator to the database
   * @param actuator Details about the actuator
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  async updateActuator(actuator: UpdatingActuator): Promise<DatabaseEvent> {
    return await createWriteEvent({
      data: actuator,
      protectedMethods: {
        async write(currentEvent: DatabaseEvent){
          // check for ambiguity and existance of the given actuator
          const docs = (await firestore.queryCollection(
            firestoreActuator,
            collectionRef => collectionRef.where("name", "==", actuator.name).get()
          )).docs

          if(docs.length == 0)
            return Promise.reject("404Specified name does not match with anything in the database")

          if(docs.length > 1){
            currentEvent.content.warning = "Ambiguity: There are more than 2 actuators with the same name!"
            return Promise.reject("400Could not update actuator details due to ambiguity")
          }
          
          await firestore.updateDocument(docs[0].id, actuator)
        },
        async read(){
          // needs access to the reference itself to update content
          await realtime.getContent(realtimeActuator, async ref => {
            await ref.orderByChild("name").equalTo(actuator.name).once("child_added", child => {
              realtime.updateContent(actuator, `${realtimeActuator}/${child.key}`)
            })
          })
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 169"
    }, DatabaseUpdateEvent)
  }

  /**
   * Add a single actuator command to the database
   * @param actuatorName Name of the actuator
   * @param actuatorCommand An actuator command, related by name
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  async addActuatorCommand(actuatorName: string, actuatorCommand: ActuatorCommand): Promise<DatabaseEvent> {
    // set up cache for id
    await realtime.runTransaction(val => typeof(val) === 'number' ? val + 1 : 1, commandIdKey)

    return await createWriteEvent({
      data: { actuatorName, ...actuatorCommand },
      protectedMethods: {
        async write(){
          // check if the actuator is even in the database in the first place
          const result = await firestore.queryCollection(
            firestoreActuator,
            collectionRef => collectionRef.where("name", "==", actuatorName).get()
          )

          if(result.empty)
            return Promise.reject("404Specified name does not match with anything in the database")

          // push new content to the commands collection
          await firestore.addContentToCollection(
            firestoreActuatorCommand,
            {
              id: (await realtime.getContent(commandIdKey)).val(),
              actuatorName,
              ...actuatorCommand,
              resolved: false
            })
        },
        async read(){
          const id = (await realtime.getContent(commandIdKey)).val()
          if(typeof(id) !== 'number') {
            logger.error("Could not get command id from firebase firestore storages")
            return Promise.reject("500Server side error")
          }
          await realtime.pushContent({ id, actuatorName, ...actuatorCommand }, realtimeActuatorCommand)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 190"
    }, DatabaseUpdateEvent)
  }

  /**
   * When the command is received, resolve it so that query database removes that specific command.
   * 
   * It is a must to keep id of the command when retrieved its DTO
   * @param id Id of the actuator command, will be unique
   * @returns A DatabaseEvent, an instance of either DatabaseErrorEvent or a modified DatabaseEvent
   */
  async resolveActuatorCommand(id: number): Promise<DatabaseEvent> {
    logger.info(`Resolving an actuator command with id of ${id}`)

    return await createWriteEvent({
      data: id,
      protectedMethods: {
        async write(){
          // check if the actuator is in the database in the first place
          const result = await firestore.queryCollection(
            firestoreActuatorCommand,
            collectionRef => collectionRef.where("id", "==", id).get()
          )
          
          if(result.empty) return Promise.reject(`404No actuator command is matched with id of ${id}`)
          
          // turn resolved to true instead of removing it
          await firestore.runTransaction("", async (_, t) => {
            t.update(result.docs[0].ref, { resolved: true })
          })
        },
        async read(){
          // needs access to the actual reference
          await realtime.getContent(realtimeActuatorCommand, async ref => {
            let isValid = false
            let key = ""

            // more customisable and does not interfere with the base models
            await ref.orderByChild("id").equalTo(id).once('value', snapshot => {
              logger.info("Actuator service - Resolve command: Snapshot:" + snapshot.val())
              // get child instead of parent snapshot
              if(isValid = snapshot.exists()) snapshot.forEach(child => { key = child.key })
            })
            
            // remove resolved commands in the realtime database
            if(isValid && key) {
              await realtime.deleteContent(`${realtimeActuatorCommand}/${key}`)
              return
            }
            
            Promise.reject("404Wrong command id or the command has already been resolved")
          })
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 190"
    }, DatabaseUpdateEvent)
    const event = new DatabaseUpdateEvent({
      id,
      protected: {
        async firestore(_: DatabaseEvent){
        },
        async realtime(){
        }
      }
    })

    // must have a publisher to add sensor, else an error will be thrown
    return filterDatabaseEvent(await this.publisher.notifyAsync(event)).unwrapOrElse(()=>{
      logger.error("ActuatorService: DatabaseEvent filtration leads to all error ~ 299")
      return new DatabaseErrorEvent("The action is failed to be executed", 400)
    })
  }
}