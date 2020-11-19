import { BIPS_BASE, BIPS_CONSTANT, BLOCKED_PRICE_IMPACT_NON_EXPERT } from '../constants'
import { CurrencyAmount, JSBI, Percent, TokenAmount } from '@uniswap/sdk'
import { ALLOWED_PRICE_IMPACT_HIGH, ALLOWED_PRICE_IMPACT_LOW, ALLOWED_PRICE_IMPACT_MEDIUM } from '../constants'
import { Field } from '../state/swap/actions'
import { TradeInfo } from '../hooks/Trades'
import { BigNumber as BN } from 'bignumber.js'

const BASE_FEE = new Percent(JSBI.BigInt(30), JSBI.BigInt(10000))
const ONE_HUNDRED_PERCENT = new Percent(JSBI.BigInt(10000), JSBI.BigInt(10000))
const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

export function computePriceImpact(
  trade,
  minAmount,
  outputAmount: TokenAmount
): { priceImpactWithoutFee: Percent; slippageAdjustedAmounts: string } {
  if (!trade || !minAmount || !outputAmount) return { priceImpactWithoutFee: undefined, slippageAdjustedAmounts: undefined }

  const currencyOutDecimals = new BN(trade?.currencyOut?.decimals)
  const displayActualPrice = new BN(trade.executionPrice)
  const rawInputAmount = new BN(String(trade?.inputAmount?.raw))
  const rawOutputAmount = new BN(String(outputAmount?.raw))

  // normalize price by num ticks and pool percentage convert to price
  const rawSlipRate = rawInputAmount.div(rawOutputAmount).div(1000)
  const impact = !displayActualPrice ? (rawSlipRate.minus(displayActualPrice)).div(displayActualPrice) : new BN("0")
  console.log('slippage:', String(displayActualPrice), '-', String(rawSlipRate), '/', String(displayActualPrice), '=', String(impact))
  const adjMinAmount = String(new BN(String(rawOutputAmount)).div(new BN(10).pow(new BN(currencyOutDecimals))).toFixed(8))
  const prepDecimal = new Percent(JSBI.BigInt(impact.times(new BN(BIPS_CONSTANT)).toFixed(0)), BIPS_BASE)

  return {
    priceImpactWithoutFee: prepDecimal,
    slippageAdjustedAmounts: adjMinAmount
  }
}

// computes price breakdown for the trade
export function computeTradePriceBreakdown(
  trade?: TradeInfo
): { priceImpactWithoutFee?: Percent; realizedLPFee?: CurrencyAmount } {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade ? undefined : ONE_HUNDRED_PERCENT.subtract(INPUT_FRACTION_AFTER_FEE)

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade.priceImpact.subtract(realizedLPFee) : undefined

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(priceImpactWithoutFeeFraction?.numerator, priceImpactWithoutFeeFraction?.denominator)
    : undefined

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    (trade.inputAmount instanceof TokenAmount
      ? new TokenAmount(trade.inputAmount.token, realizedLPFee.multiply(trade.inputAmount.raw).quotient)
      : CurrencyAmount.ether(realizedLPFee.multiply(trade.inputAmount.raw).quotient))

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent, realizedLPFee: realizedLPFeeAmount }
}

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(
  trade: TradeInfo | undefined,
  allowedSlippage: number
): { [field in Field]?: CurrencyAmount } {
  //const pct = basisPointsToPercent(allowedSlippage)

  return {
    [Field.INPUT]: trade.inputAmount,
    [Field.OUTPUT]: trade.outputAmount
  }
}

export function warningSeverity(priceImpact: Percent | undefined): 0 | 1 | 2 | 3 | 4 {
  if (!priceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1
  return 0
}

export function formatExecutionPrice(trade?: TradeInfo, inverted?: boolean): string {
  if (!trade) {
    return ''
  }
  return `${trade?.executionPrice} ${trade?.currencyOut?.symbol} / ${trade?.currencyIn?.symbol}`
}
