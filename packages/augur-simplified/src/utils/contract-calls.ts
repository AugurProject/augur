import BigNumber, { BigNumber as BN } from 'bignumber.js'
import { RemoveLiquidityRate, ParaShareToken } from '@augurproject/sdk-lite'
import { TradeInfo, TradingDirection, AmmExchange, AmmExchanges, AmmMarketShares, AmmTransaction, Cashes, CurrencyBalance, PositionBalance, TransactionTypes, UserBalances, MarketInfos, LPTokens } from '../modules/types'
import ethers from 'ethers';
import { Contract } from '@ethersproject/contracts'
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from '@augurproject/ethereum-multicall';

import { Web3Provider } from '@ethersproject/providers'
import { convertDisplayCashAmountToOnChainCashAmount, convertDisplayShareAmountToOnChainShareAmount, convertOnChainCashAmountToDisplayCashAmount, formatDai, formatEther, onChainMarketSharesToDisplayShares } from './format-number';
import { augurSdkLite } from './augurlitesdk';
import { ETH, FINALIZED, NO_OUTCOME_ID, NULL_ADDRESS, USDC, YES_NO_OUTCOMES_NAMES, YES_OUTCOME_ID } from '../modules/constants';
import { getProviderOrSigner } from '../modules/ConnectAccount/utils';


export interface AddAmmLiquidity {
  account: string;
  ammAddress: string;
  hasLiquidity: boolean;
  augurClient;
  marketId: string;
  sharetoken: string;
  fee: string;
  cashAmount: string;
  priceNo: number;
  priceYes: number;
  useEth: boolean;
}

export function addAmmLiquidity({
  account,
  ammAddress,
  hasLiquidity,
  marketId,
  sharetoken,
  fee,
  cashAmount,
  priceNo,
  priceYes,
  useEth,
}: AddAmmLiquidity) {
  const augurClient = augurSdkLite.get();
  if (!augurClient || !augurClient.amm)
    return console.error('augurClient is null');
  console.log(
    'addAmmLiquidity',
    account,
    ammAddress,
    hasLiquidity,
    marketId,
    sharetoken,
    fee,
    String(cashAmount),
    'No',
    String(priceNo),
    'Yes',
    String(priceYes),
    `use ETH: ${useEth}`
  );

  // converting odds to pool percentage. odds is the opposit of pool percentage
  // same when converting pool percentage to price
  const poolYesPercent = new BN(priceNo);
  const poolNoPercent = new BN(priceYes);

  return augurClient.amm.doAddLiquidity(
    account,
    ammAddress,
    hasLiquidity,
    marketId,
    sharetoken,
    new BN(fee),
    new BN(cashAmount),
    poolYesPercent,
    poolNoPercent
  );
}

export interface GetRemoveLiquidity {
  marketId: string;
  paraShareToken: string;
  fee: string;
  lpTokenBalance: string;
}

export async function getRemoveLiquidity({
  marketId,
  paraShareToken,
  fee,
  lpTokenBalance,
}: GetRemoveLiquidity): Promise<{
  noShares: string;
  yesShares: string;
  cashShares: string;
} | null> {
  const augurClient = augurSdkLite.get();
  if (!augurClient || !marketId || !paraShareToken || !fee) {
    console.error('getRemoveLiquidity: augurClient is null or no amm address');
    return null;
  }
  console.log('marketId', marketId, 'paraSharetoken', paraShareToken, 'fee', fee, 'lp tokens', lpTokenBalance);
  const alsoSell = true;
  const results: RemoveLiquidityRate = await augurClient.amm.getRemoveLiquidity(
    marketId,
    paraShareToken,
    new BN(String(fee)),
    new BN(String(lpTokenBalance)),
    alsoSell
  );
  return {
    noShares: results.short.toFixed(),
    yesShares: results.long.toFixed(),
    cashShares: results.cash.toFixed(),
  };
}

export function doRemoveAmmLiquidity({
  marketId,
  paraShareToken,
  fee,
  lpTokenBalance,
}: GetRemoveLiquidity) {
  const augurClient = augurSdkLite.get();
  if (!augurClient || !marketId || !paraShareToken || !fee)
    return console.error(
      'removeAmmLiquidity: augurClient is null or no amm address'
    );
  const alsoSell = true;
  return augurClient.amm.doRemoveLiquidity(
    marketId,
    paraShareToken,
    new BN(fee),
    new BN(lpTokenBalance),
    alsoSell
  );
}

