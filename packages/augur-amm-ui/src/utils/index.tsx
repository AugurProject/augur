import React from 'react'
import { BigNumber as BN } from 'bignumber.js'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import { blockClient } from '../apollo/client'
import { GET_BLOCK } from '../apollo/queries'
import { Text } from 'rebass'
import _Decimal from 'decimal.js-light'
import toFormat from 'toformat'
import { DISTRO_NO_ID, DISTRO_YES_ID, MarketTokens, timeframeOptions, TokenAddressMap, YES_NO_NUM_TICKS } from '../constants'
import Numeral from 'numeral'
import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, JSBI, Percent, Token, CurrencyAmount, Currency, ETHER, TokenAmount } from '@uniswap/sdk'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { AddressZero } from '@ethersproject/constants'
import { ParaShareToken, RemoveLiquidityRate, convertOnChainAmountToDisplayAmount, numTicksToTickSizeWithDisplayPrices } from '@augurproject/sdk-lite'
import { TradeInfo } from '../hooks/Trades'
import { MarketCurrency } from '../model/MarketCurrency'
import { EthersProvider } from '@augurproject/ethersjs-provider'

// format libraries
const Decimal = toFormat(_Decimal)
BN.set({ EXPONENTIAL_AT: 50 })
dayjs.extend(utc)
dayjs.extend(relativeTime)

export function getTimeframe(timeWindow) {
  const utcEndTime = dayjs.utc()
  // based on window, get starttime
  let utcStartTime
  switch (timeWindow) {
    case timeframeOptions.WEEK:
      utcStartTime =
        utcEndTime
          .subtract(1, 'week')
          .endOf('day')
          .unix() - 1
      break
    case timeframeOptions.MONTH:
      utcStartTime =
        utcEndTime
          .subtract(1, 'month')
          .endOf('day')
          .unix() - 1
      break
    case timeframeOptions.ALL_TIME:
      utcStartTime =
        utcEndTime
          .subtract(1, 'year')
          .endOf('day')
          .unix() - 1
      break
    default:
      utcStartTime =
        utcEndTime
          .subtract(1, 'year')
          .startOf('year')
          .unix() - 1
      break
  }
  return utcStartTime
}

export function getPoolLink(token0Address, token1Address = null, remove = false) {
  if (!token1Address) {
    return (
      `https://uniswap.exchange/` +
      (remove ? `remove` : `add`) +
      `/${token0Address === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 'ETH' : token0Address}/${'ETH'}`
    )
  } else {
    return (
      `https://uniswap.exchange/` +
      (remove ? `remove` : `add`) +
      `/${token0Address === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 'ETH' : token0Address}/${token1Address === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 'ETH' : token1Address
      }`
    )
  }
}

export function getSwapLink(token0Address, token1Address = null) {
  if (!token1Address) {
    return `https://uniswap.exchange/swap?inputCurrency=${token0Address}`
  } else {
    return `https://uniswap.exchange/swap?inputCurrency=${token0Address === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 'ETH' : token0Address
      }&outputCurrency=${token1Address === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 'ETH' : token1Address}`
  }
}

export function localNumber(val) {
  return Numeral(val).format('0,0')
}

export const toNiceDate = date => {
  let x = dayjs.utc(dayjs.unix(date)).format('MMM DD')
  return x
}

export const toWeeklyDate = date => {
  const formatted = dayjs.utc(dayjs.unix(date))
  date = new Date(Number(formatted))
  const day = new Date(Number(formatted)).getDay()
  var lessDays = day === 6 ? 0 : day + 1
  var wkStart = new Date(new Date(date).setDate(date.getDate() - lessDays))
  var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6))
  return dayjs.utc(wkStart).format('MMM DD') + ' - ' + dayjs.utc(wkEnd).format('MMM DD')
}

export const toPercent = (num: number): string => {
  if (num === null || num === undefined) return "0.0"
  const value = new BN(num).times(100)
  return value.toFixed(1);
}

