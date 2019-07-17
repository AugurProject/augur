import { UIOrder } from 'modules/types';
import { Getters, convertOnChainPriceToDisplayPrice, convertOnChainAmountToDisplayAmount, numTicksToTickSize, QUINTILLION } from '@augurproject/sdk';
import { SELL, BUY, TX_TRADE_GROUP_ID, TX_MARKET_ID, TX_OUTCOME_ID, TX_PRICE, TX_AMOUNT, TX_DIRECTION } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';

export function convertTransactionOrderToUIOrder(onChainOrder, status: string, market: Getters.Markets.MarketInfo): UIOrder {
  console.log(JSON.stringify(onChainOrder));
  const outcomeId = onChainOrder[TX_OUTCOME_ID].toNumber();
  const outcome = market.outcomes.find(o => o.id === outcomeId);
  const onChainMinPrice = createBigNumber(market.minPrice).multipliedBy(QUINTILLION);
  const onChainMaxPrice = createBigNumber(market.maxPrice).multipliedBy(QUINTILLION);
  const numTicks = createBigNumber(market.numTicks);
  const tickSize = numTicksToTickSize(numTicks, onChainMinPrice, onChainMaxPrice);
  const price = convertOnChainPriceToDisplayPrice(onChainOrder[TX_PRICE], onChainMinPrice, tickSize).toString(10);
  const amount = convertOnChainAmountToDisplayAmount(onChainOrder[TX_AMOUNT], tickSize).toString();
  return {
    id: onChainOrder[TX_TRADE_GROUP_ID],
    marketId: onChainOrder[TX_MARKET_ID],
    outcomeId,
    price,
    fullPrecisionPrice: price,
    amount,
    fullPrecisionAmount: amount,
    type: onChainOrder[TX_DIRECTION].eq(0) ? BUY : SELL,
    outcomeName: outcome.description,
    status
  }
}


