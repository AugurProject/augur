import { TradingProceedsClaimed } from '../../generated/schema';
import {
  TradingProceedsClaimed as TradingProceedsClaimedEvent,
  ParaAugur
} from '../../generated/templates/ParaAugur/ParaAugur';
import { getOrCreateUser } from '../utils/helpers';

export function handleTradingProceedsClaimed(
  event: TradingProceedsClaimedEvent
): void {
  let paraAugur = ParaAugur.bind(event.address);

  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let tradingProceedsClaimed = new TradingProceedsClaimed(id);

  getOrCreateUser(event.params.sender.toHexString());

  tradingProceedsClaimed.fees = event.params.fees;
  tradingProceedsClaimed.market = event.params.market.toHexString();
  tradingProceedsClaimed.numPayoutTokens = event.params.numPayoutTokens;
  tradingProceedsClaimed.numShares = event.params.numShares;
  tradingProceedsClaimed.outcome = event.params.outcome;
  tradingProceedsClaimed.sender = event.params.sender.toHexString();
  tradingProceedsClaimed.shareToken = paraAugur.shareToken().toHexString();
  tradingProceedsClaimed.timestamp = event.params.timestamp;
  tradingProceedsClaimed.universe = event.params.universe.toHexString();

  tradingProceedsClaimed.save();
}