export async function estimateTrade(
  trade: TradeInfo,
  includeFee: boolean = true,
) {
  const augurClient = augurSdkLite.get();
  if (!augurClient || !trade.amm.id)
    return console.error('estimateTrade: augurClient is null or amm address');
  const tradeDirection = trade.tradeType;

  let outputYesShares = trade.buyYesShares;
  let breakdown = null;

  if (tradeDirection === TradingDirection.ENTRY) {
    const inputOnChainCashAmount = convertDisplayCashAmountToOnChainCashAmount(new BN(trade.inputDisplayAmount || "0"), new BN(trade?.amm?.cash?.decimals))
    console.log(
      tradeDirection,
      'marketId',
      trade.marketId,
      'shareToken',
      trade.amm.sharetoken,
      'fee',
      trade.amm.feePercent,
      'cash',
      String(trade.inputDisplayAmount),
      'output yes:',
      outputYesShares,
      'includeFee:',
      includeFee
    );
    breakdown = await augurClient.amm.getEnterPosition(
      trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.feePercent),
      inputOnChainCashAmount,
      outputYesShares,
      includeFee
    );
    console.log('breakdown', JSON.stringify(breakdown));
    return String(breakdown);
  }

  if (tradeDirection === TradingDirection.EXIT) {
    let longShares = new BN('0');
    let shortShares = new BN('0');
    let invalidShares = new BN(trade.userBalances[0]);
    if (!outputYesShares) {
      let shortOnChainShares = convertDisplayShareAmountToOnChainShareAmount(new BN(trade.inputDisplayAmount), new BN(trade.amm.cash.decimals));
      shortShares = BN.minimum(invalidShares, shortOnChainShares);
    } else {
      longShares = convertDisplayShareAmountToOnChainShareAmount(new BN(trade.inputDisplayAmount), new BN(trade.amm.cash.decimals));
    }

    console.log(
      tradeDirection,
      'no:',
      String(shortShares),
      'yes:',
      String(longShares)
    );
    breakdown = await augurClient.amm.getExitPosition(
      trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.feePercent),
      shortShares,
      longShares,
      includeFee
    );
    return String(breakdown['cash']);
  }

  return null;
}

export async function doTrade(
  trade: TradeInfo,
  minAmount: string,
  useEth: boolean = false
) {
  const augurClient = augurSdkLite.get();
  if (!augurClient || !trade.amm.id)
    return console.error('doTrade: augurClient is null or amm address');
  const tradeDirection = trade.tradeType;
  const outputYesShares = trade.buyYesShares;

  if (tradeDirection === TradingDirection.ENTRY) {
    console.log(
      'doEnterPosition:',
      trade.marketId,
      trade.amm.sharetoken,
      trade.amm.feePercent,
      String(trade.inputDisplayAmount),
      outputYesShares,
      String(minAmount)
    );

    // TODO: convert inputDisplayAmount to on chain value
    return augurClient.amm.doEnterPosition(
      trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.feePercent),
      new BN(String(trade.inputDisplayAmount)),
      outputYesShares,
      new BN(String(minAmount))
    );
  }

  if (tradeDirection === TradingDirection.EXIT) {
    // TODO: convert inputDisplayAmount to on chain value
    let longShares = new BN('0');
    let shortShares = new BN('0');
    let invalidShares = new BN(trade.userBalances[0]);
    if (!outputYesShares) {
      shortShares = new BN(String(trade.inputDisplayAmount));
      shortShares = BN.minimum(invalidShares, shortShares);
    } else {
      longShares = new BN(String(trade.inputDisplayAmount));
    }

    console.log(
      'doExitPosition:',
      trade.marketId,
      trade.amm.sharetoken,
      trade.amm.feePercent,
      String(shortShares),
      String(longShares),
      String(minAmount)
    );

    return augurClient.amm.doExitPosition(
      trade.marketId,
      trade.amm.sharetoken,
      new BN(trade.amm.feePercent),
      shortShares,
      longShares,
      new BN(String(minAmount))
    );
  }

  return null;
}

