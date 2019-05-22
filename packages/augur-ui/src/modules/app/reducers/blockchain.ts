import { UPDATE_BLOCKCHAIN } from "modules/app/actions/update-blockchain";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { Blockchain, BaseAction } from "modules/types";

const DEFAULT_STATE: Blockchain = {
  currentBlockNumber: 0,
  currentAugurTimestamp: 0,
  highestBlock: 0,
  lastProcessedBlock: 0,
};

export default function(blockchain = DEFAULT_STATE, { type, data }: BaseAction) {
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