export const isMarketCurrency = (currency: Token | Currency): boolean => {
  return currency?.name === MarketTokens.YES_SHARES || currency?.name === MarketTokens.NO_SHARES
}

export const formatCurrencyAmount = (outputAmount: TokenAmount | CurrencyAmount): string => {
  let oAmount = outputAmount?.toSignificant(6)
  if (isMarketCurrency(outputAmount?.currency)) {
    oAmount = formatShares(String(outputAmount.raw), String(outputAmount?.currency?.decimals))
  }
  return oAmount;
}
export const formatToDisplayValue = (num = "0", decimals = "18") => {
  const displayValue = new BN(num).times(YES_NO_NUM_TICKS).div(new BN(10).pow(decimals))
  return toSignificant(String(displayValue), 6)
}

export const formatShares = (num = "0", decimals = "18") => {
  const numTicks = numTicksToTickSizeWithDisplayPrices(new BN(YES_NO_NUM_TICKS), new BN(0), new BN(1))
  const displayValue = convertOnChainAmountToDisplayAmount(new BN(num), numTicks, new BN(10).pow(new BN(decimals)))
  return toSignificant(String(displayValue), 6)
}

export const formatTokenAmount = (num = "0", sig = 18) => {
  if (num === "0") return "0"
  // pow of 15 matches shares in trading UI
  const displayValue = new BN(num).div(new BN(10).pow(sig))
  return toSignificant(String(displayValue), 6)
}

export function getTimestampsForChanges() {
  const utcCurrentTime = dayjs()
  const t1 = utcCurrentTime
    .subtract(1, 'day')
    .startOf('minute')
    .unix()
  const t2 = utcCurrentTime
    .subtract(2, 'day')
    .startOf('minute')
    .unix()
  const tWeek = utcCurrentTime
    .subtract(1, 'week')
    .startOf('minute')
    .unix()
  return [t1, t2, tWeek]
}

export async function splitQuery(query, localClient, vars, list, skipCount = 100) {
  let fetchedData = {}
  let allFound = false
  let skip = 0

  while (!allFound) {
    let end = list.length
    if (skip + skipCount < list.length) {
      end = skip + skipCount
    }
    let sliced = list.slice(skip, end)
    let result = await localClient.query({
      query: query(...vars, sliced),
      fetchPolicy: 'cache-first'
    })
    fetchedData = {
      ...fetchedData,
      ...result.data
    }
    if (Object.keys(result.data).length < skipCount || skip + skipCount > list.length) {
      allFound = true
    } else {
      skip += skipCount
    }
  }

  return fetchedData
}

/**
 * @notice Fetches first block after a given timestamp
 * @dev Query speed is optimized by limiting to a 600-second period
 * @param {Int} timestamp in seconds
 */
export async function getBlockFromTimestamp(timestamp, url) {
  let result = null
  try {
    result = await blockClient(url).query({
      query: GET_BLOCK(timestamp)
    })
  } catch (e) {
    console.error('getBlockFromTimestamp', e)
  }
  return result ? result?.data?.blocks?.[0]?.number : 0
}

export const toNiceDateYear = date => dayjs.utc(dayjs.unix(date)).format('MMMM DD, YYYY')