interface UserTrades {
  enters: AmmTransaction[],
  exits: AmmTransaction[]
}

export const getUserBalances = async (
  provider: Web3Provider,
  account: string,
  ammExchanges: AmmExchanges,
  cashes: Cashes,
  markets: MarketInfos,
): Promise<UserBalances> => {

  const userBalances = {
    ETH: {
      balance: '0',
      rawBalance: '0',
      usdValue: '0',
    },
    USDC: {
      balance: '0',
      rawBalance: '0',
      usdValue: '0',
    },
    totalPositionUsd: "0",
    total24hrPositionUsd: "0",
    change24hrPositionUsd: "0",
    totalAccountValue: "0",
    availableFundsUsd: "0",
    lpTokens: {},
    marketShares: {},
    claimableWinnings: {},
  };

  if (!account || !provider) return userBalances;

  const BALANCE_OF = 'balanceOf';
  const MARKET_SHARE_BALANCE = 'balanceOfMarketOutcome';

  // TODO: use amm factory abi when that's available in sdk-lite
  //const lpAbi = AMMFactoryAbi;
  const lpAbi = ERC20ABI;
  // finalized markets
  const finalizedMarkets = Object.values(markets).filter(m => m.reportingState === FINALIZED);
  const finalizedMarketIds = finalizedMarkets.map(f => f.marketId);
  const finalizedAmmExchanges = Object.values(ammExchanges).filter(a => finalizedMarketIds.includes(a.marketId));

  // balance of
  const ammAddresses: string[] = Object.keys(ammExchanges);
  const exchanges = Object.values(ammExchanges);
  // share tokens
  const shareTokens: string[] = Object.keys(cashes).map(
    (id) => cashes[id].shareToken
  );
  // markets
  const marketIds: string[] = ammAddresses.reduce(
    (p, a) =>
      p.includes(ammExchanges[a].marketId)
        ? p
        : [...p, ammExchanges[a].marketId],
    []
  );

  userBalances.ETH = await getEthBalance(provider, cashes, account);

  const multicall = new Multicall({ ethersProvider: provider });

  const contractLpBalanceCall: ContractCallContext[] = ammAddresses.map(
    (address) => ({
      reference: address,
      contractAddress: address,
      abi: lpAbi,
      calls: [
        {
          reference: address,
          methodName: BALANCE_OF,
          methodParameters: [account],
        },
      ],
    })
  );

  const contractMarketShareBalanceCall: ContractCallContext[] = marketIds.reduce(
    (p, marketId) => {
      const shareTokenOutcomeShareBalances = shareTokens.reduce(
        (k, shareToken) => {
          // TODO: might need to change when scalars come in
          const outcomeShareBalances = [0, 1, 2].map((outcome) => ({
            reference: `${marketId}-${outcome}`,
            contractAddress: shareToken,
            abi: ParaShareToken.ABI,
            calls: [
              {
                reference: `${marketId}-${outcome}`,
                methodName: MARKET_SHARE_BALANCE,
                methodParameters: [marketId, outcome, account],
              },
            ],
          }));
          return [...k, ...outcomeShareBalances];
        },
        []
      );
      return [...p, ...shareTokenOutcomeShareBalances];
    },
    []
  );

  let basicBalanceCalls: ContractCallContext[] = [];
  const usdc = Object.values(cashes).find((c) => c.name === USDC);
  if (usdc) {
    basicBalanceCalls = [
      {
        reference: 'usdc-balance',
        contractAddress: usdc.address,
        abi: ERC20ABI,
        calls: [{ reference: 'usdcBalance', methodName: BALANCE_OF, methodParameters: [account] }]
      }
    ]
  }

  const balananceCalls = [
    ...contractLpBalanceCall,
    ...contractMarketShareBalanceCall,
    ...basicBalanceCalls,
  ];

  let balances: string[] = [];
  const balanceResult: ContractCallResults = await multicall.call(
    balananceCalls
  );

  Object.keys(balanceResult.results).forEach((key) => {
    const value = String(
      new BN(
        JSON.parse(
          JSON.stringify(
            balanceResult.results[key].callsReturnContext[0].returnValues
          )
        ).hex
      )
    );
    balances.push(value);

    const method = String(
      balanceResult.results[key].originalContractCallContext.calls[0].methodName
    );
    const contractAddress = String(
      balanceResult.results[key].originalContractCallContext.contractAddress
    );
    const params = String(
      balanceResult.results[key].originalContractCallContext.calls[0]
        .methodParameters
    );
    const balanceValue = balanceResult.results[key].callsReturnContext[0]
      .returnValues as ethers.utils.Result;
    const rawBalance = String(new BN(balanceValue.hex));

    if (method === BALANCE_OF) {
      if (usdc && contractAddress === usdc.address) {
        const usdcValue = convertOnChainCashAmountToDisplayCashAmount(
          new BN(rawBalance),
          new BN(usdc.decimals)
        );
        userBalances.USDC = {
          balance: String(usdcValue),
          rawBalance: rawBalance,
          usdValue: String(usdcValue),
        };
      } else {
        const cash = cashes[ammExchanges[contractAddress]?.cash.address];
        const balance = onChainMarketSharesToDisplayShares(
          rawBalance,
          cash.decimals
        );
        if (balance !== '0') {
          userBalances.lpTokens[contractAddress] = { balance, rawBalance };
        }
      }
    } else if (method === MARKET_SHARE_BALANCE) {

      const cash = Object.values(cashes).find(
        (c) => c.shareToken.toLowerCase() === contractAddress.toLowerCase()
      );
      const balance = onChainMarketSharesToDisplayShares(
        rawBalance,
        cash.decimals
      );

      const [marketId, outcome] = params.split(',');
      const amm = exchanges.find(
        (e) =>
          e.sharetoken.toLowerCase() === contractAddress.toLowerCase() &&
          e.marketId === marketId
      );

      if (amm) {
        const existingMarketShares = userBalances.marketShares[amm.id];
        const trades = getUserTrades(account, amm.transactions);
        if (existingMarketShares) {
          existingMarketShares.positions.push(getPositionUsdValues(trades, rawBalance, balance, outcome, amm));
        } else if (balance !== "0") {
          userBalances.marketShares[amm.id] = {
            ammExchange: amm,
            positions: [],
          }
          userBalances.marketShares[amm.id].positions.push(getPositionUsdValues(trades, rawBalance, balance, outcome, amm));
        }
      }
    }
  })

  if (finalizedMarkets.length > 0) {
    const keyedFinalizedMarkets = finalizedMarkets.reduce((p, f) => ({ ...p, [f.marketId]: f }), {})
    populateClaimableWinnings(keyedFinalizedMarkets, finalizedAmmExchanges, userBalances.marketShares);
  }

  const userPositions = getTotalPositions(userBalances.marketShares);
  const availableFundsUsd = String(new BN(userBalances.ETH.usdValue).plus(new BN(userBalances.USDC.usdValue)));
  const totalAccountValue = String(new BN(availableFundsUsd).plus(new BN(userPositions.totalPositionUsd)));
  await populateInitLPValues(userBalances.lpTokens, ammExchanges, account);

  return { ...userBalances, ...userPositions, totalAccountValue, availableFundsUsd }
}

