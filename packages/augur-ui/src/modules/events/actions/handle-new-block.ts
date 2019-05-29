import { syncBlockchain } from "modules/app/actions/sync-blockchain";
import syncUniverse from "modules/universe/actions/sync-universe";

export const handleNewBlock = (block: any) => (dispatch: ThunkDispatch<void, any, Action>) => {
  const number = parseInt(block.number, 16);
  dispatch(syncBlockchain());
  dispatch(syncUniverse(number));
};
