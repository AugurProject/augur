import { SyncableDB } from "./SyncableDB";
import { Augur, ParsedLog } from 'augur-api';
import { DB } from './DB';


export class UserSyncableDB<TBigNumber> extends SyncableDB<TBigNumber> {
    public user: string;
    private additionalTopics: Array<string | Array<string>>;

    constructor(dbController: DB<TBigNumber>, eventName: string, user: string, numAdditionalTopics: number, userTopicIndex: number) {
        const dbName = `${eventName}-${user}`;
        super(dbController, eventName, dbName);
        this.user = user;
        const bytes32User = `0x000000000000000000000000${this.user.substr(2)}`;
        this.additionalTopics = [];
        this.additionalTopics.fill("", numAdditionalTopics);
        this.additionalTopics[userTopicIndex] = bytes32User;
        console.log(JSON.stringify(this.additionalTopics));
    }

    protected async getLogs(augur: Augur<TBigNumber>, startBlock: number, endBlock: number): Promise<Array<ParsedLog>> {
        return await augur.events.getLogs(this.eventName, startBlock, endBlock, this.additionalTopics);
    }
}