const populateClaimableWinnings = (finalizedMarkets: MarketInfos, finalizedAmmExchanges: AmmExchange[], marketShares: AmmMarketShares): void => {
  finalizedAmmExchanges.reduce((p, amm) => {
    const market = finalizedMarkets[amm.marketId];
    const winningOutcome = market.outcomes.find(o => o.payoutNumerator !== "0");
    if (winningOutcome) {
      const outcomeBalances = marketShares[amm.id];
      const userShares = outcomeBalances[Number(winningOutcome.id)]
      if (userShares && new BN(userShares.rawBalance).gt(0)) {
        // for yesNo and categoricals user would get 1 cash for each share
        // TODO: figure out scalars when the time comes
        const claimableBalance = String(new BN(userShares.maxUsdValue).minus(new BN(userShares.initCostUsd)));
        const userBalances = Object.keys(outcomeBalances).reduce((p, id) => {
          p[Number(id)] = outcomeBalances[Number(id)].rawBalance;
          return p;
        }, [])
        marketShares[amm.id].claimableWinnings = {
          claimableBalance,
          sharetoken: amm.cash.shareToken,
          userBalances,
        }
      }
    }
    return p;
  }, {})
}

const getTotalPositions = (ammMarketShares: AmmMarketShares): { change24hrPositionUsd: string, totalPositionUsd: string, total24hrPositionUsd: string } => {
  const result = Object.keys(ammMarketShares).reduce((p, ammId) => {
    const outcomes = ammMarketShares[ammId];
    outcomes.positions.forEach(position => {
      p.total = p.total.plus(new BN(position.usdValue));
      if (position.past24hrUsdValue) {
        p.total24 = p.total24.plus(new BN(position.past24hrUsdValue))
      }
    })
    return p;
  }, { total: new BN("0"), total24: new BN("0") })

  const change24hrPositionUsd = String(result.total.minus(result.total24));
  return { change24hrPositionUsd, total24hrPositionUsd: String(result.total24), totalPositionUsd: String(result.total) }
}


