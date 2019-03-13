import {AbstractDB, PouchDBFactoryType} from "./AbstractDB";
import * as _ from "lodash";

export class TrackedUsers extends AbstractDB {
  constructor(networkId: number, dbFactory: PouchDBFactoryType) {
    super(networkId, networkId + "-TrackedUsers", dbFactory);
  }

  public async setUserTracked(user: string): Promise<PouchDB.Core.Response> {
    return await this.upsertDocument(user, {});
  }

  public async getUsers(): Promise<Array<string>> {
    const docs = await this.db.allDocs();
    return _.map(docs.rows, "id");
  }
}
