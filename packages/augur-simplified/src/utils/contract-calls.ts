import { BigNumber as BN } from 'bignumber.js'
import { RemoveLiquidityRate, numTicksToTickSizeWithDisplayPrices,convertDisplayAmountToOnChainAmount } from '@augurproject/sdk-lite'
import { TradeInfo, TradingDirection } from 'modules/types'

// TODO: when scalars get num ticks from market
export const YES_NO_NUM_TICKS = 1000

// TODO: pass in precision to converting helper
export const formatToOnChainShares = (num = "0", decimals = "18"): BN => {
  // TODO: get max min price from market when scalars markets
  const numTicks = numTicksToTickSizeWithDisplayPrices(new BN(YES_NO_NUM_TICKS), new BN(0), new BN(1))
  const onChain = convertDisplayAmountToOnChainAmount(new BN(num), numTicks) // todo when merge comes in, new BN(10).pow(new BN(decimals)))
  console.log('to onChain shares value decimals:', num, decimals, String(onChain))
  return onChain;
}

export interface AddAmmLiquidity {
  account: string,
  ammAddress: string,
  hasLiquidity: boolean,
  augurClient,
  marketId: string,
  sharetoken: string,
  fee: string,
  cashAmount: string,
  priceNo: number,
  priceYes: number,
  useEth: boolean,
}

export function addAmmLiquidity({
  account,
  ammAddress,
  hasLiquidity,
  augurClient,
  marketId,
  sharetoken,
  fee,
  cashAmount,
  priceNo,
  priceYes,
  useEth,
}: AddAmmLiquidity) {
  if (!augurClient || !augurClient.amm) return console.error('augurClient is null')
  console.log(
    'addAmmLiquidity',
    account,
    ammAddress,
    hasLiquidity,
    marketId,
    sharetoken,
    fee,
    String(cashAmount),
    'No', String(priceNo),
    'Yes', String(priceYes),
    `use ETH: ${useEth}`
  )

  // converting odds to pool percentage. odds is the opposit of pool percentage
  // same when converting pool percentage to price
  const poolYesPercent = new BN(priceNo)
  const poolNoPercent = new BN(priceYes)

  return augurClient.amm.doAddLiquidity(
    account,
    ammAddress,
    hasLiquidity,
    marketId,
    sharetoken,
    fee,
    new BN(cashAmount),
    poolYesPercent,
    poolNoPercent,
  )
}

export interface GetRemoveLiquidity {
  marketId: string,
  paraShareToken: string,
  fee: string,
  augurClient,
  lpTokenBalance: string,
}

export async function getRemoveLiquidity({
  marketId,
  paraShareToken,
  fee,
  augurClient,
  lpTokenBalance,
}: GetRemoveLiquidity): Promise<{ noShares: string; yesShares: string; cashShares: string } | null> {
  if (!augurClient || !marketId || !paraShareToken || !fee) {
    console.error('getRemoveLiquidity: augurClient is null or no amm address')
    return null
  }
  const alsoSell = true;
  const results: RemoveLiquidityRate = await augurClient.amm.getRemoveLiquidity(marketId, paraShareToken, new BN(String(fee)), new BN(String(lpTokenBalance)), alsoSell);
  return {
    noShares: results.short.toFixed(),
    yesShares: results.long.toFixed(),
    cashShares: results.cash.toFixed()
  }
}

export function doRemoveAmmLiquidity({ marketId, paraShareToken, fee, augurClient, lpTokenBalance }: GetRemoveLiquidity) {
  if (!augurClient || !marketId || !paraShareToken || !fee) return console.error('removeAmmLiquidity: augurClient is null or no amm address')
  const alsoSell = true;
  return augurClient.amm.doRemoveLiquidity(marketId, paraShareToken, new BN(fee), new BN(lpTokenBalance), alsoSell)
}


