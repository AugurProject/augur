import { convertToNormalizedPrice, convertToWin, getWager } from './get-odds';
import { BUY_INDEX } from 'modules/common/constants';
import { getOutcomeNameWithOutcome } from './get-outcome';
import { BET_STATUS } from 'modules/trading/store/constants';
import { Markets } from 'modules/markets/store/markets';
import { placeTrade, simulateTrade } from 'modules/contracts/actions/contractCalls';
import { Betslip } from 'modules/trading/store/betslip';
import { AppStatus } from 'modules/app/store/app-status';

export const convertPositionToBet = (position, marketInfo) => {
  const normalizedPrice = convertToNormalizedPrice({
    price: position.averagePrice,
    min: marketInfo.min,
    max: marketInfo.max
  });
  const wager = getWager(position.rawPosition, position.averagePrice);
  return {
    ...position,
    outcomeId: position.outcome,
    sportsBook: marketInfo.sportsBook,
    amountWon: '0',
    amountFilled: '0',
    price: position.averagePrice,
    toWin: convertToWin(normalizedPrice, position.rawPosition),
    normalizedPrice,
    outcome: getOutcomeNameWithOutcome(marketInfo, position.outcome),
    shares: position.rawPosition,
    wager,
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

export const checkForDisablingPlaceBets = (betslipItems) => {
  let placeBetsDisabled = false;
  Object.values(betslipItems).map(market => {
    market.orders.map(order => {
      if (order.errorMessage && order.errorMessage !== '') {
        placeBetsDisabled = true;
      }
    });
  });
  return placeBetsDisabled;
}

export const simulateBetslipTrade = (marketId, order, orderId) => {
  const { marketInfos } = Markets.get();
  const { loginAccount: { address }, accountPositions} = AppStatus.get();
  const market = marketInfos[marketId];
  
  (async() => {
    const simulateTradeData = await simulateTrade(
      BUY_INDEX,
      marketId,
      market.numOutcomes,
      order.outcomeId,
      undefined,
      true,
      market.numTicks,
      market.minPrice,
      market.maxPrice,
      order.shares,
      order.price,
      '0',
      address
    );
    Betslip.actions.modifyBet(marketId, orderId, {
      ...order,
      selfTrade: simulateTradeData.selfTrade,
      errorMessage: simulateTradeData.selfTrade ? 'Consuming own order' : ''
    });
  })();
}
