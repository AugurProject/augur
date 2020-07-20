import { convertToNormalizedPrice } from './get-odds';
import { ASKS, ONE } from 'modules/common/constants';
import { getOutcomeNameWithOutcome } from './get-outcome';
import { BET_STATUS } from 'modules/trading/store/constants';
import { Markets } from 'modules/markets/store/markets';
import { placeTrade } from 'modules/contracts/actions/contractCalls';
import { Betslip } from 'modules/trading/store/betslip';
import { createBigNumber } from './create-big-number';
import { formatDate } from './format-date';

export const convertToWin = (price, quantity) => {
  return ONE.minus(createBigNumber(price)).times(createBigNumber(quantity)).toString();
}

export const convertPositionToBet = (position, marketInfo) => {
  return {
    ...position,
    outcomeId: position.outcome,
    sportsBook: marketInfo.sportsBook,
    amountWon: '0',
    amountFilled: '0',
    price: position.averagePrice,
    toWin: convertToWin(position.averagePrice, position.rawPosition),
    normalizedPrice: convertToNormalizedPrice({
      price: position.averagePrice,
      min: marketInfo.min,
      max: marketInfo.max,
      type: ASKS,
    }),
    outcome: getOutcomeNameWithOutcome(marketInfo, position.outcome),
    wager: position.rawPosition,
    dateUpdated: position.timestamp,
  };
};

const { FILLED, FAILED } = BET_STATUS;

export const placeBet = async (marketId, order, orderId) => {
  const { marketInfos } = Markets.get();
  const market = marketInfos[marketId];
  // todo: need to add user shares
  await placeTrade(
    0,
    marketId,
    market.numOutcomes,
    order.outcomeId,
    false,
    market.numTicks,
    market.minPrice,
    market.maxPrice,
    order.wager,
    order.price,
    0,
    '0',
    undefined
  )
    .then(() => {
      Betslip.actions.updateMatched(marketId, orderId, {
        ...order,
        status: FILLED,
      });
    })
    .catch(err => {
      Betslip.actions.updateMatched(marketId, orderId, {
        ...order,
        status: FAILED,
      });
    });
};
