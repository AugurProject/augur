import { BIPS_BASE, BIPS_CONSTANT, BLOCKED_PRICE_IMPACT_NON_EXPERT, YES_NO_NUM_TICKS } from '../constants'
import { CurrencyAmount, JSBI, Percent, TokenAmount } from '@uniswap/sdk'
import { ALLOWED_PRICE_IMPACT_HIGH, ALLOWED_PRICE_IMPACT_LOW, ALLOWED_PRICE_IMPACT_MEDIUM } from '../constants'
import { Field } from '../state/swap/actions'
import { TradeInfo } from '../hooks/Trades'
import { BigNumber as BN } from 'bignumber.js'
import { formatCurrencyAmount, formatCurrencyAmountDisplay, isMarketCurrency } from '.'

const ONE_HUNDRED_PERCENT = new Percent(JSBI.BigInt(10000), JSBI.BigInt(10000))

export function computePriceImpact(
  trade,
  minAmount,
  outputAmount: TokenAmount | CurrencyAmount
): { priceImpactWithoutFee: Percent; slippageAdjustedAmounts: string } {
  if (!trade || !minAmount || !outputAmount) return { priceImpactWithoutFee: undefined, slippageAdjustedAmounts: undefined }

  const currencyOutDecimals = new BN(trade?.currencyOut?.decimals)
  const displayActualPrice = new BN(trade.executionPrice)
  const rawOutputAmount = new BN(String(outputAmount?.raw))

  const displayInAmount = formatCurrencyAmount(trade?.inputAmount);
  const displayOutAmount = formatCurrencyAmountDisplay(String(outputAmount?.raw), trade?.currencyOut);

  const rawSlipRate = new BN(displayInAmount).eq(0) ? new BN(0) :  new BN(displayInAmount).div(new BN(displayOutAmount))
  console.log('slip rate', `${String(displayInAmount)} / ${String(displayOutAmount)} = ${String(rawSlipRate)}`)
  const impact = (rawSlipRate.minus(displayActualPrice)).div(displayActualPrice).abs()
  console.log('slippage:', String(rawSlipRate), '-', String(displayActualPrice), '/', String(displayActualPrice), '=', String(impact))
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
): { priceImpactWithoutFee?: Percent } {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))

  const tradeFee = new Percent(JSBI.BigInt(trade?.fee || 0), JSBI.BigInt(10000))
  const realizedLPFee = ONE_HUNDRED_PERCENT.subtract(tradeFee)

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade.priceImpact.subtract(realizedLPFee) : undefined

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(priceImpactWithoutFeeFraction?.numerator, priceImpactWithoutFeeFraction?.denominator)
    : undefined

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent }
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
