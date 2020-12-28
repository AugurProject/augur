import { CallContext } from './call-context';

export interface CallReturnContext extends CallContext {
  // tslint:disable-next-line: no-any
  returnValues: any[];
  /**
   * This stats if it could decode the result or not
   */
  decoded: boolean;
}

// tslint:disable-next-line: no-any
export interface Result extends ReadonlyArray<any> {
  // tslint:disable-next-line: no-any
  readonly [key: string]: any;
}