export const isAddress = value => {
  try {
    return ethers.utils.getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

export const toK = num => {
  return Numeral(num).format('0.[00]a')
}

export const setThemeColor = theme => document.documentElement.style.setProperty('--c-token', theme || '#333333')

export const Big = number => new BN(number)

export const urls = {
  showTransaction: tx => `https://etherscan.io/tx/${tx}/`,
  showAddress: address => `https://www.etherscan.io/address/${address}/`,
  showToken: address => `https://www.etherscan.io/market/${address}/`,
  showBlock: block => `https://etherscan.io/block/${block}/`
}

export const formatTime = unix => {
  const now = dayjs()
  const timestamp = dayjs.unix(unix)

  const inSeconds = now.diff(timestamp, 'second')
  const inMinutes = now.diff(timestamp, 'minute')
  const inHours = now.diff(timestamp, 'hour')
  const inDays = now.diff(timestamp, 'day')

  if (inSeconds < 0) {
    var currentTime = dayjs()
    var endtime = dayjs(timestamp)
    return currentTime.to(endtime)
  } else {
    if (inHours >= 24) {
      return `${inDays} ${inDays === 1 ? 'day' : 'days'} ago`
    } else if (inMinutes >= 60) {
      return `${inHours} ${inHours === 1 ? 'hour' : 'hours'} ago`
    } else if (inSeconds >= 60) {
      return `${inMinutes} ${inMinutes === 1 ? 'minute' : 'minutes'} ago`
    } else {
      return `${inSeconds} ${inSeconds === 1 ? 'second' : 'seconds'} ago`
    }
  }
}

export const formatNumber = num => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// using a currency library here in case we want to add more in future
var priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

export const toSignificant = (number, significantDigits) => {
  Decimal.set({ precision: significantDigits + 1, rounding: Decimal.ROUND_UP })
  const updated = new Decimal(number).toSignificantDigits(significantDigits)
  return updated.toFormat(updated.decimalPlaces(), { groupSeparator: '' })
}

export const formattedNum = (number, usd = false) => {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0' : 0
  }
  let num = parseFloat(number)

  if (num > 500000000) {
    return (usd ? '$' : '') + toK(num.toFixed(0))
  }

  if (num === 0) {
    if (usd) {
      return '$0'
    }
    return 0
  }

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  if (num > 1000) {
    return usd
      ? '$' + Number(parseFloat(String(num)).toFixed(0)).toLocaleString()
      : '' + Number(parseFloat(String(num)).toFixed(0)).toLocaleString()
  }

  if (usd) {
    if (num < 0.1) {
      return '$' + Number(parseFloat(String(num)).toFixed(4))
    } else {
      let usdString = priceFormatter.format(num)
      return '$' + usdString.slice(1, usdString.length)
    }
  }

  return Number(parseFloat(String(num)).toFixed(5))
}

export function rawPercent(percentRaw) {
  let percent = parseFloat(String(percentRaw * 100))
  if (!percent || percent === 0) {
    return '0%'
  }
  if (percent < 1 && percent > 0) {
    return '< 1%'
  }
  return percent.toFixed(0) + '%'
}

export function formattedPercent(percent, useBrackets = false) {
  percent = parseFloat(percent)
  if (!percent || percent === 0) {
    return <Text fontWeight={500}>0%</Text>
  }

  if (percent < 0.0001 && percent > 0) {
    return (
      <Text fontWeight={500} color="green">
        {'< 0.0001%'}
      </Text>
    )
  }

  if (percent < 0 && percent > -0.0001) {
    return (
      <Text fontWeight={500} color="red">
        {'< 0.0001%'}
      </Text>
    )
  }

  let fixedPercent = percent.toFixed(2)
  if (fixedPercent === '0.00') {
    return '0%'
  }
  if (fixedPercent > 0) {
    if (fixedPercent > 100) {
      return <Text fontWeight={500} color="green">{`+${percent?.toFixed(0).toLocaleString()}%`}</Text>
    } else {
      return <Text fontWeight={500} color="green">{`+${fixedPercent}%`}</Text>
    }
  } else {
    return <Text fontWeight={500} color="red">{`${fixedPercent}%`}</Text>
  }
}

/**
 * gets the amoutn difference plus the % change in change itself (second order change)
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 * @param {*} value48HoursAgo
 */
export const get2DayPercentChange = (valueNow, value24HoursAgo, value48HoursAgo) => {
  // get volume info for both 24 hour periods
  let currentChange = parseFloat(valueNow) - parseFloat(value24HoursAgo) || 0
  let previousChange = parseFloat(value24HoursAgo) - parseFloat(value48HoursAgo)

  const adjustedPercentChange = previousChange
    ? (parseFloat(String(currentChange - previousChange)) / parseFloat(String(previousChange))) * 100
    : 0

  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return [currentChange, 0]
  }
  return [currentChange, adjustedPercentChange]
}

