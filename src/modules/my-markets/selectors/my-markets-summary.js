import { createBigNumber } from 'utils/create-big-number'
import selectMyMarkets from 'modules/my-markets/selectors/my-markets'
import { ZERO } from 'modules/trade/constants/numbers'

export default function () {
  const markets = selectMyMarkets()

  const numMarkets = markets.length
  const totalValue = markets.reduce((prevTotal, currentMarket) => prevTotal.plus(createBigNumber(currentMarket.fees.value, 10)), ZERO).toNumber()

  return {
    numMarkets,
    totalValue,
  }
}
