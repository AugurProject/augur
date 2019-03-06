// Type definitions for flexsearch 0.6
// Project: https://github.com/nextapps-de/flexsearch/
// Definitions by: My Self <https://github.com/me>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/*~ Note that ES6 modules cannot directly export class objects.
 *~ This file should be imported using the CommonJS-style:
 *~   import x = require('someLibrary');
 *~
 *~ Refer to the documentation to understand common
 *~ workarounds for this limitation of ES6 modules.
 */

/*~ If this module is a UMD module that exposes a global variable 'myClassLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
export as namespace FlexSearch;

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */
export = FlexSearch;

export interface options {
  encode?: string;
  tokenize?: string;
  threshold?: integer;
  async?: boolean;
  worker?: boolean;
  cache?: boolean;
  doc?: object;
}

export interface market {
  title: string;
  description: string;
  tags: string;
  start: Date;
  end: Date;
}

/*~ Write your module's methods and properties in this class */
declare class FlexSearch {
  constructor(mode: string, options?: options);
  constructor(options?: options);
  constructor();

  add(id: integer, value: market): void;
  add(data: object): void;

  search(s: string, limit?: integer, callback?: (result: Array<object>) => void): Array<object>;
  update(id: integer, value: string): void;
  remove(id: integer): void;
  clear(): void;
  destroy(): void;
  init(options?: options): void;
  find(id: integer) : object;

  static create(options?: options): FlexSearch;
}
