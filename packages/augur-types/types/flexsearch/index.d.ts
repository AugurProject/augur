// Type definitions for flexsearch 0.6
// Project: https://github.com/nextapps-de/flexsearch/
// Definitions by: Brian Woods <https://github.com/brianosaurus>

/*~ Note that ES6 modules cannot directly export class objects.
 *~ This file should be imported using the CommonJS-style:
 *~   import x = require('flexsearch');
 */

declare module "flexsearch" {
  interface options {
    encode?: string;
    tokenize?: string;
    threshold?: number;
    async?: boolean;
    worker?: boolean;
    cache?: boolean;
    doc?: object;
  }

  interface market {
    title: string;
    description: string;
    tags: string;
    start: Date;
    end: Date;
  }

  class FlexSearch {
    constructor(mode: string, options?: options);
    constructor(options?: options);
    constructor();

    add(id: number, value: market): void;
    add(data: object): void;
    search(s: string, limit?: number, callback?: (result: Array<object>) => void): Array<object>;
    update(id: number, value: string): void;
    remove(id: number): void;
    clear(): void;
    destroy(): void;
    init(options?: options): void;
    find(id: number): object;

    static create(options?: options): FlexSearch;
  }

  export = FlexSearch;
}
