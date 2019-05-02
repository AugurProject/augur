import { createBigNumber } from "utils/create-big-number";
import { augur } from "services/augurjs";
import { BUY, ZERO } from "modules/common-elements/constants";
import logError from "utils/log-error";
import { generateTrade } from "modules/trades/helpers/generate-trade";
import { buildDisplayTrade } from "modules/trades/helpers/build-display-trade";

// Updates user's trade. Only defined (i.e. !== null) parameters are updated
export function updateTradeCost({
  marketId,
  outcomeId,
  side,
  numShares,
  limitPrice,
  selfTrade,
  callback = logError
}) {
  return (dispatch, getState) => {
    if (!side || !numShares || !limitPrice) {
      return callback("side or numShare or limitPrice is not provided");
    }

    const {
      marketsData,
      loginAccount,
      orderBooks,
      outcomesData,
      accountPositions,
      accountShareBalances
    } = getState();
    const market = marketsData[marketId];
    const outcome = outcomesData[marketId][outcomeId];

    const newTradeDetails = {
      side,
      numShares,
      limitPrice,
      totalFee: "0",
      totalCost: "0",
      selfTrade
    };

    return runSimulateTrade(
      newTradeDetails,
      market,
      marketId,
      outcomeId,
      loginAccount,
      orderBooks,
      outcome,
      accountPositions,
      accountShareBalances,
      callback
    );
  };
}

export function updateTradeShares({
  marketId,
  outcomeId,
  side,
  maxCost,
  limitPrice,
  callback = logError
}) {
  return (dispatch, getState) => {
    if (!side || !maxCost || !limitPrice) {
      return callback("side or numShare or limitPrice is not provided");
    }

    const {
      marketsData,
      loginAccount,
      outcomesData,
      accountPositions,
      accountShareBalances,
      orderBooks
    } = getState();
    const market = marketsData[marketId];

    const newTradeDetails = {
      side,
      maxCost,
      limitPrice,
      totalFee: "0",
      totalCost: "0"
    };

    /*
    market -5 => 10
    Ultimate values we want: quantity 10, price 0, maxCost 50/100 (long/short)

    Range = Max - Min = 10 - -5 = 15
    scaledPrice = price + abs(min) = 0 + [-5] = 5

    Find MaxCost:
    quantity * scaledPrice = MaxCostLong => 10 * 5 = 50
    (Range * quantity) - MaxCostLong = maxCostShort => (15 * 10) - 50 = 100

    Find Quantity:
    MaxCostLong / scaledPrice = quantityLong => 50 / 5 = 10
    MaxCostShort /(range - scaledPrice) = quantityShort => 100 / (15 - 5) = 10
    */

    // calculate num shares
    const marketMaxPrice = createBigNumber(market.maxPrice);
    const marketMinPrice = createBigNumber(market.minPrice);
    const marketRange = marketMaxPrice.minus(market.minPrice);
    const scaledPrice = createBigNumber(limitPrice).plus(marketMinPrice.abs());

    let newShares = createBigNumber(maxCost).dividedBy(
      marketRange.minus(scaledPrice)
    );
    if (side === BUY) {
      newShares = createBigNumber(maxCost).dividedBy(scaledPrice);
    }
    newTradeDetails.numShares = newShares
      .abs()
      .toNumber()
      .toString();
    const outcome = outcomesData[marketId][outcomeId];

    return runSimulateTrade(
      newTradeDetails,
      market,
      marketId,
      outcomeId,
      loginAccount,
      orderBooks,
      outcome,
      accountPositions,
      accountShareBalances,
      callback
    );
  };
}

function runSimulateTrade(
  newTradeDetails,
  market,
  marketId,
  outcomeId,
  loginAccount,
  orderBooks,
  outcome,
  accountPositions,
  accountShareBalances,
  callback
) {
  let userShareBalance = new Array(market.numOutcomes).fill("0");
  let userNetPositions = new Array(market.numOutcomes).fill("0");
  let sharesFilledAvgPrice = "";
  let reversal = null;
  const userMarketShareBalances = accountShareBalances[marketId];
  const positions = (accountPositions[marketId] || {}).tradingPositions;
  if (positions) {
    userNetPositions = Object.keys(positions).reduce((r, outcomeId) => {
      r[outcomeId] = positions[outcomeId].netPosition;
      return r;
    }, userNetPositions);
    userShareBalance = userMarketShareBalances || [];
    sharesFilledAvgPrice = (positions[outcomeId] || {}).averagePrice;
    const outcomeIndex = parseInt(outcomeId, 10);
    const outcomeNetPosition = createBigNumber(userNetPositions[outcomeIndex]);
    const isReversal =
      newTradeDetails.side === BUY
        ? outcomeNetPosition.lt(ZERO)
        : outcomeNetPosition.gt(ZERO);
    if (isReversal) {
      const { netPosition: quantity, averagePrice: price } = positions[
        outcomeIndex
      ];
      reversal = {
        quantity: createBigNumber(quantity)
          .abs()
          .toString(),
        price
      };
    }
  }

  const simulatedTrade = augur.trading.simulateTrade({
    orderType: newTradeDetails.side === BUY ? 0 : 1,
    outcome: parseInt(outcomeId, 10),
    shareBalances: userShareBalance,
    tokenBalance: (loginAccount.eth && loginAccount.eth.toString()) || "0",
    userAddress: loginAccount.address,
    minPrice: market.minPrice,
    maxPrice: market.maxPrice,
    price: newTradeDetails.limitPrice,
    shares: newTradeDetails.numShares,
    marketCreatorFeeRate: market.marketCreatorFeeRate,
    singleOutcomeOrderBook:
      (orderBooks && orderBooks[marketId] && orderBooks[marketId][outcomeId]) ||
      {},
    shouldCollectReportingFees: !market.isDisowned,
    reportingFeeRate: market.reportingFeeRate
  });
  const totalFee = createBigNumber(simulatedTrade.settlementFees, 10);
  newTradeDetails.totalFee = totalFee.toFixed();
  newTradeDetails.totalCost = simulatedTrade.tokensDepleted;
  newTradeDetails.shareCost = Number(simulatedTrade.sharesDepleted)
    ? simulatedTrade.sharesDepleted
    : simulatedTrade.otherSharesDepleted;
  newTradeDetails.feePercent = totalFee
    .dividedBy(createBigNumber(simulatedTrade.tokensDepleted, 10))
    .toFixed();
  if (isNaN(newTradeDetails.feePercent)) newTradeDetails.feePercent = "0";
  simulatedTrade.tradeGroupId = augur.trading.generateTradeGroupId();

  const tradeInfo = {
    ...newTradeDetails,
    ...simulatedTrade,
    sharesFilledAvgPrice,
    userNetPositions,
    userShareBalance,
    reversal
  };

  const order = generateTrade(market, tradeInfo);

  // build display values for order form confirmation
  const displayTrade = generateTrade(
    market,
    buildDisplayTrade({
      ...tradeInfo,
      outcomeId
    })
  );

  if (callback) callback(null, { ...order, ...simulatedTrade, displayTrade });
}
