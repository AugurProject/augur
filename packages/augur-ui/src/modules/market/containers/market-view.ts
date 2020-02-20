import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MarketView from 'modules/market/components/market-view/market-view';
import {
  loadMarketsInfo
} from "modules/markets/actions/load-markets-info";
import {
  selectMarket,
  selectSortedMarketOutcomes,
} from 'modules/markets/selectors/market';
import parseQuery from 'modules/routes/helpers/parse-query';
import {
  MARKET_ID_PARAM_NAME,
  OUTCOME_ID_PARAM_NAME,
} from 'modules/routes/constants/param-names';
import {
  MODAL_MARKET_REVIEW,
  MARKET_REVIEW_SEEN,
  MODAL_MARKET_LOADING,
  TRADING_TUTORIAL,
  CATEGORICAL,
  TRADING_TUTORIAL_OUTCOMES,
  TUTORIAL_ORDER_BOOK,
  TUTORIAL_TRADING_HISTORY,
  SCALAR_MODAL_SEEN,
} from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';
import { selectCurrentTimestampInSeconds } from 'appStore/select-state';
import { updateModal } from 'modules/modal/actions/update-modal';
import { closeModal } from 'modules/modal/actions/close-modal';
import { loadMarketTradingHistory } from 'modules/markets/actions/market-trading-history-management';
import { EMPTY_STATE } from 'modules/create-market/constants';
import { NewMarket } from 'modules/types';
import deepClone from 'utils/deep-clone';
import { addAlert, removeAlert } from 'modules/alerts/actions/alerts';
import { hotloadMarket } from 'modules/markets/actions/load-markets';
import {
  getMarketAgeInDays,
  convertUnixToFormattedDate,
} from 'utils/format-date';
import { AppState } from 'appStore';
import { loadMarketOrderBook, clearOrderBook } from 'modules/orders/actions/load-market-orderbook';

const mapStateToProps = (state: AppState, ownProps) => {
  const { connection, universe, modal, loginAccount, orderBooks } = state;
  const marketId = parseQuery(ownProps.location.search)[MARKET_ID_PARAM_NAME];
  const queryOutcomeId = parseQuery(ownProps.location.search)[
    OUTCOME_ID_PARAM_NAME
  ];
  const outcomeId = queryOutcomeId ? parseInt(queryOutcomeId) : null;

  let market = null;
  const tradingTutorial = marketId === TRADING_TUTORIAL;
  if (tradingTutorial) {
    // TODO move trading tutorial market state to constants
    market = {
      ...deepClone<NewMarket>(EMPTY_STATE),
      id: TRADING_TUTORIAL,
      description:
        'Which NFL team will win: Los Angeles Rams vs New England Patriots Scheduled start time: October 27, 2019 1:00 PM ET',
      numOutcomes: 4,
      defaultSelectedOutcomeId: 1,
      marketType: CATEGORICAL,
      endTimeFormatted: convertUnixToFormattedDate(1668452763),
      creationTimeFormatted: convertUnixToFormattedDate(1573585563),
      outcomesFormatted: TRADING_TUTORIAL_OUTCOMES,
      groupedTradeHistory: TUTORIAL_TRADING_HISTORY,
      orderBook: TUTORIAL_ORDER_BOOK,
    };
  } else {
    market = ownProps.market || selectMarket(marketId);
  }

  const marketReviewSeen =
    tradingTutorial ||
    (windowRef &&
      windowRef.localStorage &&
      Boolean(windowRef.localStorage.getItem(MARKET_REVIEW_SEEN)));

  const scalarModalSeen =
    Boolean(modal.type) ||
    windowRef &&
    windowRef.localStorage &&
    windowRef.localStorage.getItem(SCALAR_MODAL_SEEN) === 'true';

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

  let orderBook = null;
  if (market && !tradingTutorial && !ownProps.preview) {
    orderBook = orderBooks[marketId]
  }

  if (market && (tradingTutorial || ownProps.preview)) {
    orderBook = market.orderBook;
  }

  const daysPassed =
    market &&
    market.creationTime &&
    getMarketAgeInDays(
      market.creationTime,
      selectCurrentTimestampInSeconds(state)
    );

  return {
    modalShowing: modal.type,
    orderBook,
    daysPassed,
    isMarketLoading: false,
    preview: tradingTutorial || ownProps.preview,
    tradingTutorial,
    currentTimestamp: selectCurrentTimestampInSeconds(state),
    outcomes: market.outcomes || [],
    isConnected: connection.isConnected && universe.id != null,
    marketType: market.marketType,
    description: market.description || '',
    market,
    marketId,
    universe,
    outcomeId,
    marketReviewSeen,
    scalarModalSeen,
    sortedOutcomes: selectSortedMarketOutcomes(
      market.marketType,
      market.outcomesFormatted
    ),
    account: loginAccount.address,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  hotloadMarket: marketId => hotloadMarket(marketId),
  loadMarketsInfo: marketId => dispatch(loadMarketsInfo([marketId])),
  loadMarketOrderBook: marketId => dispatch(loadMarketOrderBook(marketId)),
  clearOrderBook: () => dispatch(clearOrderBook()),
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
  closeMarketLoadingModalOnly: (type: string) => type === MODAL_MARKET_LOADING && dispatch(closeModal()),
  addAlert: alert => dispatch(addAlert(alert)),
  removeAlert: (id: string, name: string) => dispatch(removeAlert(id, name)),
});

const Market = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketView)
);

export default Market;
