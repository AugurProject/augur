import { augur } from 'services/augurjs';
import { updateAccountPositionsData } from 'modules/my-positions/actions/update-account-trades-data';
import { selectPositionsPlusAsks } from 'modules/user-open-orders/selectors/positions-plus-asks';

export function loadAdjustedPositionsForMarket(account, market, cb) {
  return (dispatch, getState) => {
    if (market) {
      augur.getAdjustedPositions(account, { market }, (err, positions) => {
        if (err) return cb && cb(err);
        dispatch(updateAccountPositionsData(selectPositionsPlusAsks(account, positions, getState().orderBooks), market));
        cb && cb();
      });
    } else {
      cb && cb();
    }
  };
}
