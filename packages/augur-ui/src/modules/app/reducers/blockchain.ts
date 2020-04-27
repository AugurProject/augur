import { UPDATE_BLOCKCHAIN } from "modules/app/actions/update-blockchain";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { Blockchain, BaseAction } from "modules/types";
import moment from 'moment';

const DEFAULT_STATE: Blockchain = {
  currentBlockNumber: 0,
  currentAugurTimestamp: moment().unix(), // default to user's time until new block comes in
  lastSyncedBlockNumber: 0,
  blocksBehindCurrent: 0,
  percentSynced: "0"
};

export default function(blockchain = DEFAULT_STATE, { type, data }: BaseAction): Blockchain {
  switch (type) {
    case UPDATE_BLOCKCHAIN:
      return {
        ...blockchain,
        ...data.blockchainData
      };
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return blockchain;
  }
}
