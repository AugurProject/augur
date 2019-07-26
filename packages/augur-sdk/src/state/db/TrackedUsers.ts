import { getAddress } from "ethers/utils/address";
import { AbstractDB, PouchDBFactoryType } from "./AbstractDB";
import * as _ from "lodash";

export class TrackedUsers extends AbstractDB {
  constructor(networkId: number, dbFactory: PouchDBFactoryType) {
    super(networkId, networkId + "-TrackedUsers", dbFactory);
  }

  async setUserTracked(user: string): Promise<PouchDB.UpsertResponse> {
    try {
      const formattedUser = getAddress(user);
      return this.upsertDocument(formattedUser, {});
    } catch (err) {
      throw err;
    }
  }

  async getUsers(): Promise<string[]> {
    const docs = await this.db.allDocs();
    return _.map(docs.rows, "id");
  }
}