const getPositionUsdValues = (trades: UserTrades, rawBalance: string, balance: string, outcome: string, amm: AmmExchange): PositionBalance => {
  const { priceNo, priceYes, past24hrPriceNo, past24hrPriceYes } = amm;
  let usdValue = "0";
  let past24hrUsdValue = null;
  let change24hrPositionUsd = null;
  let avgPrice = "0";
  let initCostUsd = "0";
  let totalChangeUsd = "0";
  let quantity = formatEther(balance).formatted;
  const outcomeId = Number(outcome);
  let visible = false;
  // need to get this from outcome
  const outcomeName = YES_NO_OUTCOMES_NAMES[Number(outcome)];
  const maxUsdValue = String(new BN(balance).times(new BN(amm.cash.usdPrice)));
  if (balance !== "0") {
    if (outcome === String(NO_OUTCOME_ID)) {
      usdValue = String(new BN(balance).times(new BN(priceNo)));
      past24hrUsdValue = past24hrPriceNo ? String(new BN(balance).times(new BN(past24hrPriceNo))) : null;
      change24hrPositionUsd = past24hrPriceNo ? String(new BN(usdValue).times(new BN(past24hrUsdValue))) : null;
      const result = getInitPositionValues(trades, amm, false);
      avgPrice = formatDai(result.avgPrice).formatted;
      initCostUsd = result.initCostUsd;
      totalChangeUsd = formatDai(new BN(usdValue).minus(new BN(initCostUsd))).full;
      visible = true;
    } else if (outcome === String(YES_OUTCOME_ID)) {
      usdValue = String(new BN(balance).times(new BN(priceYes)));
      past24hrUsdValue = past24hrPriceYes ? String(new BN(balance).times(new BN(past24hrPriceYes))) : null;
      change24hrPositionUsd = past24hrPriceYes ? String(new BN(usdValue).times(new BN(past24hrUsdValue))) : null;
      const result = getInitPositionValues(trades, amm, true);
      avgPrice = formatDai(result.avgPrice).formatted;
      initCostUsd = result.initCostUsd;
      totalChangeUsd = formatDai(new BN(usdValue).minus(new BN(initCostUsd))).full;
      visible = true;
    }
  }

  return {
    balance,
    quantity,
    rawBalance,
    usdValue,
    past24hrUsdValue,
    change24hrPositionUsd,
    totalChangeUsd,
    avgPrice,
    initCostUsd,
    outcomeName,
    outcomeId,
    maxUsdValue,
    visible,
  }
}

const populateInitLPValues = async (lptokens: LPTokens, ammExchanges: AmmExchanges, account: string): Promise<LPTokens> => {
  const ammIds = Object.keys(lptokens);
  for (let i = 0; i < ammIds.length; i++) {
    const ammId = ammIds[i];
    const lptoken = lptokens[ammId];
    const amm = ammExchanges[ammId];
    const cashPrice = amm.cash?.usdPrice ? amm.cash?.usdPrice : "0";
    // sum up enters shares
    const accum = accumLpSharesAmounts(amm.transactions, account);
    const initialCashValue = convertOnChainCashAmountToDisplayCashAmount(new BN(accum), new BN(amm.cash.decimals));
    lptoken.initCostUsd = String(new BN(initialCashValue).times(new BN(cashPrice)));

    // TOOD: middleware issue, needs approval to do estimate
    //lptoken.usdValue = await getLPCurrentValue(lptoken.rawBalance, amm);
  }

  return lptokens;
}

