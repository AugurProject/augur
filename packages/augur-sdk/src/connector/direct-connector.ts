import { Augur } from '../Augur';
import { SubscriptionEventName } from '../constants';
import { Callback } from '../events';
import { BaseConnector } from '../connector/baseConnector';
import { DB } from '../state/db/DB';

export class DirectConnector extends BaseConnector {
    augur: Augur;
    db: DB;

    initialize(augur: Augur, db: DB): void {
        this.augur = augur;
        this.db = db;
    }

    async connect(params?: any): Promise<any> {
        return true;
    }

    async disconnect(): Promise<any> {
        return true;
    }

    // bind API calls
    bindTo<R, P>(f: (augur: Augur, db: DB, params: P) => Promise<R>): (params: P) => Promise<R> {
        return async (params: P): Promise<R> => {
            return f(this.augur, this.db, params);
        };
    }

    async syncUserData(account: string): Promise<any> {
        await this.db.addTrackedUser(account, 100000, 10);
    }

    async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void> {
    }

    async off(eventName: SubscriptionEventName | string): Promise<void> {
    }
}
