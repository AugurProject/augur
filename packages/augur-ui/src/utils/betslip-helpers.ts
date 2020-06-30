import { convertToOdds } from './get-odds';
import { ASKS, ODDS_TYPE } from 'modules/common/constants';
import { getOutcomeNameWithOutcome } from './get-outcome';
import { BET_STATUS } from 'modules/trading/store/constants';
import { Markets } from 'modules/markets/store/markets';
import { placeTrade } from 'modules/contracts/actions/contractCalls';
import { Betslip } from 'modules/trading/store/betslip';

export const convertPositionToBet = (position, marketInfo) => {
  return {
    ...position,
    amountWon: '0',
    amountFilled: '0',
    price: position.averagePrice,
    toWin: '0',
    odds: convertToOdds({
      price: position.averagePrice,
      min: marketInfo.min,
      max: marketInfo.max,
      type: ASKS,
    })[ODDS_TYPE.AMERICAN],
    outcome: getOutcomeNameWithOutcome(marketInfo, position.outcome),
    wager: position.rawPosition,
  };
};

const { FILLED, FAILED } = BET_STATUS;

export const placeBet = async (marketId, order, orderId) => {
  const { marketInfos } = Markets.get();
  const market = marketInfos[marketId];
  // todo: need to add user shares, pending queue
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
