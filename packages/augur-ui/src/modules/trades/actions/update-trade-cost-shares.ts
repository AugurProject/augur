import { createBigNumber } from 'utils/create-big-number';
import { augur } from 'services/augurjs';
import { BUY, ZERO } from 'modules/common/constants';
import logError from 'utils/log-error';
import { generateTrade } from 'modules/trades/helpers/generate-trade';
import { buildDisplayTrade } from 'modules/trades/helpers/build-display-trade';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback, MarketData } from 'modules/types';
import { simulateTrade } from 'modules/contracts/actions/contractCalls';
import { SimulateTradeData } from '@augurproject/sdk/build';

// Updates user's trade. Only defined (i.e. !== null) parameters are updated
export function updateTradeCost({
  marketId,
  outcomeId,
  side,
  numShares,
  limitPrice,
  selfTrade,
  callback = logError,
}: any) {
  return (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    if (!side || !numShares || !limitPrice) {
      return callback('side or numShare or limitPrice is not provided');
    }

    const {
      marketsData,
      loginAccount,
      orderBooks,
      outcomesData,
      accountPositions,
      accountShareBalances,
    } = getState();
    const market = marketsData[marketId];
    const outcome = outcomesData[marketId][outcomeId];

    const newTradeDetails = {
      side,
      numShares,
      limitPrice,
      totalFee: '0',
      totalCost: '0',
      selfTrade,
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
  callback = logError,
}: any) {
  return (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    if (!side || !maxCost || !limitPrice) {
      return callback('side or numShare or limitPrice is not provided');
    }

    const {
      marketsData,
      loginAccount,
      outcomesData,
      accountPositions,
      accountShareBalances,
      orderBooks,
    } = getState();
    const market = marketsData[marketId];

    const newTradeDetails: any = {
      side,
      maxCost,
      limitPrice,
      totalFee: '0',
      totalCost: '0',
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

async function runSimulateTrade(
  newTradeDetails: any,
  market: MarketData,
  marketId: any,
  outcomeId: any,
  loginAccount: any,
  orderBooks: any,
  outcome: any,
  accountPositions: any,
  accountShareBalances: any,
  callback: NodeStyleCallback
) {
  let userShareBalance = new Array(market.numOutcomes).fill('0');
  let userNetPositions = new Array(market.numOutcomes).fill('0');
  let sharesFilledAvgPrice = '';
  let reversal = null;
  const userMarketShareBalances = accountShareBalances[marketId];
  const positions = (accountPositions[marketId] || {}).tradingPositions;
  if (positions) {
    userNetPositions = Object.keys(positions).reduce(
      (r: any, outcomeId: any) => {
        r[outcomeId] = positions[outcomeId].netPosition;
        return r;
      },
      userNetPositions
    );
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
      // @ts-ignore
      reversal = {
        quantity: createBigNumber(quantity)
          .abs()
          .toString(),
        price,
      };
    }
  }

  const orderType: 0 | 1 = newTradeDetails.side === BUY ? 0 : 1;
  const ignoreShares = false; // TODO: get this from order form
  const affiliateAddress = ''; // TODO: get this from state
  const kycToken = ''; // TODO: figure out how kyc tokens are going to be handled
  const doNotCreateOrders = false; // TODO: this needs to be passed from order form
  const outcomeIdx = parseInt(outcomeId, 10);

  /*
  const simulatedTradeOld = augur.trading.simulateTrade({
    orderType: newTradeDetails.side === BUY ? 0 : 1,
    outcome: outcomeIndex,
    shareBalances: userShareBalance,
    tokenBalance: (loginAccount.eth && loginAccount.eth.toString()) || '0',
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
    reportingFeeRate: market.reportingFeeRate,
  });
*/
  const userShares = ignoreShares ? 0 : userShareBalance[outcomeIdx];

  const simulateTradeValue: SimulateTradeData = await simulateTrade(
    orderType,
    marketId,
    market.numOutcomes,
    parseInt(outcomeId, 10),
    ignoreShares,
    affiliateAddress,
    kycToken,
    doNotCreateOrders,
    market.numTicks,
    market.minPrice,
    market.maxPrice,
    newTradeDetails.numShares,
    newTradeDetails.limitPrice,
    userShares
  );

  const totalFee = createBigNumber(simulateTradeValue.settlementFees, 10);
  newTradeDetails.totalFee = totalFee.toFixed();
  newTradeDetails.totalCost = simulateTradeValue.tokensDepleted;
  newTradeDetails.shareCost = simulateTradeValue.sharesDepleted;
  newTradeDetails.feePercent = totalFee
    .dividedBy(createBigNumber(simulateTradeValue.tokensDepleted, 10))
    .toFixed();
  if (isNaN(newTradeDetails.feePercent)) newTradeDetails.feePercent = '0';
  // @ts-ignore
  simulatedTrade.tradeGroupId = augur.trading.generateTradeGroupId();

  const tradeInfo = {
    ...newTradeDetails,
    ...simulateTradeValue,
    sharesFilledAvgPrice,
    userNetPositions,
    userShareBalance,
    reversal,
  };

  const order = generateTrade(market, tradeInfo);

  // build display values for order form confirmation
  const displayTrade = generateTrade(
    market,
    buildDisplayTrade({
      ...tradeInfo,
      outcomeId,
    })
  );

  if (callback) callback(null, { ...order, ...simulateTradeValue, displayTrade });
}
