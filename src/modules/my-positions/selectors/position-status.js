import store from 'src/store';
import { closePosition } from 'modules/my-positions/actions/close-position';

export default () => {
  const { positionStatus } = store.getState();

  return {
    ...positionStatus,
    closePosition: (marketID, outcomeID) => {
      store.dispatch(closePosition(marketID, outcomeID));
    }
  };
};
