import BigNumber, { BigNumber as BN } from 'bignumber.js'
import { RemoveLiquidityRate, ParaShareToken } from '@augurproject/sdk-lite'
import { TradingDirection, AmmExchange, AmmExchanges, AmmMarketShares, AmmTransaction, Cashes, CurrencyBalance, PositionBalance, TransactionTypes, UserBalances, MarketInfos, LPTokens, EstimateEnterTradeResult, EstimateExitTradeResult, Cash, AddLiquidityBreakdown, LiquidityBreakdown } from '../modules/types'
import ethers from 'ethers';
import { Contract } from '@ethersproject/contracts'
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from '@augurproject/ethereum-multicall';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers'
import { convertDisplayCashAmountToOnChainCashAmount, convertDisplayShareAmountToOnChainShareAmount, convertOnChainCashAmountToDisplayCashAmount, formatDai, formatEther, convertOnChainSharesToDisplayShareAmount, isSameAddress } from './format-number';
import { augurSdkLite } from './augurlitesdk';
import { ETH, FINALIZED, NO_OUTCOME_ID, NULL_ADDRESS, USDC, YES_NO_OUTCOMES_NAMES, YES_OUTCOME_ID } from '../modules/constants';
import { getProviderOrSigner } from '../modules/ConnectAccount/utils';

const convertPriceToPercent = (price: string) => {
  return String(new BN(price).times(100));
}

export async function getAmmLiquidity(
  account: string,
  amm: AmmExchange,
  marketId: string,
  cash: Cash,
  fee: string,
  cashAmount: string,
  priceNo: string,
  priceYes: string,
): Promise<AddLiquidityBreakdown> {
  const augurClient = augurSdkLite.get();
  if (!augurClient || !augurClient.amm) {
    console.error('augurClient is null');
    return null;
  }

  const hasLiquidity = amm !== null && amm?.id !== undefined && amm?.liquidity !== "0";
  const sharetoken = cash?.shareToken;
  const ammAddress = amm?.id;
  const amount = convertDisplayCashAmountToOnChainCashAmount(cashAmount, cash.decimals);
  console.log(
    'getAddAmmLiquidity',
    account,
    'amm address', ammAddress,
    hasLiquidity,
    'marketId', marketId,
    'sharetoken', sharetoken,
    fee,
    String(amount),
    'No',
    String(priceNo),
    'Yes',
    String(priceYes),
  );

  // converting odds to pool percentage. odds is the opposit of pool percentage
  // same when converting pool percentage to price
  const poolYesPercent = new BN(convertPriceToPercent(priceNo));
  const poolNoPercent = new BN(convertPriceToPercent(priceYes));

  const addLiquidityResults = await augurClient.amm.getAddLiquidity(
    account,
    ammAddress,
    hasLiquidity,
    marketId,
    sharetoken,
    new BN(fee),
    new BN(amount),
    poolYesPercent,
    poolNoPercent
  );

  if (addLiquidityResults) {
    let lpTokensValue = String(addLiquidityResults);
    if (Array.isArray(addLiquidityResults)) {
      lpTokensValue = String(addLiquidityResults[1]);
    }
    // TODO: Get amounts of yes and no shares from estimate
    // middleware changes might be needed
    const lpTokens = String(convertOnChainSharesToDisplayShareAmount(String(lpTokensValue), cash.decimals));
    return {
      lpTokens,
      cashAmount: "0",
      yesShares: "0",
      noShares: "0",
    }
  }

  return null;

}

export function doAmmLiquidity(
  account: string,
  amm: AmmExchange,
  marketId: string,
  cash: Cash,
  fee: string,
  cashAmount: string,
  hasLiquidity: boolean,
  priceNo: string,
  priceYes: string,
): Promise<TransactionResponse | null> {
  const augurClient = augurSdkLite.get();
  if (!augurClient || !augurClient.amm) {
    console.error('augurClient is null');
    return null;
  }
  const sharetoken = cash?.shareToken;
  const ammAddress = amm?.id;
  const amount = convertDisplayCashAmountToOnChainCashAmount(cashAmount, cash.decimals);
  console.log(
    'doAmmLiquidity',
    account,
    ammAddress,
    hasLiquidity,
    marketId,
    sharetoken,
    fee,
    String(amount),
    'No',
    String(priceNo),
    'Yes',
    String(priceYes),
  );

  // converting odds to pool percentage. odds is the opposit of pool percentage
  // same when converting pool percentage to price
  const poolYesPercent = new BN(convertPriceToPercent(priceNo));
  const poolNoPercent = new BN(convertPriceToPercent(priceYes));

  return augurClient.amm.doAddLiquidity(
    account,
    ammAddress,
    hasLiquidity,
    marketId,
    sharetoken,
    new BN(fee),
    new BN(amount),
    poolYesPercent,
    poolNoPercent
  );
}

