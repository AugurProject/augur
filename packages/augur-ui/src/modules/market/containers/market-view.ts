import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MarketView from 'modules/market/components/market-view/market-view';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import {
  MODAL_MARKET_REVIEW,
  MODAL_MARKET_LOADING,
} from 'modules/common/constants';
import { closeModal } from 'modules/modal/actions/close-modal';
import { loadMarketTradingHistory } from 'modules/markets/actions/market-trading-history-management';
import { addAlert } from 'modules/alerts/actions/alerts';
import { hotloadMarket } from 'modules/markets/actions/load-markets';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => {
  const { setModal } = AppStatus.actions; 
  return {
    hotloadMarket: marketId => hotloadMarket(marketId),
    loadMarketsInfo: marketId => loadMarketsInfo([marketId]),
    updateModal: modal => setModal(modal),
    loadMarketTradingHistory: marketId =>
      dispatch(loadMarketTradingHistory(marketId)),
    marketReviewModal: modal =>
      setModal({
        type: MODAL_MARKET_REVIEW,
        ...modal,
      }),
    showMarketLoadingModal: () =>
      setModal({
        type: MODAL_MARKET_LOADING,
      }),
    closeMarketLoadingModalOnly: (type: string) =>
      type === MODAL_MARKET_LOADING && dispatch(closeModal()),
    addAlert: alert => dispatch(addAlert(alert)),
  };
};
const Market = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MarketView)
);

export default Market;