export async function estimateTrade(augurClient, trade: TradeInfo, includeFee: boolean = true, useEth: boolean = false) {
  if (!augurClient || !trade.amm.id) return console.error('estimateTrade: augurClient is null or amm address')
  const tradeDirection = trade.tradeType;

  let outputYesShares = trade.buyYesShares;
  let breakdown = null

  if (tradeDirection === TradingDirection.ENTRY) {
    const cash = new BN(String(trade.inputAmount.raw))
    console.log(tradeDirection, 'marketId', trade.marketId, 'shareToken', trade.amm.sharetoken, 'fee', trade.amm.fee, 'cash', String(cash), 'output yes:', outputYesShares, 'includeFee:', includeFee)
    breakdown = await augurClient.amm.getEnterPosition(
      trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.fee),
      cash,
      outputYesShares,
      includeFee
    )
    console.log('breakdown', JSON.stringify(breakdown))
    return String(breakdown)
  }
  if (tradeDirection === TradingDirection.EXIT) {
    let longShares = new BN('0')
    let shortShares = new BN('0')
    let invalidShares = new BN(trade.balance.outcomes[0])
    if (!outputYesShares) {
      shortShares = new BN(String(trade.inputAmount.raw))
      shortShares = BN.minimum(invalidShares, shortShares)
    } else {
      longShares = new BN(String(trade.inputAmount.raw))
    }

    console.log(tradeDirection, 'no:', String(shortShares), 'yes:', String(longShares))
    breakdown = await augurClient.amm.getExitPosition(
      trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.fee),
      shortShares,
      longShares,
      includeFee
    )
    return String(breakdown['cash'])
  }
  if (tradeDirection === TradingDirection.SWAP) {
    const inputAmmount = new BN(String(trade.inputAmount.raw))
    console.log(tradeDirection, String(inputAmmount), outputYesShares)
    breakdown = await augurClient.amm.getSwap(
      trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.fee),
      inputAmmount,
      !outputYesShares,
      includeFee
    )
    console.log('get swap rate', String(breakdown))
    return String(breakdown)
  }
  return null
}


export async function doTrade(augurClient, trade: TradeInfo, minAmount: string, useEth: boolean = false) {
  if (!augurClient || !trade.amm.id) return console.error('doTrade: augurClient is null or amm address')
  const tradeDirection = trade.tradeType;
  const outputYesShares = trade.buyYesShares;

  if (tradeDirection === TradingDirection.ENTRY) {
    console.log('doEnterPosition:', trade.marketId,
      trade.amm.sharetoken,
      trade.amm.fee,
      String(trade.inputAmount.raw),
      outputYesShares,
      String(minAmount))

    return augurClient.amm.doEnterPosition(
      trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.fee),
      new BN(String(trade.inputAmount.raw)),
      outputYesShares,
      new BN(String(minAmount))
    )
  }

  if (tradeDirection === TradingDirection.EXIT) {
    let longShares = new BN('0')
    let shortShares = new BN('0')
    let invalidShares = new BN(trade.balance.outcomes[0])
    if (!outputYesShares) {
      shortShares = new BN(String(trade.inputAmount.raw))
      shortShares = BN.minimum(invalidShares, shortShares)
    } else {
      longShares = new BN(String(trade.inputAmount.raw))
    }

    console.log('doExitPosition:', trade.marketId,
      trade.amm.sharetoken,
      trade.amm.fee,
      String(shortShares),
      String(longShares),
      String(minAmount))

    return augurClient.amm.doExitPosition(
      trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.fee),
      shortShares,
      longShares,
      new BN(String(minAmount))
    )
  }

  if (tradeDirection === TradingDirection.SWAP) {
    console.log('doSwap:', trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.fee),
      new BN(String(trade.inputAmount.raw)),
      outputYesShares,
      new BN(minAmount))
    return augurClient.amm.doSwap(
      trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.fee),
      new BN(String(trade.inputAmount.raw)),
      outputYesShares,
      new BN(minAmount)
    )
  }
  return null
}