/**
 * get standard percent change between two values
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 */
export const getPercentChange = (valueNow, value24HoursAgo) => {
  const adjustedPercentChange =
    ((parseFloat(valueNow) - parseFloat(value24HoursAgo)) / parseFloat(value24HoursAgo)) * 100
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return 0
  }
  return adjustedPercentChange
}

export function isEquivalent(a, b) {
  var aProps = Object.getOwnPropertyNames(a)
  var bProps = Object.getOwnPropertyNames(b)
  if (aProps.length !== bProps.length) {
    return false
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i]
    if (a[propName] !== b[propName]) {
      return false
    }
  }
  return true
}

export function greaterThanZero(num) {
  if (num === null || num === undefined) return false
  return Big(num).gt(0)
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.'
}

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'market' | 'address' | 'block'
): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'market': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string) {
  //return account ? getSigner(library, account) : library
  // look to use ethers provider if need be.

  if (account) {
    // This just connects the account if necessary.
    return getSigner(library, account)
  }

  return new EthersProvider(library, 5, 50, 10)
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export function getParaShareTokenContract(tokenAddress, library, account) {
  return getContract(tokenAddress, ParaShareToken.ABI, library, account)
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
  distroPercentage,
  useEth,
}) {
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
    String(distroPercentage),
    `use ETH: ${useEth}`
  )

  // converting odds to pool percentage. odds is the opposit of pool percentage
  // same when converting pool percentage to price
  const poolYesPercent = new BN(distroPercentage[DISTRO_NO_ID])
  const poolNoPercent = new BN(distroPercentage[DISTRO_YES_ID])

  // branch logic here if useEth is true

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

export async function getRemoveLiquidity({
  marketId,
  paraShareToken,
  fee,
  augurClient,
  lpTokens,
  useEth
}): Promise<{ noShares: string; yesShares: string; cashShares: string } | null> {
  if (!augurClient || !marketId || !paraShareToken || !fee) {
    console.error('getRemoveLiquidity: augurClient is null or no amm address')
    return null
  }
  const alsoSell = false;
  const results: RemoveLiquidityRate = await augurClient.amm.getRemoveLiquidity(marketId, paraShareToken, new BN(String(fee)), new BN(String(lpTokens)), alsoSell);
  return {
    noShares: results.no.toFixed(),
    yesShares: results.yes.toFixed(),
    cashShares: results.cash.toFixed()
  }
}

export function removeAmmLiquidity({ marketId, paraShareToken, fee, augurClient, lpTokens, useEth }) {
  if (!augurClient || !marketId || !paraShareToken || !fee) return console.error('removeAmmLiquidity: augurClient is null or no amm address')
  const alsoSell = false;
  return augurClient.amm.doRemoveLiquidity(marketId, paraShareToken, new BN(fee), new BN(lpTokens), alsoSell)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === ETHER) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}

export function calculateLiquidity(decimals: number, liquidity: string, price: string): string {
  if (!decimals || !liquidity || !price) return "0"
  // liquidity comes in display value
  const displayLiquidity = liquidity;
  const liqNormalized = new BN(displayLiquidity).times(new BN(price))
  return String(liqNormalized)
}

export function calculateVolume(decimals: number, volume: string, price: string): string {
  if (!decimals || !volume || !price) return "0"
  const displayVolume = formatShares(volume, String(decimals))
  const volNormalized = new BN(displayVolume).times(new BN(price))
  return String(volNormalized)
}

