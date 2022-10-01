import { ActuatorDTO, ActuatorConfigDTO } from "../../../../model/v1/read/actuatorDto";
import { Actuator, ActuatorConfig, UpdatingActuator } from "../../../../model/v1/write/actuators";
import { ACTUATOR_LIMIT, logger } from "../../../../constants";
import DatabaseEvent from "../../../../model/v1/events/databaseEvent";
import DatabaseAddEvent from "../../../../model/v1/events/databaseAddEvent";
import DatabaseUpdateEvent from "../../../../model/v1/events/databaseUpdateEvent";
import { persistentFirebaseConnection } from "./firebaseService";
import { Option, Some, None } from "../../../../model/patterns/option"
import { createWriteEvent, getRealtimeContent } from "../../../../utility/shorthandOps";
import { COMPONENTS_PATH as fbPath } from "../../../../constants";
import { ActuatorServiceFacade } from "../../../../model/v1/services/actuatorServiceFacade";

const realtime = persistentFirebaseConnection.realtimeService
const firestore = persistentFirebaseConnection.firestoreService

export default class ActuatorService extends ActuatorServiceFacade {
  async getActuators(): Promise<Option<ActuatorDTO[]>> {
    let result: Option<any[]> = await getRealtimeContent(fbPath.actuator, null, { limitToFirst: ACTUATOR_LIMIT });

    logger.debug(`All actuators: ${result}`)
    return result.map(arr => {
      const newArr = arr.map(json => ActuatorDTO.fromJson(json) as ActuatorDTO)
      return Some(newArr)
    })
  }

  async getActuatorsByType(type: string): Promise<Option<ActuatorDTO[]>> {
    let result: Option<any[]> = await getRealtimeContent(fbPath.actuator, "type", { equalToValue: type })

    logger.debug(`Actuators by type: ${result}`)
    return result.map(arr => {
      const newArr = arr.map(json => ActuatorDTO.fromJson(json) as ActuatorDTO)
      return Some(newArr)
    })
  }

  async getActuatorByName(name: string): Promise<Option<ActuatorDTO>> {
    let result: Option<any[]> = await getRealtimeContent(fbPath.actuator, "name", { equalToValue: name })

    logger.debug(`Actuator by name: ${result}`)
    // get the only object in the object
    return result.map(arr => Some(ActuatorDTO.fromJson(arr[0]) as ActuatorDTO))
  }
  
  async getActuatorConfig(): Promise<Option<ActuatorConfigDTO[]>> {
    let result: Option<any[]> = await getRealtimeContent(fbPath.actuatorConfig)

    logger.debug(`Actuator config(s): ${result}`)
    // converts all json into respective DTO
    return result.map(arr => {
      const newArr = arr.map(json => ActuatorConfigDTO.fromJson(json) as ActuatorConfigDTO)
      return Some(newArr)
    })
  }
  
  async getProposedActuatorConfig(): Promise<Option<ActuatorConfigDTO[]>> {
    let result: Option<any[]> = await getRealtimeContent(fbPath.actuatorConfigProposed)

    logger.debug(`Proposed actuator config(s): ${result}`)
    // converts all json into respective DTO
    return result.map(arr => {
      const newArr = arr.map(json => ActuatorConfigDTO.fromJson(json) as ActuatorConfigDTO)
      return Some(newArr)
    })
  }

  async addActuator(actuator: Actuator): Promise<DatabaseEvent> {
    if(typeof(actuator.isRunning) === 'undefined') actuator.isRunning = true

    return await createWriteEvent({
      data: actuator,
      protectedMethods: {
        async write(_: DatabaseEvent){
          // check for the existance of given actuator in the database
          const result = await firestore.queryCollection(
            fbPath.actuator,
            collectionRef => collectionRef.where("name", "==", actuator.name).get()
          )
          if(!result.empty){
            logger.error(`An actuator of the same name has already existed in the database: "${actuator.name}"`)
            return Promise.reject(`400An actuator with the same name "${actuator.name}" has already existed in the database`)
          }

          // add content without using an array
          await firestore.addContentToCollection(fbPath.actuator, actuator)
        },
        async read(){
          // check for content existence before pushing since
          // it will lead to ambiguity if not done so
          let result: Option<any[]> = await getRealtimeContent(
            fbPath.actuator,
            "name",
            { equalToValue: actuator.name }
          )
          if(result.match.isNone()) await realtime.pushContent(actuator, fbPath.actuator)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 131"
    }, DatabaseAddEvent)
  }

  async updateActuator(actuator: UpdatingActuator): Promise<DatabaseEvent> {
    return await createWriteEvent({
      data: actuator,
      protectedMethods: {
        async write(currentEvent: DatabaseEvent){
          // check for ambiguity and existance of the given actuator
          const docs = (await firestore.queryCollection(
            fbPath.actuator,
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
          await realtime.getContent(fbPath.actuator, async ref => {
            await ref.orderByChild("name").equalTo(actuator.name).once("child_added", child => {
              realtime.updateContent(actuator, `${fbPath.actuator}/${child.key}`)
            })
          })
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 169"
    }, DatabaseUpdateEvent)
  }

  async updateActuatorConfig(
    actuatorName: string,
    actuatorConfig: ActuatorConfig
  ): Promise<DatabaseEvent> {
    const updateContent = { actuatorName, ...actuatorConfig }

    return await createWriteEvent({
      data: updateContent,
      protectedMethods: {
        async write(){
          const docPath = `${fbPath.actuatorConfig}/${actuatorName}`
          // check if the actuator is even in the database in the first place
          const result = await firestore.getDocument(docPath)

          if(!result.exists) {
            // set the document if it is not already existed
            await firestore.setDocument(docPath, updateContent)
            return
          }

          // update the corresponding document
          await firestore.updateDocument(docPath, updateContent)
        },
        async read(){
          // same logic as write method
          const path = `${fbPath.actuatorConfig}/${actuatorName}`
          const content = await realtime.getContent(path)
          if(!content.exists()){
            await realtime.setContent(updateContent, path)
            return
          }

          await realtime.updateContent(updateContent, path)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 225"
    }, DatabaseUpdateEvent)
  }
  
   async updateProposedActuatorConfig(
    actuatorName: string,
    actuatorConfig: ActuatorConfig
  ): Promise<DatabaseEvent> {  
    const updateContent = { actuatorName, ...actuatorConfig }

    return await createWriteEvent({
      data: updateContent,
      protectedMethods: {
        async write(){
          const docPath = `${fbPath.actuatorConfigProposed}/${actuatorName}`
          // check if the actuator is even in the database in the first place
          const result = await firestore.getDocument(docPath)

          if(!result.exists) {
            // set the document if it is not already existed
            await firestore.setDocument(docPath, updateContent)
            return
          }

          // update the corresponding document
          await firestore.updateDocument(docPath, updateContent)
        },
        async read(){
          // same logic as write method
          const path = `${fbPath.actuatorConfigProposed}/${actuatorName}`
          const content = await realtime.getContent(path)
          if(!content.exists()){
            await realtime.setContent(updateContent, path)
            return
          }

          await realtime.updateContent(updateContent, path)
        }
      },
      publisher: this.publisher,
      serverLogErrorMsg: "ActuatorService: DatabaseEvent filtration leads to all error ~ 272"
    }, DatabaseUpdateEvent)
  }
}