export async function getRemoveLiquidity(
  marketId: string,
  cash: Cash,
  fee: string,
  lpTokenBalance: string,
): Promise<LiquidityBreakdown | null> {
  const augurClient = augurSdkLite.get();
  if (!augurClient || !marketId || !cash?.shareToken || !fee || !cash?.decimals) {
    console.error('getRemoveLiquidity: augurClient is null or no amm address');
    return null;
  }
  //console.log('marketId', marketId, 'paraSharetoken', cash?.shareToken, 'fee', fee, 'lp tokens', lpTokenBalance);
  const balance = convertDisplayShareAmountToOnChainShareAmount(lpTokenBalance, cash?.decimals);
  const alsoSell = true;
  const results: RemoveLiquidityRate = await augurClient.amm.getRemoveLiquidity(
    marketId,
    cash.shareToken,
    new BN(String(fee)),
    new BN(String(balance)),
    alsoSell
  );
  //console.log('results.cash', String(results.cash), cash?.decimals, 'lpTokenBalance', lpTokenBalance, 'balance', String(balance));
  const shortShares = String(convertOnChainSharesToDisplayShareAmount(results.short, cash?.decimals));
  const longShares = String(convertOnChainSharesToDisplayShareAmount(results.long, cash?.decimals));
  const cashAmount = String(convertOnChainCashAmountToDisplayCashAmount(results.cash, cash?.decimals));

  return {
    noShares: shortShares,
    yesShares: longShares,
    cashAmount: cashAmount,
  };
}

export function doRemoveAmmLiquidity(
  marketId: string,
  cash: Cash,
  fee: string,
  lpTokenBalance: string,
): Promise<TransactionResponse | null> {
  const augurClient = augurSdkLite.get();
  if (!augurClient || !marketId || !cash?.shareToken || !fee) {
    console.error('doRemoveLiquidity: augurClient is null or no amm address');
    return null;
  }
  const balance = convertDisplayShareAmountToOnChainShareAmount(lpTokenBalance, cash?.decimals);
  const alsoSell = true;
  return augurClient.amm.doRemoveLiquidity(
    marketId,
    cash.shareToken,
    new BN(fee),
    new BN(balance),
    alsoSell
  );
}

export const estimateEnterTrade = async (
  amm: AmmExchange,
  inputDisplayAmount: string,
  outputYesShares: boolean = true,
): Promise<EstimateEnterTradeResult | null> => {
  const startTime = new Date().getTime()
  const breakdownWithFeeRaw = await estimateMiddlewareTrade(TradingDirection.ENTRY, amm, inputDisplayAmount, outputYesShares);
  const breakdownWithoutFeeRaw = await estimateMiddlewareTrade(TradingDirection.ENTRY, amm, inputDisplayAmount, outputYesShares, false);

  if (!breakdownWithFeeRaw || !breakdownWithoutFeeRaw) return null;

  const estimatedShares = convertOnChainSharesToDisplayShareAmount(breakdownWithFeeRaw, amm.cash.decimals);
  const estimatedSharesWithoutFee = convertOnChainSharesToDisplayShareAmount(breakdownWithoutFeeRaw, amm.cash.decimals);
  const tradeFees = String(new BN(estimatedSharesWithoutFee).minus(new BN(estimatedShares)));

  const averagePrice = new BN(inputDisplayAmount).div(new BN(estimatedShares)).toFixed(2);
  const maxProfit = String(new BN(estimatedShares).minus(new BN(inputDisplayAmount)));
  const price = outputYesShares ? amm.priceYes : amm.priceNo;
  const slippagePercent = (new BN(averagePrice).minus(price)).div(price).times(100).toFixed(2);
  const ratePerCash = new BN(estimatedShares).div(new BN(inputDisplayAmount)).toFixed(6);

  const endTime = new Date().getTime();
  console.log('seconds to estimate', (endTime - startTime) / 1000)

  return {
    outputShares: String(estimatedShares),
    tradeFees,
    averagePrice,
    maxProfit,
    slippagePercent,
    ratePerCash
  }
}