export function calculateTotalVolume(cashData, volumes: { volume }): string {
  let vol24InUSD = new BN(0);
  if (!cashData || !volumes) return String(vol24InUSD)
  if (cashData && Object.keys(cashData).length > 0) {
    const { volume } = volumes;
    vol24InUSD = Object.keys(volume).reduce((p, cash) => {
      const priceUSD = cashData[cash]?.priceUSD || "0";
      const cashValue = calculateVolume(cashData[cash]?.decimals, String(volume[cash]), priceUSD)
      return p.plus(new BN(cashValue))
    }, new BN(0))
  }
  return String(vol24InUSD);
}

export enum TradingDirection {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
  SWAP = 'SWAP'
}

export function getTradeType(trade: TradeInfo): string {
  if (!trade) return null
  if (!(trade.currencyIn instanceof MarketCurrency) && trade.currencyOut instanceof MarketCurrency)
    return TradingDirection.ENTRY
  if (trade.currencyIn instanceof MarketCurrency && !(trade.currencyOut instanceof MarketCurrency))
    return TradingDirection.EXIT
  if (trade.currencyIn instanceof MarketCurrency && trade.currencyOut instanceof MarketCurrency)
    return TradingDirection.SWAP

  return null
}

export async function estimateTrade(augurClient, trade: TradeInfo, includeFee: boolean = true, useEth: boolean = false) {
  if (!augurClient || !trade.amm.id) return console.error('estimateTrade: augurClient is null or amm address')
  const tradeDirection = getTradeType(trade)

  console.log('trade', trade)

  let outputYesShares = false
  let breakdown = null

  if (trade.currencyOut instanceof MarketCurrency) {
    const out = trade.currencyOut as MarketCurrency
    outputYesShares = out.name === MarketTokens.YES_SHARES
  }

  if (tradeDirection === TradingDirection.ENTRY) {
    const cash = new BN(String(trade.inputAmount.raw))
    console.log(tradeDirection, String(cash), 'output yes:', outputYesShares)
    breakdown = await augurClient.amm.getEnterPosition(
      trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.fee),
      cash,
      outputYesShares,
      includeFee
    )
    return String(breakdown)
  }
  if (tradeDirection === TradingDirection.EXIT) {
    let yesShares = new BN('0')
    let noShares = new BN('0')
    let invalidShares = new BN(trade.balance.outcomes[0])
    if (trade.currencyIn.symbol === MarketTokens.NO_SHARES) {
      noShares = new BN(String(trade.inputAmount.raw))
      invalidShares = BN.minimum(invalidShares, noShares)
    } else {
      yesShares = new BN(String(trade.inputAmount.raw))
      invalidShares = BN.minimum(invalidShares, yesShares)
    }

    console.log(tradeDirection, 'invalid:', String(invalidShares), 'no:', String(noShares), 'yes:', String(yesShares))
    breakdown = await augurClient.amm.getExitPosition(
      trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.fee),
      invalidShares,
      noShares,
      yesShares,
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
  const tradeDirection = getTradeType(trade)

  let outputYesShares = false

  if (trade.currencyOut instanceof MarketCurrency) {
    const out = trade.currencyOut as MarketCurrency
    outputYesShares = out.name === MarketTokens.YES_SHARES
  }

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
    let yesShares = new BN('0')
    let noShares = new BN('0')
    let invalidShares = new BN(trade.balance.outcomes[0])
    if (trade.currencyIn.symbol === MarketTokens.NO_SHARES) {
      noShares = new BN(String(trade.inputAmount.raw))
      invalidShares = BN.minimum(invalidShares, noShares)
    } else {
      yesShares = new BN(String(trade.inputAmount.raw))
      invalidShares = BN.minimum(invalidShares, yesShares)
    }

    console.log('doExitPosition:', trade.marketId,
      trade.amm.sharetoken,
      trade.amm.fee,
      invalidShares,
      noShares,
      yesShares,
      String(minAmount))

    return augurClient.amm.doExitPosition(
      trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.fee),
      invalidShares,
      noShares,
      yesShares,
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

