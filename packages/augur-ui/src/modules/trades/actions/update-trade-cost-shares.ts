import { createBigNumber } from 'utils/create-big-number';
import { BUY, ZERO } from 'modules/common/constants';
import logError from 'utils/log-error';
import { generateTrade } from 'modules/trades/helpers/generate-trade';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback, MarketData, LoginAccount } from 'modules/types';
import { simulateTrade, simulateTradeGasLimit } from 'modules/contracts/actions/contractCalls';
import { SimulateTradeData } from '@augurproject/sdk/build';
import { MarketInfo } from '@augurproject/sdk/build/state/getter/Markets';

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
      marketInfos,
      loginAccount,
      orderBooks,
      accountPositions,
    } = getState();
    const market = marketInfos[marketId];
    const outcome = market.outcomes.find(o => o.id === outcomeId);

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
      accountPositions,
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
      marketInfos,
      loginAccount,
      accountPositions,
      orderBooks,
    } = getState();
    const market = marketInfos[marketId];
    const outcome = market.outcomes.find(o => o.id === outcomeId);

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

    return runSimulateTrade(
      newTradeDetails,
      market,
      marketId,
      outcomeId,
      accountPositions,
      callback
    );
  };
}

async function runSimulateTrade(
  newTradeDetails: any,
  market: MarketInfo,
  marketId: string,
  outcomeId: number,
  accountPositions: any,
  callback: NodeStyleCallback
) {
  let sharesFilledAvgPrice = '';
  let reversal = null;
  let outcomeRawPosition = ZERO;
  const positions = (accountPositions[marketId] || {}).tradingPositions;
  if (positions && positions[outcomeId]) {
    const position = positions[outcomeId];
    sharesFilledAvgPrice = position.averagePrice;
    outcomeRawPosition = createBigNumber(position.rawPosition || 0);
    const isReversal =
      newTradeDetails.side === BUY
        ? createBigNumber(position.netPosition).lt(ZERO)
        : createBigNumber(position.netPosition).gt(ZERO);
    if (isReversal) {
      const { netPosition: quantity, averagePrice: price } = position
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
  const affiliateAddress = undefined; // TODO: get this from state
  const kycToken = undefined; // TODO: figure out how kyc tokens are going to be handled
  const doNotCreateOrders = false; // TODO: this needs to be passed from order form

  const userShares = ignoreShares ? ZERO : createBigNumber(outcomeRawPosition);

  const simulateTradeValue: SimulateTradeData = await simulateTrade(
    orderType,
    marketId,
    market.numOutcomes,
    outcomeId,
    ignoreShares,
    affiliateAddress,
    kycToken,
    doNotCreateOrders,
    market.numTicks,
    market.minPrice,
    market.maxPrice,
    newTradeDetails.numShares,
    newTradeDetails.limitPrice,
    userShares,
  );

  const gasLimit = await simulateTradeGasLimit(
    orderType,
    marketId,
    market.numOutcomes,
    outcomeId,
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
  newTradeDetails.sharesFilled = simulateTradeValue.sharesFilled;
  newTradeDetails.feePercent = totalFee
    .dividedBy(createBigNumber(simulateTradeValue.tokensDepleted, 10))
    .toFixed();
  if (isNaN(newTradeDetails.feePercent)) newTradeDetails.feePercent = '0';

  const tradeInfo = {
    ...newTradeDetails,
    ...simulateTradeValue,
    sharesFilledAvgPrice,
    reversal,
  };

  const order = generateTrade(market, tradeInfo);

  if (callback) callback(null, { ...order, ...simulateTradeValue, gasLimit });
}
