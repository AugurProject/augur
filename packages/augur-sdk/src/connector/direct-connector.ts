import { Augur } from "../Augur";
import { SubscriptionEventName } from "../constants";
import { Callback } from "../events";
import { BaseConnector } from "../connector/baseConnector";
import { DB } from "../state/db/DB";

class DirectConnector extends BaseConnector {
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
    public bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
        return async (params: P): Promise<R> => {
            return f(this.db, this.augur, params);
        };
    }

    public async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void> {
    }

    public async off(eventName: SubscriptionEventName | string): Promise<any> {
    }
}
