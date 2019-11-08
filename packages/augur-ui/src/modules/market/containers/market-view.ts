import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MarketView from 'modules/market/components/market-view/market-view';
import { loadFullMarket } from 'modules/markets/actions/load-full-market';
import { selectMarket, selectSortedMarketOutcomes } from 'modules/markets/selectors/market';
import parseQuery from 'modules/routes/helpers/parse-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import {
  MODAL_MARKET_REVIEW,
  MARKET_REVIEW_SEEN,
  MODAL_MARKET_LOADING,
  TRADING_TUTORIAL,
  TUTORIAL_QUANTITY,
  TUTORIAL_PRICE,
  CATEGORICAL,
  TRADING_TUTORIAL_OUTCOMES,
} from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';
import { selectCurrentTimestampInSeconds } from 'store/select-state';
import { updateModal } from 'modules/modal/actions/update-modal';
import { closeModal } from 'modules/modal/actions/close-modal';
import { loadMarketTradingHistory } from 'modules/markets/actions/market-trading-history-management';
import { EMPTY_STATE } from 'modules/create-market/constants';
import { NewMarket } from 'modules/types';
import deepClone from 'utils/deep-clone';
import { formatDai, formatShares } from 'utils/format-number';
import { createBigNumber } from 'utils/create-big-number';
import { removePendingOrder } from 'modules/orders/actions/pending-orders-management';
import { addAlert, removeAlert } from 'modules/alerts/actions/alerts';
import { hotloadMarket } from 'modules/markets/actions/load-markets';
import { getMarketAgeInDays } from 'utils/format-date';

const mapStateToProps = (state, ownProps) => {
  const { connection, universe } = state;
  const marketId = parseQuery(ownProps.location.search)[MARKET_ID_PARAM_NAME];
  let market = {};
  const tradingTutorial = marketId === TRADING_TUTORIAL;
  if (tradingTutorial) {
    // TODO move trading tutorial market state to constants
    market = {
      ...deepClone<NewMarket>(EMPTY_STATE),
      id: TRADING_TUTORIAL,
      description: 'Which NFL team will win: Los Angeles Rams vs New England Patriots Scheduled start time: October 27, 2019 1:00 PM ET',
      numOutcomes:  4,
      marketType: CATEGORICAL,
      outcomesFormatted: TRADING_TUTORIAL_OUTCOMES,
      orderBook: {
        1: [
          {
            avgPrice: formatDai(TUTORIAL_PRICE),
            cumulativeShares: TUTORIAL_QUANTITY.toString(),
            id: 1,
            mySize: '0',
            orderEstimate: createBigNumber(.4),
            outcomeId: 2,
            outcomeName: 'Los Angeles Rams',
            price: TUTORIAL_PRICE.toString(),
            quantity: TUTORIAL_QUANTITY.toString(),
            shares: TUTORIAL_QUANTITY.toString(),
            sharesEscrowed: formatShares(TUTORIAL_QUANTITY),
            tokensEscrowed: formatDai(TUTORIAL_PRICE),
            type: 'buy',
            unmatchedShares: formatShares(TUTORIAL_QUANTITY)
          }
        ]
      }
    };
  } else {
    market = ownProps.market || selectMarket(marketId)
  }

  const marketReviewSeen =
   tradingTutorial ||
    (windowRef &&
    windowRef.localStorage &&
    Boolean(windowRef.localStorage.getItem(MARKET_REVIEW_SEEN)));

  if (market === null) {
    return {
      tradingTutorial,
      isMarketLoading: true,
      isConnected: connection.isConnected && universe.id != null,
      canHotload: connection.canHotload,
      marketId,
      marketReviewSeen,
    };
  }

  const daysPassed =
    market &&
    market.creationTime &&
    getMarketAgeInDays(market.creationTime, selectCurrentTimestampInSeconds(state));

  return {
    daysPassed,
    preview: tradingTutorial,
    tradingTutorial,
    currentTimestamp: selectCurrentTimestampInSeconds(state),
    outcomes: market.outcomes || [],
    isConnected: connection.isConnected && universe.id != null,
    marketType: market.marketType,
    description: market.description || '',
    market,
    marketId,
    universe,
    marketReviewSeen,
    sortedOutcomes: selectSortedMarketOutcomes(
      market.marketType,
      market.outcomesFormatted
    ),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  hotloadMarket: marketId => hotloadMarket(marketId),
  loadFullMarket: marketId => dispatch(loadFullMarket(marketId)),
  updateModal: modal => dispatch(updateModal(modal)),
  loadMarketTradingHistory: marketId =>
    dispatch(loadMarketTradingHistory(marketId)),
  marketReviewModal: modal =>
    dispatch(
      updateModal({
        type: MODAL_MARKET_REVIEW,
        ...modal,
      })
    ),
  showMarketLoadingModal: () =>
    dispatch(
      updateModal({
        type: MODAL_MARKET_LOADING,
      })
    ),
    closeMarketLoadingModal: () => dispatch(closeModal()),
    addAlert: (alert) => dispatch(addAlert(alert)),
    removeAlert: (id: string, name: string) => dispatch(removeAlert(id, name)),
});

const Market = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketView)
);

export default Market;
