import { PouchDBFactoryType } from "../db/AbstractDB";
import PouchDB from "pouchdb";

export function makeMock() {
  const mockState = {
      willFailNext: false
  };

  class MockPouchDB extends PouchDB {
      allDocs<Model>(options?: any): Promise<any> {
          if (mockState.willFailNext) {
              mockState.willFailNext = false;
              throw Error("This was a failure")
          }
          if (options) {
              return super.allDocs(options);
          } else {
              return super.allDocs();
          }

      }
  }

  function makeFactory (): PouchDBFactoryType {
      return (dbName: string) => new MockPouchDB(`db/${dbName}`, { adapter: "memory" })
  }

  return {
      makeFactory,
      failNext: () => mockState.willFailNext = true
  }
}
