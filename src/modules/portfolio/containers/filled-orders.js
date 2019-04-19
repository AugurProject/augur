import { connect } from "react-redux";

import * as constants from "src/modules/common-elements/constants";
import FilledOrders from "modules/portfolio/components/orders/filled-orders";
import { updateModal } from "modules/modal/actions/update-modal";
import { groupBy, keys, differenceBy } from "lodash";
import { selectMarket } from "modules/markets/selectors/market";

const mapStateToProps = state => {
  const { marketReportState, loginAccount, filledOrders, marketsData } = state;
  const resolvedMarkets = marketReportState.resolved;
  const account = loginAccount.address;
  const userFilledOrders = filledOrders[account] || [];
  const nonFinalizedMarketFilledOrders = differenceBy(
    userFilledOrders,
    resolvedMarkets,
    "marketId"
  );
  const groupedFilledOrders = groupBy(
    nonFinalizedMarketFilledOrders,
    "marketId"
  );

  const marketIds = keys(groupedFilledOrders);
  const markets = marketIds
    .map(m => marketsData[m])
    .map(item => {
      if (!item) return null;

      const marketInfo = selectMarket(item.id);

      return {
        ...item,
        marketStatus: marketInfo.marketStatus,
        recentlyTraded: marketInfo.recentlyTraded,
        filledOrders: selectMarket(item.id).filledOrders
      };
    })
    .filter(
      market => market && market.marketStatus !== constants.MARKET_CLOSED
    );

  /* eslint-disable */
  let allFilledOrders = [];
  marketIds.map(marketId => {
    const formattedFilledOrders = selectMarket(marketId).filledOrders;
    Array.prototype.push.apply(allFilledOrders, formattedFilledOrders);
  });
  /* eslint-disable */

  const marketsObj = markets.reduce((obj, market) => {
    obj[market.id] = market;
    return obj;
  }, {});

  const ordersObj = allFilledOrders.reduce((obj, order) => {
    obj[order.id] = order;
    return obj;
  }, {});

  return {
    markets,
    marketsObj,
    ordersObj,
    filledOrders: allFilledOrders
  };
};

const mapDispatchToProps = dispatch => ({
  claimTradingProceeds: marketId => dispatch(updateModal({ type: constants.MODAL_CLAIM_TRADING_PROCEEDS, marketId }))
});

const FilledOrdersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilledOrders);

export default FilledOrdersContainer;