export const estimateExitTrade = async (
  amm: AmmExchange,
  inputDisplayAmount: string,
  outputYesShares: boolean = true,
  userBalances: string[] = [],
): Promise<EstimateExitTradeResult | null> => {

  const startTime = new Date().getTime()
  const breakdownWithFeeRaw = await estimateMiddlewareTrade(TradingDirection.EXIT, amm, inputDisplayAmount, outputYesShares, true, userBalances);
  const breakdownWithoutFeeRaw = await estimateMiddlewareTrade(TradingDirection.EXIT, amm, inputDisplayAmount, outputYesShares, false, userBalances);

  const estimateCash = convertOnChainCashAmountToDisplayCashAmount(breakdownWithFeeRaw, amm.cash.decimals);
  const estimateCashWithoutFees = convertOnChainCashAmountToDisplayCashAmount(breakdownWithoutFeeRaw, amm.cash.decimals);
  const estimateFees = String(new BN(estimateCashWithoutFees).minus(new BN(estimateCash)));
  console.log('breakdownWithoutFeeRaw', String(breakdownWithoutFeeRaw))
  const averagePrice = new BN(estimateCash).div(new BN(inputDisplayAmount)).toFixed(2);
  const price = outputYesShares ? amm.priceYes : amm.priceNo;
  const shares = outputYesShares ? new BN(userBalances[YES_OUTCOME_ID]) : BigNumber.min(new BN(userBalances[0]), new BN(userBalances[NO_OUTCOME_ID]));
  const slippagePercent = (new BN(averagePrice).minus(price)).div(price).times(100).toFixed(2);
  const ratePerCash = new BN(estimateCash).div(new BN(inputDisplayAmount)).toFixed(6);
  const displayShares = convertOnChainSharesToDisplayShareAmount(shares, amm.cash.decimals);
  const remainingShares = String(new BN(displayShares).minus(new BN(inputDisplayAmount)).toFixed(6));

  const endTime = new Date().getTime();
  console.log('seconds to estimate', (endTime - startTime) / 1000)

  return {
    outputCash: String(estimateCash),
    estimateFees,
    averagePrice,
    slippagePercent,
    ratePerCash,
    remainingShares,
  }
}

export const estimateMiddlewareTrade = async (
  tradeDirection: TradingDirection,
  amm: AmmExchange,
  inputDisplayAmount: string,
  outputYesShares: boolean = true,
  includeFee: boolean = true,
  userBalances: string[] = [],
): Promise<string | null> => {
  const augurClient = augurSdkLite.get();
  const ammId = amm?.id;
  if (!augurClient || !ammId) {
    console.error('estimateTrade: augurClient is null or amm address');
    return null;
  }

  let breakdown = null;
  const { cash, marketId, feeRaw } = amm;
  if (tradeDirection === TradingDirection.ENTRY) {
    const inputOnChainCashAmount = convertDisplayCashAmountToOnChainCashAmount(new BN(inputDisplayAmount || "0"), new BN(cash?.decimals))
    console.log(
      tradeDirection,
      'marketId',
      marketId,
      'shareToken',
      cash.shareToken,
      'fee',
      feeRaw,
      'cash',
      String(inputDisplayAmount),
      'output yes:',
      outputYesShares,
      'includeFee:',
      includeFee
    );
    breakdown = await augurClient.amm.getEnterPosition(
      amm.marketId,
      cash.shareToken,
      new BN(feeRaw),
      inputOnChainCashAmount,
      outputYesShares,
      includeFee
    ).catch(e => console.log('Error get enter position', e));

    return String(breakdown);
  }

  if (tradeDirection === TradingDirection.EXIT) {
    let longShares = new BN('0');
    let shortShares = new BN('0');
    let invalidShares = new BN(userBalances[0]);
    if (!outputYesShares) {
      let shortOnChainShares = convertDisplayShareAmountToOnChainShareAmount(new BN(inputDisplayAmount), new BN(cash.decimals));
      shortShares = BN.minimum(invalidShares, shortOnChainShares);
    } else {
      longShares = convertDisplayShareAmountToOnChainShareAmount(new BN(inputDisplayAmount), new BN(cash.decimals));
    }

    breakdown = await augurClient.amm.getExitPosition(
      marketId,
      cash.shareToken,
      new BN(feeRaw),
      shortShares,
      longShares,
      includeFee
    ).catch(e => console.log('Error get Exit Position', e));
    return String(breakdown);
  }

  return null;
}

