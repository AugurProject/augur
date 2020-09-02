import { createBigNumber } from 'utils/create-big-number';
import { BUY, ZERO, ZEROX_GAS_FEE, BUY_INDEX } from 'modules/common/constants';
import logError from 'utils/log-error';
import { generateTrade } from 'modules/trades/helpers/generate-trade';
import { BigNumber } from 'bignumber.js';
import { NodeStyleCallback, AccountPosition } from 'modules/types';
import {
  simulateTrade,
  simulateTradeGasLimit,
} from 'modules/contracts/actions/contractCalls';
import type { Getters, SimulateTradeData } from '@augurproject/sdk';
import { checkAccountAllowance } from 'modules/auth/actions/approve-account';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from 'modules/markets/store/markets';

// Updates user's trade. Only defined (i.e. !== null) parameters are updated
export const updateTradeCost = ({
  marketId,
  outcomeId,
  side,
  numShares,
  limitPrice,
  selfTrade,
  callback = logError,
}: any) => {
  if (!side || !numShares || !limitPrice) {
    return callback('side or numShare or limitPrice is not provided');
  }
  const {
    accountPositions,
    loginAccount: { address },
  } = AppStatus.get();
  const { marketInfos } = Markets.get();
  checkAccountAllowance();
  const market = marketInfos[marketId];
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
    address,
    callback
  );
};

export const updateTradeShares = ({
  marketId,
  outcomeId,
  side,
  maxCost,
  limitPrice,
  callback = logError,
}: any) => {
  if (!side || !maxCost || !limitPrice) {
    return callback('side or numShare or limitPrice is not provided');
  }

  const {
    accountPositions,
    loginAccount: { address },
  } = AppStatus.get();
  const { marketInfos } = Markets.get();
  checkAccountAllowance();
  const market = marketInfos[marketId];
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
  const {
    minPriceBigNumber,
    maxPriceBigNumber,
  } = market;
  // calculate num shares
  const marketRange = maxPriceBigNumber.minus(minPriceBigNumber);
  const scaledPrice = createBigNumber(limitPrice).plus(minPriceBigNumber.abs());
  const newShares = side === BUY ? createBigNumber(maxCost).dividedBy(scaledPrice) : createBigNumber(maxCost).dividedBy(
    marketRange.minus(scaledPrice)
  );
  newTradeDetails.numShares = createBigNumber(newShares.toFixed(4));
  return runSimulateTrade(
    newTradeDetails,
    market,
    marketId,
    outcomeId,
    accountPositions,
    address,
    callback
  );
};

export const runSimulateTrade = async (
  newTradeDetails: any,
  market: Getters.Markets.MarketInfo,
  marketId: string,
  outcomeId: number,
  accountPositions: AccountPosition,
  takerAddress: string,
  callback: NodeStyleCallback
) => {
  let sharesFilledAvgPrice = '';
  let reversal = null;
  const positions = (accountPositions[marketId] || {}).tradingPositions;
  const marketOutcomeShares = positions
    ? (accountPositions[marketId].tradingPositionsPerMarket || {})
        .userSharesBalances
    : {};
  if (positions && positions[outcomeId]) {
    const position = positions[outcomeId];
    sharesFilledAvgPrice = position.averagePrice;
    const isReversal =
      newTradeDetails.side === BUY
        ? createBigNumber(position.netPosition).lt(ZERO)
        : createBigNumber(position.netPosition).gt(ZERO);
    if (isReversal) {
      const { netPosition: quantity, averagePrice: price } = position;
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
  const doNotCreateOrders = false; // TODO: this needs to be passed from order form

  let userShares =
    orderType !== BUY_INDEX
      ? createBigNumber(marketOutcomeShares[outcomeId] || 0)
      : ZERO;
  if (!!reversal && orderType === BUY_INDEX) {
    // ignore trading outcome shares and find min across all other outcome shares.
    const userSharesBalancesRemoveOutcome = Object.keys(
      marketOutcomeShares
    ).reduce(
      (p, o) =>
        String(outcomeId) === o
          ? p
          : [...p, new BigNumber(marketOutcomeShares[o])],
      []
    );
    userShares =
      userSharesBalancesRemoveOutcome.length > 0
        ? BigNumber.min(...userSharesBalancesRemoveOutcome)
        : ZERO;
  }

  const simulateTradeValue: SimulateTradeData = await simulateTrade(
    orderType,
    marketId,
    market.numOutcomes,
    outcomeId,
    undefined,
    doNotCreateOrders,
    market.numTicks,
    market.minPrice,
    market.maxPrice,
    newTradeDetails.numShares,
    newTradeDetails.limitPrice,
    userShares,
    takerAddress
  );

  let gasLimit: BigNumber = createBigNumber(0);

  const totalFee = createBigNumber(simulateTradeValue.settlementFees, 10);
  newTradeDetails.totalFee = totalFee.toFixed();
  // note: tokensDepleted, dai needed for trade
  newTradeDetails.totalCost = simulateTradeValue.sharesFilled.minus(
    simulateTradeValue.tokensDepleted
  );
  newTradeDetails.costInDai = simulateTradeValue.tokensDepleted;
  // note: shareCost, shares you spent on the trade
  newTradeDetails.shareCost = simulateTradeValue.sharesDepleted;
  // note: sharesFilled, the amount of the order that was filled
  newTradeDetails.sharesFilled = simulateTradeValue.sharesFilled;
  newTradeDetails.feePercent = totalFee
    .dividedBy(createBigNumber(simulateTradeValue.tokensDepleted, 10))
    .toFixed();
  if (isNaN(newTradeDetails.feePercent)) newTradeDetails.feePercent = '0';

  if (newTradeDetails.sharesFilled.toNumber() > 0) {
    gasLimit = await simulateTradeGasLimit(
      orderType,
      marketId,
      market.numOutcomes,
      outcomeId,
      undefined,
      doNotCreateOrders,
      market.numTicks,
      market.minPrice,
      market.maxPrice,
      newTradeDetails.numShares,
      newTradeDetails.limitPrice,
      userShares,
      takerAddress
    );

    // Plus ZeroX Fee (150k Gas)
    gasLimit = gasLimit.plus(ZEROX_GAS_FEE);
  }
  // ignore share cost when user is shorting or longing another outcome
  // and the user doesn't have shares on the traded outcome
  if (
    reversal === null &&
    !newTradeDetails.shareCost.eq(ZERO) &&
    userShares.gt(ZERO)
  ) {
    newTradeDetails.shareCost = '0';
  }

  const tradeInfo = {
    ...newTradeDetails,
    ...simulateTradeValue,
    sharesFilledAvgPrice,
    reversal,
  };

  const order = generateTrade(market, tradeInfo);

  if (callback) callback(null, { ...order, gasLimit });
};
