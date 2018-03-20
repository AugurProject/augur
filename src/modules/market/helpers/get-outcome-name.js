import { BINARY, SCALAR } from 'modules/markets/constants/market-types'

export default function getOutcomeName(marketType, marketId, outcome, marketOutcomesData) {
  if (marketType === BINARY || marketType === SCALAR) return null
  return (marketOutcomesData ? marketOutcomesData[log.outcome] : {}).name
}
