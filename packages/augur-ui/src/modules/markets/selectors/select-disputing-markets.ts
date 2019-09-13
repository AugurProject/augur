import { createSelector } from 'reselect';
import { selectMarketInfosState } from 'store/select-state';
import { selectMarket } from 'modules/markets/selectors/market';
import { REPORTING_STATE } from 'modules/common/constants';

export const disputingMarkets = state => selectDisputingMarkets(state);

const selectDisputingMarkets = createSelector(
  selectMarketInfosState,
  marketInfos => {
    return Object.keys(marketInfos).reduce((p, id) => {
      const reportingState = marketInfos[id].reportingState;
      if (
        reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE ||
        REPORTING_STATE.AWAITING_NEXT_WINDOW
      ) {
        return { ...p, [id]: selectMarket(id) };
      }
      return p;
    }, {});
  }
);
