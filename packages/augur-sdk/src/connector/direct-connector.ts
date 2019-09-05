import { Augur } from "../Augur";
import { SubscriptionEventName } from "../constants";
import { Callback } from "../events";
import { BaseConnector } from "../connector/baseConnector";
import { DB } from "../state/db/DB";

export class DirectConnector extends BaseConnector {
    public augur: Augur;
    public db: DB;

    public initialize(augur: Augur, db: DB): void {
        this.augur = augur;
        this.db = db;
    }

    public async connect(params?: any): Promise<any> {
        return true;
    }

    public async disconnect(): Promise<any> {
        return true;
    }

    // bind API calls
    public bindTo<R, P>(f: (augur: any, db: any, params: P) => Promise<R>): (params: P) => Promise<R> {
        return async (params: P): Promise<R> => {
            return f(this.augur, this.db, params);
        };
    }

    async syncUserData(account: string): Promise<any> {
        await this.db.addTrackedUser(account, 100000, 10);
    }

    public async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void> {
    }

    public async off(eventName: SubscriptionEventName | string): Promise<any> {
    }
}
