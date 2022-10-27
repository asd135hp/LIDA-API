import { PublisherImplementor } from "../../../model/patterns/subscriptionImplementor"

// Replica of SQS from AWS, does not do anything for now
class QueueSystem<Message extends any> extends PublisherImplementor<Message> {
  private queue: Array<Message>
  type: "fifo" | "standard"

  constructor(type: "fifo" | "standard"){
    super()
    this.queue = []
    this.type = type

    this.forwardMessages()
  }

  private forwardMessages(){

  }

  /**
   * Queue one item at a time
   * @param message 
   */
  enqueue(message: Message): void;
  /**
   * Queue multiple items at a time
   * @param messages Messages to be pushed to the queue from 0th index
   */
  enqueue(...messages: Message[]): void{
    this.queue.push(...messages)
  }
}