import { BigNumber } from "ethers/utils/bignumber";
import { ACCOUNTS, makeDbMock, makeTestAugur } from "../../libs";
import { UserSyncableDB } from "@augurproject/state/src/db/UserSyncableDB";

const mock = makeDbMock();

// UserSyncableDB overrides protected getLogs class, which is only called in sync.
test("sync", async () => {

  // const augur = await makeTestAugur(ACCOUNTS);
  // const dbController = await mock.makeDB(augur, ACCOUNTS);
  //
  // const eventName = "foo";
  // const user = "artistotle";
  // const numAdditionalTopics = 0;
  // const userTopicIndex = 0;
  // const highestAvailableBlockNumber = 0;
  // const db = new UserSyncableDB<BigNumber>(dbController, mock.constants.networkId, eventName, user, numAdditionalTopics, userTopicIndex);
  //
  // // TODO verify props since constructor does some processing
  //
  // await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay, highestAvailableBlockNumber);
  //
  // console.log(Object.keys(mock.getDatabases()));
  //
  // expect(1).toBe(2);
});
