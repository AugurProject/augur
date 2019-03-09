import { DB } from "./DB";
import { SyncableDB } from "./SyncableDB";

/**
 * Stores event logs for user-specific events.
 *
 * TODO Remove this class if it is not needed
 */
export class UserSyncableDB<TBigNumber> extends SyncableDB<TBigNumber> {
    public readonly user: string;

    constructor(dbController: DB<TBigNumber>, networkId: number, eventName: string, user: string) {
        super(dbController, networkId, eventName, dbController.getDatabaseName(eventName, user));
        this.user = user;
    }
}