// TODO: figure out how to get current LP token value, middleware needs an approval to do estimate
// eslint-disable-next-line
const getLPCurrentValue = async (rawBalance: string, amm: AmmExchange): Promise<string> => {
  // middleware call to get current value of LP tokens
  const { marketId, cash, feePercent, priceNo, priceYes } = amm;
  const usdPrice = amm.cash?.usdPrice ? amm.cash?.usdPrice : "0";
  const estimate = await getRemoveLiquidity({ marketId, paraShareToken: cash.shareToken, fee: feePercent, lpTokenBalance: rawBalance })
  .catch(error=> console.error('estimation error', error));
  if (estimate) {
    const displayCashValue = convertOnChainCashAmountToDisplayCashAmount(estimate.cashShares, cash.decimals).times(usdPrice);
    const displayNoValue = new BN(onChainMarketSharesToDisplayShares(estimate.noShares, cash.decimals)).times(new BN(priceNo)).times(usdPrice);
    const displayYesValue = new BN(onChainMarketSharesToDisplayShares(estimate.yesShares, cash.decimals)).times(new BN(priceYes)).times(usdPrice);
    const totalValue = displayCashValue.plus(displayNoValue).plus(displayYesValue)
    return String(totalValue);
  }
  return null;
}

const accumLpSharesAmounts = (transactions: AmmTransaction[], account: string): string => {
  const adds = transactions.filter(t => t.sender.toLowerCase() === account.toLowerCase() && t.tx_type === TransactionTypes.ADD_LIQUIDITY)
    .reduce((p, t) => p.plus(new BN(t.cash)), new BN("0"))
  const removed = transactions.filter(t => t.sender.toLowerCase() === account.toLowerCase() && t.tx_type === TransactionTypes.REMOVE_LIQUIDITY)
    .reduce((p, t) => p.plus(new BN(t.cash)), new BN("0"))

  return String(adds.minus(removed));
}


// TODO: isYesOutcome is for convenience, down the road, outcome index will be used.
const getInitPositionValues = (trades: UserTrades, amm: AmmExchange, isYesOutcome: boolean): { avgPrice: string, initCostUsd: string } => {
  // if cash price not available show zero for costs
  const cashPrice = amm.cash?.usdPrice ? amm.cash?.usdPrice : "0";

  // sum up enters shares
  const sharesEntered = accumSharesPrice(trades.enters, isYesOutcome);
  const sharesExited = accumSharesPrice(trades.exits, isYesOutcome);

  const totalShares = sharesEntered.shares.minus(sharesExited.shares);
  const avgPrice = totalShares.gt(0) ? sharesEntered.price.minus(sharesExited.price).div(sharesEntered.count.minus(sharesExited.count)) : new BN(0);
  const formattedShares = new BN(onChainMarketSharesToDisplayShares(totalShares, amm.cash.decimals));
  const cost = formattedShares.gt(0) ? formattedShares.times(avgPrice).times(new BN(cashPrice)) : new BN(0);

  return { avgPrice: String(avgPrice), initCostUsd: String(cost) }
}

const accumSharesPrice = (trades: AmmTransaction[], isYesOutcome: boolean): { shares: BigNumber, price: BigNumber, count: BigNumber } => {
  const result = trades.reduce((p, t) =>
    isYesOutcome ?
      { shares: p.shares.plus(new BN(t.yesShares)), price: p.price.plus(new BN(t.price)), count: p.count.plus(1) } :
      { shares: p.shares.plus(new BN(t.noShares)), price: p.price.plus(new BN(t.price)), count: p.count.plus(1) },
    { shares: new BN(0), price: new BN(0), count: new BN(0) });

  return { shares: result.shares, price: result.price, count: result.count };
}