export async function doTrade(
  tradeDirection: TradingDirection,
  amm: AmmExchange,
  minAmount: string,
  inputDisplayAmount: string,
  outputYesShares: boolean = true,
  userBalances: string[] = ["0", "0", "0"],
  useEth: boolean = false
) {
  const augurClient = augurSdkLite.get();
  if (!augurClient || !amm.id)
    return console.error('doTrade: augurClient is null or amm address');

  if (tradeDirection === TradingDirection.ENTRY) {
    console.log(
      'doEnterPosition:',
      amm.marketId,
      amm.cash.shareToken,
      amm.feeRaw,
      String(inputDisplayAmount),
      outputYesShares,
      String(minAmount)
    );

    const inputOnChainCashAmount = convertDisplayCashAmountToOnChainCashAmount(new BN(inputDisplayAmount || "0"), new BN(amm.cash.decimals))
    const onChainMinShares = convertDisplayShareAmountToOnChainShareAmount(minAmount, amm.cash.decimals);
    return augurClient.amm.doEnterPosition(
      amm.marketId,
      amm.cash.shareToken,
      new BN(amm.feeRaw),
      inputOnChainCashAmount,
      outputYesShares,
      new BN(onChainMinShares),
    );
  }

  if (tradeDirection === TradingDirection.EXIT) {
    const inputOnChainSharesAmount = convertDisplayShareAmountToOnChainShareAmount(new BN(inputDisplayAmount || "0"), new BN(amm.cash.decimals))
    let longShares = new BN('0');
    let shortShares = new BN('0');
    let invalidShares = new BN(userBalances[0]);
    if (!outputYesShares) {
      shortShares = new BN(inputOnChainSharesAmount);
      shortShares = BN.minimum(invalidShares, shortShares);
    } else {
      longShares = new BN(inputOnChainSharesAmount);
    }
    const onChainMinAmount = convertDisplayCashAmountToOnChainCashAmount(new BN(minAmount), new BN(amm.cash.decimals));
    console.log(
      'doExitPosition:',
      amm.marketId,
      amm.cash.shareToken,
      amm.feeRaw,
      String(shortShares),
      String(longShares),
      String(onChainMinAmount)
    );

    return augurClient.amm.doExitPosition(
      amm.marketId,
      amm.cash.shareToken,
      new BN(amm.feeRaw),
      shortShares,
      longShares,
      onChainMinAmount
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
        const cash = cashes[ammExchanges[contractAddress]?.cash?.address];
        const balance = convertOnChainSharesToDisplayShareAmount(
          rawBalance,
          cash?.decimals
        );
        if (balance.gt(0)) {
          userBalances.lpTokens[contractAddress] = { balance: String(balance), rawBalance };
        }
      }
    } else if (method === MARKET_SHARE_BALANCE) {

      const cash = Object.values(cashes).find(
        (c) => c.shareToken.toLowerCase() === contractAddress.toLowerCase()
      );
      const balance = String(convertOnChainSharesToDisplayShareAmount(
        rawBalance,
        cash?.decimals
      ));

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
          userBalances.marketShares[amm.id].outcomeSharesRaw[Number(outcome)] = rawBalance;
          userBalances.marketShares[amm.id].outcomeShares[Number(outcome)] = String(convertOnChainSharesToDisplayShareAmount(rawBalance, cash.decimals));
        } else if (balance !== "0") {
          userBalances.marketShares[amm.id] = {
            ammExchange: amm,
            positions: [],
            outcomeSharesRaw: ["0", "0", "0"],
            outcomeShares: ["0", "0", "0"],
          }
          userBalances.marketShares[amm.id].positions.push(getPositionUsdValues(trades, rawBalance, balance, outcome, amm));
          userBalances.marketShares[amm.id].outcomeSharesRaw[Number(outcome)] = rawBalance;
          userBalances.marketShares[amm.id].outcomeShares[Number(outcome)] = String(convertOnChainSharesToDisplayShareAmount(rawBalance, cash.decimals));
        }
      }
    }
  })

  if (finalizedMarkets.length > 0) {
    const keyedFinalizedMarkets = finalizedMarkets.reduce((p, f) => ({ ...p, [f.marketId]: f }), {})
    populateClaimableWinnings(keyedFinalizedMarkets, finalizedAmmExchanges, userBalances.marketShares);
  }

  normalizeNoInvalidPositionsBalances(userBalances.marketShares);
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

