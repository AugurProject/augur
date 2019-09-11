import { PouchDBFactoryType } from '@augurproject/sdk/build/state/db/AbstractDB';
import * as Sync from '@augurproject/sdk/build/state/Sync';
import { SEOConnector } from '@augurproject/sdk/build/connector/seo-connector';

export class TestConnector extends SEOConnector {
  constructor(private pouchDBFactory: PouchDBFactoryType) {
    super();
  }

  async connect(ethNodeUrl: string, account?: string): Promise<any> {
    this.api = await Sync.start(ethNodeUrl, account, true, this.pouchDBFactory);
  }

  bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.api.route(f.name, params);
    };
  }

}
