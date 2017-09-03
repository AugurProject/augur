import selectMyMarkets from 'modules/my-markets/selectors/my-markets';
import speedomatic from 'speedomatic';
import { ZERO } from 'modules/trade/constants/numbers';

export default function () {
  const markets = selectMyMarkets();

  const numMarkets = markets.length;
  const totalValue = markets.reduce((prevTotal, currentMarket) => prevTotal.plus(speedomatic.bignum(currentMarket.fees.value)), ZERO).toNumber();

  return {
    numMarkets,
    totalValue
  };
}