const normalizeNoInvalidPositionsBalances = (ammMarketShares: AmmMarketShares): void => {
  Object.keys(ammMarketShares).forEach(ammId => {
    const marketShares = ammMarketShares[ammId];
    const minNoInvalidBalance = String(Math.min(Number(marketShares.outcomeShares[0]), Number(marketShares.outcomeShares[1])));
    const minNoInvalidRawBalance = String(BigNumber.min(new BN(marketShares.outcomeSharesRaw[0]), new BN(marketShares.outcomeSharesRaw[1])));
    marketShares.positions.forEach(position => {
      // user can only sell the min of 'N' and 'Invalid' shares
      if (position.outcomeId === NO_OUTCOME_ID) {
        position.balance = minNoInvalidBalance;
        position.rawBalance = minNoInvalidRawBalance;
      }
    })
  })
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

const getLPCurrentValue = async (displayBalance: string, amm: AmmExchange): Promise<string> => {
  const usdPrice = amm.cash?.usdPrice ? amm.cash?.usdPrice : "0";
  const { marketId, cash, feeRaw, priceNo, priceYes } = amm;
  const estimate = await getRemoveLiquidity(marketId, cash, feeRaw, displayBalance)
    .catch(error => console.error('estimation error', error));
  if (estimate) {
    const displayCashValue = new BN(estimate.cashAmount).times(usdPrice);
    const displayNoValue = new BN(estimate.noShares).times(new BN(priceNo)).times(usdPrice);
    const displayYesValue = new BN(estimate.yesShares).times(new BN(priceYes)).times(usdPrice);
    const totalValue = displayCashValue.plus(displayNoValue).plus(displayYesValue);
    return String(totalValue);
  }
  return null;
}

const populateInitLPValues = async (lptokens: LPTokens, ammExchanges: AmmExchanges, account: string): Promise<LPTokens> => {
  const ammIds = Object.keys(lptokens);
  for (let i = 0; i < ammIds.length; i++) {
    const ammId = ammIds[i];
    const lptoken = lptokens[ammId];
    const amm = ammExchanges[ammId];
    // sum up enters/exits transaction usd cash values
    const initialCashValueUsd = accumLpSharesAmounts(amm.transactions, account);
    lptoken.initCostUsd = initialCashValueUsd;
    lptoken.usdValue = await getLPCurrentValue(lptoken.balance, amm);
    lptoken.feesEarned = String(new BN(lptoken.usdValue).minus(new BN(lptoken.initCostUsd)));
  }

  return lptokens;
}

const accumLpSharesAmounts = (transactions: AmmTransaction[], account: string): string => {
  const adds = transactions.filter(t => isSameAddress(t.sender, account) && t.tx_type === TransactionTypes.ADD_LIQUIDITY)
    .reduce((p, t) => p.plus(new BN(t.cashValueUsd || "0")), new BN("0"))
  const removed = transactions.filter(t => isSameAddress(t.sender, account) && t.tx_type === TransactionTypes.REMOVE_LIQUIDITY)
    .reduce((p, t) => p.plus(new BN(t.cashValueUsd || "0")), new BN("0"))

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
  const formattedShares = new BN(convertOnChainSharesToDisplayShareAmount(totalShares, amm.cash.decimals));
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

  // console.log('allowance', String(allowance))
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
