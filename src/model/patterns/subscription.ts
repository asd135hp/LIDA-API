import DatabaseEvent from "../v1/events/databaseEvent";

/**
 * Following Observer pattern, these two interfaces are crucial in implementing
 * Event Sourcing or Observer pattern
 * Note: Links below are for C#. But Typescript and C# are both developed by Microsoft
 * so there should not be many differences
 * @see https://docs.microsoft.com/en-us/dotnet/api/system.iobserver-1?view=net-6.0
 * @see https://docs.microsoft.com/en-us/dotnet/api/system.iobservable-1?view=net-6.0
 */
export interface Publisher<T> {
  /**
   * Add a new subscriber to be linked to this publisher
   * @param subscriber 
   */
  addSubscriber(subscriber: Subscriber<T>): void;

  /**
   * Remove a subscriber from a list of subscribers that this publisher holds
   * @param subscriber 
   */
  removeSubscriber(subscriber: Subscriber<T>): void;
}

export interface Subscriber<T> {
  /**
   * Subscribes to a publisher
   * @param publisher 
   */
  subscribe(publisher: Publisher<T>): void;

  /**
   * A standard method for Subscribers.
   * 
   * Activate a normal action externally to be passed through this subscriber
   * @param item Item to be passed 
   */
  onNext(item: T): void;

  /**
   * Non-standard method for Subscribers
   * 
   * Error propagation back to the publisher is a non-standard way of
   * implementing an event-driven pattern. This method exists to ease some situations where
   * errors need to be propagated back to publisher level or even beyond.
   * @param item Item to be passed
   */
  onNextAsync(item: T): Promise<DatabaseEvent>;

  /**
   * A standard method for Subscribers.
   * 
   * When an error exists, this method should be called to indicate that an error should
   * be propagated down from this subscriber level
   * @param error
   */
  onError(error: Error): void;

  /**
   * A standard method for Subscribers.
   * 
   * This is the same as `unsubscribe` method
   */
  onFinished(): void;

  /**
   * A standard method for Subscribers.
   * 
   * Unsubscribe from the linked publisher
   */
  unsubscribe(): void;
}