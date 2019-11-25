import { Augur } from '../../Augur';
import { DB } from '../db/DB';
import { Router } from './Router';

// Getters are evaluated by importing these files in this manner
import './Markets';
import './Ping';
import './OnChainTrading';
import './Users';
import './Accounts';
import './Universe';
import './Liquidity';
import './ZeroXOrdersGetters';
import './status';
import './Platform';

export class API {
  augur: Augur;
  db: Promise<DB>;
  private readonly router: Router;

  constructor(augur: Augur, db: Promise<DB>) {
    this.augur = augur;
    this.db = db;
    this.router = new Router(augur, db);
  }

  async route(name: string, params: any) {
    return this.router.route(name, params);
  }
}
