import { syncBlockchain } from "modules/app/actions/sync-blockchain";
import syncUniverse from "modules/universe/actions/sync-universe";

export const handleNewBlock = block => dispatch => {
  dispatch(syncBlockchain());
  dispatch(syncUniverse());
};
