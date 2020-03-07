import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { MarketOrderbookRefresher } from 'modules/market/components/market-view/market-orderbook-refresher';
import parseQuery from 'modules/routes/helpers/parse-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import { TRADING_TUTORIAL } from 'modules/common/constants';
import { AppState } from 'store';
import { loadMarketOrderBook } from 'modules/orders/actions/load-market-orderbook';
import { augurSdk } from 'services/augursdk';
import { selectCurrentTimestampInSeconds } from 'store/select-state';

const mapStateToProps = (state: AppState, ownProps) => {
  const { orderBooks } = state;
  const currentTimestamp = selectCurrentTimestampInSeconds(state);
  const marketId = parseQuery(ownProps.location.search)[MARKET_ID_PARAM_NAME];
  const tradingTutorial = marketId === TRADING_TUTORIAL;

  const expirationTime = tradingTutorial || !!!orderBooks[marketId] ? 0 : orderBooks[marketId].expirationTime;

  const getGasConfirmEstimate = async () => {
    const augur = augurSdk.get();
    const gasConfirmTime = await augur.getGasConfirmEstimate();
    return gasConfirmTime;
  };

  return {
    expirationTime,
    getGasConfirmEstimate,
    currentTimestamp,
    marketId
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadMarketOrderBook: marketId => dispatch(loadMarketOrderBook(marketId)),
});

const mergeProps = (sP: any, dP: any, oP: any) => {

  return {
    ...sP,
    loadMarketOrderBook: () => dP.loadMarketOrderBook(sP.marketId),
  }
}
const Market = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(MarketOrderbookRefresher)
);

export default Market;
