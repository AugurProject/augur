export interface CallContext {
  /**
   * Reference to this call context
   */
  reference: string;

  /**
   * your contract method name
   */
  methodName: string;

  /**
   * Method parameters you want it to pass in
   */
  // tslint:disable-next-line: no-any
  methodParameters: any[];

  /**
   *  Context is a generic databucket
   */
  // tslint:disable-next-line: no-any
  context?: any;
}
