export abstract class CounterServiceFacade {
  /**
   * Increment log counter based on which counter is used for this method
   * @param whichCounter Name of the counter to be used. Can have alphanumerics, slashes and underscores but nothing else
   * @param by BY how much will the counter increment
   */
  abstract incrementLogCounter(whichCounter: string, by?: number, maxCounter?: number): Promise<number>;
  
  /**
   * Reset the log counter based on which counter is used for this method
   * @param whichCounter Name of the counter to be used. Can have alphanumerics, slashes and underscores but nothing else
   * @param to How much will the counter reset to (from 100 to 0 for example)
   */
  abstract resetLogCounter(whichCounter: string, to?: number): Promise<number>;
  
  /**
   * Increment system run counter based on which counter is used for this method.
   * Immutable
   */
  abstract incrementSystemRunCounter(): Promise<number>
}