const getEthBalance = async (provider: Web3Provider, cashes: Cashes, account: string): Promise<CurrencyBalance> => {
  const ethCash = Object.values(cashes).find(c => c.name === ETH);
  const ethbalance = await provider.getBalance(account);
  const ethValue = convertOnChainCashAmountToDisplayCashAmount(
    new BN(String(ethbalance)),
    18
  );

  return {
    balance: String(ethValue),
    rawBalance: String(ethbalance),
    usdValue: ethCash
      ? String(ethValue.times(new BN(ethCash.usdPrice)))
      : String(ethValue),
  };
}

const getUserTrades = (account: string, transactions: AmmTransaction[]): { enters: AmmTransaction[], exits: AmmTransaction[] } => {
  if (!transactions || transactions.length === 0) return { enters: [], exits: [] }
  const enterTrades = transactions.filter(t => t.sender.toLowerCase() === account.toLowerCase() && t.tx_type === TransactionTypes.ENTER)
  const exitTrades = transactions.filter(t => t.sender.toLowerCase() === account.toLowerCase() && t.tx_type === TransactionTypes.EXIT)
  return { enters: enterTrades, exits: exitTrades }
}

export const isAddress = value => {
  try {
    return ethers.utils.getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

export const getContract = (tokenAddress: string, ABI: any, library: Web3Provider, account?: string): Contract => {
  if (!isAddress(tokenAddress) || tokenAddress === NULL_ADDRESS) {
    throw Error(`Invalid 'address' parameter '${tokenAddress}'.`)
  }
  return new Contract(tokenAddress, ABI, getProviderOrSigner(library, account) as any)
}

// returns null on errors
export const getErc20Contract = (tokenAddress: string, library: Web3Provider, account: string): Contract | null => {
  if (!tokenAddress || !library) return null
  try {
    return getContract(tokenAddress, ERC20ABI, library, account)
  } catch (error) {
    console.error('Failed to get contract', error)
    return null
  }
}

export const getErc1155Contract = (tokenAddress: string, library: Web3Provider, account: string): Contract | null => {
  if (!tokenAddress || !library) return null
  try {
    return getContract(tokenAddress, ParaShareToken.ABI, library, account)
  } catch (error) {
    console.error('Failed to get contract', error)
    return null
  }
}

export const getERC20Allowance = async (tokenAddress: string, provider: Web3Provider, account: string, spender: string): Promise<string> => {
  const multicall = new Multicall({ ethersProvider: provider });

  const contractAllowanceCall: ContractCallContext[] = [{
    reference: tokenAddress,
    contractAddress: tokenAddress,
    abi: ERC20ABI,
    calls: [
      {
        reference: tokenAddress,
        methodName: 'allowance',
        methodParameters: [account, spender],
      },
    ],
  }];

  const allowance: ContractCallResults = await multicall.call(
    contractAllowanceCall
  );

  console.log('allowance', String(allowance))
  let allowanceAmount = "0";
  Object.keys(allowance.results).forEach((key) => {
    const value = allowance.results[key].callsReturnContext[0].returnValues as ethers.utils.Result;
    allowanceAmount = String(new BN(value.hex));
  })

  return allowanceAmount;
}

export const getERC1155ApprovedForAll = async (tokenAddress: string, provider: Web3Provider, account: string, spender: string): Promise<boolean> => {
  const multicall = new Multicall({ ethersProvider: provider });

  const contractAllowanceCall: ContractCallContext[] = [{
    reference: tokenAddress,
    contractAddress: tokenAddress,
    abi: ParaShareToken.ABI,
    calls: [
      {
        reference: tokenAddress,
        methodName: 'isApprovedForAll',
        methodParameters: [account, spender],
      },
    ],
  }];

  const isApprovedResult: ContractCallResults = await multicall.call(
    contractAllowanceCall
  );

  console.log('isApproved result', String(isApprovedResult))
  let isApproved = false;
  Object.keys(isApprovedResult.results).forEach((key) => {
    const value = isApprovedResult.results[key].callsReturnContext[0].returnValues as ethers.utils.Result;
    isApproved = Boolean(value)
  })

  return isApproved;
}

const ERC20ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
];
