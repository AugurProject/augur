import { UPDATE_BLOCKCHAIN } from "modules/app/actions/update-blockchain";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(blockchain = DEFAULT_STATE, { type, data }) {
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
