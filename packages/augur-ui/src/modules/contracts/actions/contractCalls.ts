/**
 * Things we need to figure out
 * 1. gas estimates on contract calls
 * 2. pending tx and how to support existing in-line processing feedbadk to user
 */
// put all calls to contracts here that need conversion from display values to onChain values
import { augurSdk } from 'services/augursdk';
import {
  formatAttoRep,
  formatAttoEth,
  formatAttoDai,
} from 'utils/format-number';
import {
  PlaceTradeDisplayParams,
  SimulateTradeData,
  CreateCategoricalMarketParams,
  CreateScalarMarketParams,
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
  Getters,
  numTicksToTickSizeWithDisplayPrices,
  calculatePayoutNumeratorsArray,
  convertDisplayValuetoAttoValue,
} from '@augurproject/sdk';

import { generateTradeGroupId } from 'utils/generate-trade-group-id';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import {
  NULL_ADDRESS,
  SCALAR,
  CATEGORICAL,
  TEN_TO_THE_EIGHTEENTH_POWER,
  BUY,
} from 'modules/common/constants';
import { TestNetReputationToken } from '@augurproject/core/build/libraries/GenericContractInterfaces';
import { CreateMarketData, LiquidityOrder } from 'modules/types';
import { formatBytes32String } from 'ethers/utils';
import { constructMarketParams } from 'modules/create-market/helpers/construct-market-params';
import { ExtraInfoTemplate } from '@augurproject/artifacts';

export function clearUserTx(): void {
  // const Augur = augurSdk.get();
  // TODO: impl this for ethers
  // old comment - clear ethrpc transaction history, registered callbacks, and alerts
}

export function isWeb3Transport(): boolean {
  return augurSdk.isWeb3Transport;
}

export async function isTransactionConfirmed(hash: string): Promise<boolean> {
  const tx = await getTransaction(hash);
  if (!tx) {
    console.log('Transaction could not be found', hash);
    return false;
  }
  // confirmations is number of blocks beyond block that includes tx
  return tx.confirmations > 0;
}

export async function getTransaction(hash: string): Promise<any> {
  const Augur = augurSdk.get();
  const tx = await Augur.getTransaction(hash);
  return tx;
}

export async function getGasPrice(): Promise<BigNumber> {
  const Augur = augurSdk.get();
  const gasPrice = await Augur.getGasPrice();
  return gasPrice;
}

export async function isUnlocked(address: string): Promise<boolean> {
  // TODO: do we need to stop supporting unlocked nodes
  return false;
}

export function getNetworkId(): string {
  const Augur = augurSdk.get();
  const networkId = Augur.networkId;
  return networkId;
}

export async function getAccounts(): Promise<Array<string>> {
  const Augur = augurSdk.get();
  const accounts = await Augur.listAccounts();
  return accounts.map((a: string) => a.toLowerCase());
}

export async function checkIsKnownUniverse(universeId: string) {
  const { contracts } = augurSdk.get();
  const result = await contracts.augur.isKnownUniverse_(universeId);
  return result;
}


export async function convertV1ToV2Approve() {
  const { contracts } = augurSdk.get();

  const allowance = createBigNumber(99999999999999999999).times(
    TEN_TO_THE_EIGHTEENTH_POWER
  );

  const getReputationToken = await contracts.universe.getReputationToken_();
  const response = contracts.legacyReputationToken.approve(getReputationToken, allowance);
  return response;
}

export async function convertV1ToV2() {
  const { contracts } = augurSdk.get();

  const response = await contracts.reputationToken.migrateFromLegacyReputationToken();
  return response;
}

export async function convertV1ToV2_estimate() {
  const { contracts } = augurSdk.get();
  const allowance = createBigNumber(99999999999999999999).times(
    TEN_TO_THE_EIGHTEENTH_POWER
  );

  const getReputationToken = await contracts.universe.getReputationToken_();
  const approvalGas = await contracts.legacyReputationToken.approve_estimateGas(
    getReputationToken,
    allowance
  );
  const migrationGas = await contracts.reputationToken.migrateFromLegacyReputationToken_estimateGas();

  return approvalGas.plus(migrationGas);
}

export async function getCurrentBlock() {
  const Augur = augurSdk.get();
  const blockNumber = await Augur.provider.getBlockNumber();
  return blockNumber;
}

export async function getTimestamp(): Promise<number> {
  const Augur = augurSdk.get();
  const timestamp = await Augur.getTimestamp();
  return timestamp.toNumber();
}

export async function getRepBalance(
  universe: string,
  address: string
): Promise<BigNumber> {
  const { contracts } = augurSdk.get();
  const networkId = getNetworkId();
  const repToken = await contracts
    .universeFromAddress(universe)
    .getReputationToken_();
  const balance = await contracts
    .reputationTokenFromAddress(repToken, networkId)
    .balanceOf_(address);
  return balance;
}

export async function getLegacyRepBalance(
  address: string
): Promise<BigNumber> {
  const { contracts } = augurSdk.get();
  const lagacyRep = contracts.legacyReputationToken.address;
  const networkId = getNetworkId();
  const balance = await contracts
    .reputationTokenFromAddress(lagacyRep, networkId)
    .balanceOf_(address);
  return balance;
}


export async function getEthBalance(address: string): Promise<number> {
  const Augur = augurSdk.get();
  const balance = await Augur.getEthBalance(address);
  const balances = formatAttoEth(balance, { decimals: 4 });
  return balances.value;
}

export async function getDaiBalance(address: string): Promise<number> {
  const { contracts } = augurSdk.get();
  const balance = await contracts.cash.balanceOf_(address);
  return formatAttoDai(balance).value;
}

export async function sendDai_estimateGas(address: string, amount: string): Promise<BigNumber> {
  const { contracts } = augurSdk.get();
  const Cash = contracts.cash;
  const onChainAmount = createBigNumber(amount).multipliedBy(
    TEN_TO_THE_EIGHTEENTH_POWER
  );
  return Cash.transfer_estimateGas(address, onChainAmount);
}

export async function sendDai(address: string, amount: string) {
  const { contracts } = augurSdk.get();
  const Cash = contracts.cash;
  const onChainAmount = createBigNumber(amount).multipliedBy(
    TEN_TO_THE_EIGHTEENTH_POWER
  );
  return Cash.transfer(address, onChainAmount);
}

export async function sendEthers(address: string, amount: string) {
  const Augur = augurSdk.get();
  const onChainAmount = createBigNumber(amount).multipliedBy(
    TEN_TO_THE_EIGHTEENTH_POWER
  );
  return Augur.sendETH(address, onChainAmount);
}

export async function sendRep_estimateGas(address: string, amount: string): Promise<BigNumber> {
  const { contracts } = augurSdk.get();
  const RepToken = contracts.getReputationToken();
  const onChainAmount = createBigNumber(amount).multipliedBy(
    TEN_TO_THE_EIGHTEENTH_POWER
  );
  return RepToken.transfer_estimateGas(address, onChainAmount);
}


export async function sendRep(address: string, amount: string) {
  const { contracts } = augurSdk.get();
  const RepToken = contracts.getReputationToken();
  const onChainAmount = createBigNumber(amount).multipliedBy(
    TEN_TO_THE_EIGHTEENTH_POWER
  );
  return RepToken.transfer(address, onChainAmount);
}

export async function getRepThresholdForPacing() {
  const { contracts } = augurSdk.get();
  const threshold = await contracts.universe.getDisputeThresholdForDisputePacing_();
  return threshold;
}

export async function getDisputeThresholdForFork(universeId: string) {
  const { contracts } = augurSdk.get();
  const disputeThresholdForFork = await contracts
    .universeFromAddress(universeId)
    .getDisputeThresholdForFork_();
  return createBigNumber(disputeThresholdForFork);
}

export async function getOpenInterestInAttoCash() {
  const { contracts } = augurSdk.get();
  const openInterestInAttoCash = await contracts.universe.getOpenInterestInAttoCash_();
  return openInterestInAttoCash;
}

export async function getForkingMarket(universeId: string) {
  const { contracts } = augurSdk.get();
  const forkingMarket = await contracts
    .universeFromAddress(universeId)
    .getForkingMarket_();
  return forkingMarket;
}

export async function getForkEndTime(universeId: string) {
  const { contracts } = augurSdk.get();
  const forkEndTime = await contracts
    .universeFromAddress(universeId)
    .getForkEndTime_();
  return forkEndTime;
}

export async function getForkReputationGoal(universeId: string) {
  const { contracts } = augurSdk.get();
  const forkReputationGoal = await contracts
    .universeFromAddress(universeId)
    .getForkReputationGoal_();
  return forkReputationGoal;
}

export async function getWinningChildUniverse(universeId: string) {
  const { contracts } = augurSdk.get();
  const winningChildUniverse = await contracts
    .universeFromAddress(universeId)
    .getWinningChildUniverse_();
  return winningChildUniverse;
}

export async function getOrCacheDesignatedReportStake() {
  const { contracts } = augurSdk.get();
  const initialReporterStake = await contracts.universe.getOrCacheDesignatedReportStake();
  return initialReporterStake;
}

export async function isFinalized(marketId: string) {
  const Augur = augurSdk.get();
  const market = Augur.getMarket(marketId);
  if (!market) return false; // TODO: prob should throw error if market not found
  const status = await market.isFinalized_();
  return status;
}

export async function finalizeMarket(marketId: string) {
  const Augur = augurSdk.get();
  const market = Augur.getMarket(marketId);
  if (!market) return false; // TODO: prob should throw error if market not found
  return market.finalize();
}

export function getDai() {
  const { contracts } = augurSdk.get();
  return contracts.cashFaucet.faucet(new BigNumber('1000000000000000000000'));
}

export async function uniswapEthForRepRate(wei: BigNumber): Promise<BigNumber> {
  return new BigNumber(102);
}

export async function uniswapRepForEthRate(rep: BigNumber): Promise<BigNumber> {
  return new BigNumber(100);
}

export async function uniswapEthForDaiRate(wei: BigNumber): Promise<BigNumber> {
  return new BigNumber(148);
}

export async function uniswapDaiForEthRate(dai: BigNumber): Promise<BigNumber> {
  return new BigNumber(104);
}

export async function uniswapRepForDaiRate(rep: BigNumber): Promise<BigNumber> {
  return new BigNumber(108);
}

export async function uniswapDaiForRepRate(dai: BigNumber): Promise<BigNumber> {
  return new BigNumber(110);
}

export async function uniswapEthForRep(wei: BigNumber): Promise<BigNumber> {
  return new BigNumber(103);
}

export async function uniswapRepForEth(rep: BigNumber): Promise<BigNumber> {
  return new BigNumber(101);
}

export async function uniswapEthForDai(wei: BigNumber): Promise<BigNumber> {
  return new BigNumber(107);
}

export async function uniswapDaiForEth(dai: BigNumber): Promise<BigNumber> {
  return new BigNumber(105);
}

export async function uniswapRepForDai(rep: BigNumber): Promise<BigNumber> {
  return new BigNumber(109);
}

export async function uniswapDaiForRep(dai: BigNumber): Promise<BigNumber> {
  return new BigNumber(111);
}

export function getRep() {
  const { contracts } = augurSdk.get();
  const rep = contracts.reputationToken as TestNetReputationToken<BigNumber>;
  return rep.faucet(createBigNumber('100000000000000000000'));
}

export function getLegacyRep() {
  const { contracts } = augurSdk.get();
  const rep = contracts.legacyReputationToken;
  return rep.faucet(createBigNumber('10000000000000000000'));
}

export async function getCreateMarketBreakdown() {
  const { contracts } = augurSdk.get();
  const vBond = await contracts.universe.getOrCacheValidityBond_();
  const noShowBond = await contracts.universe.getOrCacheMarketRepBond_();
  const validityBondFormatted = formatAttoDai(vBond);
  const noShowFormatted = formatAttoRep(noShowBond, {
    decimals: 4,
  });
  return { validityBondFormatted, noShowFormatted };
}

export async function buyParticipationTokensEstimateGas(
  universeId: string,
  amount: string
) {
  const { contracts } = augurSdk.get();
  const attoAmount = convertDisplayValuetoAttoValue(createBigNumber(amount));
  return contracts.buyParticipationTokens.buyParticipationTokens_estimateGas(
    universeId,
    attoAmount
  );
}

export async function buyParticipationTokens(
  universeId: string,
  amount: string
) {
  const { contracts } = augurSdk.get();
  const attoAmount = convertDisplayValuetoAttoValue(createBigNumber(amount));
  return contracts.buyParticipationTokens.buyParticipationTokens(
    universeId,
    attoAmount
  );
}

export async function redeemUserStakesEstimateGas(
  reportingParticipantsContracts: string[],
  disputeWindows: string[]
) {
  const { contracts } = augurSdk.get();
  return contracts.redeemStake.redeemStake_estimateGas(
    reportingParticipantsContracts,
    disputeWindows
  );
}

export async function forkAndRedeem(reportingParticipantsContracts: string) {
  const { contracts } = augurSdk.get();
  try {
    contracts
      .getReportingParticipant(reportingParticipantsContracts)
      .forkAndRedeem();
  } catch (e) {
    console.error(
      'Could not fork and redeem sigle reporting participant contract',
      e
    );
  }
}

export async function redeemUserStakes(
  reportingParticipantsContracts: string[],
  disputeWindows: string[]
) {
  const { contracts } = augurSdk.get();
  try {
    contracts.redeemStake.redeemStake(
      reportingParticipantsContracts,
      disputeWindows
    );
  } catch (e) {
    console.error('Could not redeem REP', e);
  }
}

export async function disavowMarket(marketId: string) {
  const { contracts } = augurSdk.get();
  try {
    contracts.marketFromAddress(marketId).disavowCrowdsourcers();
  } catch (e) {
    console.error('Could not disavow market', marketId, e);
  }
}

export interface doReportDisputeAddStake {
  marketId: string;
  maxPrice: string;
  minPrice: string;
  numTicks: string;
  numOutcomes: number;
  marketType: string;
  outcomeId: number;
  description: string;
  attoRepAmount: string;
  isInvalid: boolean;
}

export async function doInitialReport_estimaetGas(report: doReportDisputeAddStake) {
  const market = getMarket(report.marketId);
  if (!market) return false;
  const payoutNumerators = getPayoutNumerators(report);
  return market.doInitialReport_estimateGas(
    payoutNumerators,
    report.description,
    createBigNumber(report.attoRepAmount || '0')
  );
}

export async function doInitialReport(report: doReportDisputeAddStake) {
  const market = getMarket(report.marketId);
  if (!market) return false;
  const payoutNumerators = getPayoutNumerators(report);
  return market.doInitialReport(
    payoutNumerators,
    report.description,
    createBigNumber(report.attoRepAmount || '0')
  );
}

export async function addRepToTentativeWinningOutcome_estimateGas(
  addStake: doReportDisputeAddStake
) {
  const market = getMarket(addStake.marketId);
  if (!market) return false;
  const payoutNumerators = getPayoutNumerators(addStake);
  return market.contributeToTentative_estimateGas(
    payoutNumerators,
    createBigNumber(addStake.attoRepAmount),
    addStake.description
  );
}

export async function addRepToTentativeWinningOutcome(
  addStake: doReportDisputeAddStake
) {
  const market = getMarket(addStake.marketId);
  if (!market) return false;
  const payoutNumerators = getPayoutNumerators(addStake);
  return market.contributeToTentative(
    payoutNumerators,
    createBigNumber(addStake.attoRepAmount),
    addStake.description
  );
}

export async function contribute_estimateGas(dispute: doReportDisputeAddStake) {
  const market = getMarket(dispute.marketId);
  if (!market) return false;
  const payoutNumerators = getPayoutNumerators(dispute);
  return market.contribute_estimateGas(
    payoutNumerators,
    createBigNumber(dispute.attoRepAmount),
    dispute.description
  );
}

export async function contribute(dispute: doReportDisputeAddStake) {
  const market = getMarket(dispute.marketId);
  if (!market) return false;
  const payoutNumerators = getPayoutNumerators(dispute);
  return market.contribute(
    payoutNumerators,
    createBigNumber(dispute.attoRepAmount),
    dispute.description
  );
}

function getMarket(marketId) {
  const Augur = augurSdk.get();
  const market = Augur.getMarket(marketId);
  if (!market) {
    console.log('could not find ', marketId);
    return null;
  }
  return market;
}

function getPayoutNumerators(inputs: doReportDisputeAddStake) {
  return calculatePayoutNumeratorsArray(
    inputs.maxPrice,
    inputs.minPrice,
    inputs.numTicks,
    inputs.numOutcomes,
    inputs.marketType,
    inputs.outcomeId,
    inputs.isInvalid
  );
}

export interface CreateNewMarketParams {
  outcomes?: string[];
  scalarDenomination: string;
  description: string;
  designatedReporterAddress: string;
  minPrice: string;
  maxPrice: string;
  endTime: number;
  numTicks?: number;
  tickSize?: number;
  marketType: string;
  detailsText?: string;
  categories: string[];
  settlementFee: number;
  affiliateFee: number;
  offsetName?: string;
  template?: ExtraInfoTemplate;
}

export function createMarketEstimateGas(
  newMarket: CreateNewMarketParams,
  isRetry: Boolean
) {
  const params = constructMarketParams(newMarket, isRetry) as any;
  const Augur = augurSdk.get();
  const { universe } = Augur.contracts;

  switch (newMarket.marketType) {
    case SCALAR: {
      return universe.createScalarMarket_estimateGas(
        params.endTime,
        params.feePerCashInAttoCash,
        NULL_ADDRESS,
        params.affiliateFeeDivisor,
        '0x0000000000000000000000000000000000000001',
        params.prices,
        params.numTicks,
        params.extraInfo
      );
    }
    case CATEGORICAL: {
      return universe.createCategoricalMarket_estimateGas(
        params.endTime,
        params.feePerCashInAttoCash,
        NULL_ADDRESS,
        params.affiliateFeeDivisor,
        '0x0000000000000000000000000000000000000001',
        params.outcomes,
        params.extraInfo
      );
    }
    default: {
      return universe.createYesNoMarket_estimateGas(
        params.endTime,
        params.feePerCashInAttoCash,
        NULL_ADDRESS,
        params.affiliateFeeDivisor,
        '0x0000000000000000000000000000000000000001',
        params.extraInfo
      );
    }
  }
}

export function createMarket(
  newMarket: CreateNewMarketParams,
  isRetry: Boolean
) {
  const params = constructMarketParams(newMarket, isRetry);
  const Augur = augurSdk.get();

  switch (newMarket.marketType) {
    case SCALAR: {
      return Augur.createScalarMarket(params as CreateScalarMarketParams);
    }
    case CATEGORICAL: {
      return Augur.createCategoricalMarket(
        params as CreateCategoricalMarketParams
      );
    }
    default: {
      return Augur.createYesNoMarket(params);
    }
  }
}

export function createMarketRetry(market: CreateMarketData) {
  const extraInfo = JSON.parse(market.txParams._extraInfo);

  const newMarket: CreateNewMarketParams = {
    outcomes: market.txParams._outcomes,
    scalarDenomination: extraInfo._scalarDenomination,
    marketType: market.marketType,
    endTime: market.endTime.timestamp,
    description: market.description,
    designatedReporterAddress: market.txParams._designatedReporterAddress,
    minPrice: market.txParams._prices && market.txParams._prices[0],
    maxPrice: market.txParams._prices && market.txParams._prices[1],
    numTicks: market.txParams._numTicks,
    detailsText: extraInfo.longDescription,
    categories: extraInfo.categories,
    settlementFee: market.txParams._feePerCashInAttoCash,
    affiliateFee: market.txParams._affiliateFeeDivisor,
    offsetName: extraInfo.offsetName,
  };

  return createMarket(newMarket, true);
}

export async function approveToTrade() {
  const { contracts } = augurSdk.get();
  const augurContract = contracts.augur.address;
  const allowance = createBigNumber(99999999999999999999).times(
    TEN_TO_THE_EIGHTEENTH_POWER
  );
  contracts.cash.approve(augurContract, allowance);
  contracts.shareToken.setApprovalForAll(contracts.fillOrder.address, true);
  contracts.shareToken.setApprovalForAll(contracts.createOrder.address, true);
  contracts.cash.approve(contracts.fillOrder.address, allowance);
  contracts.cash.approve(contracts.createOrder.address, allowance);
}

export async function getAllowance(account: string): Promise<BigNumber> {
  const { contracts } = augurSdk.get();
  const augurContract = contracts.augur.address;
  const allowanceRaw = await contracts.cash.allowance_(account, augurContract);
  const allowance = allowanceRaw.dividedBy(TEN_TO_THE_EIGHTEENTH_POWER);
  return allowance;
}

export async function cancelOpenOrders(orderIds: string[]) {
  const { contracts } = augurSdk.get();
  return contracts.cancelOrder.cancelOrders(orderIds);
}

export async function cancelOpenOrder(orderId: string) {
  const { contracts } = augurSdk.get();
  return contracts.cancelOrder.cancelOrder(orderId);
}

interface MarketLiquidityOrder extends LiquidityOrder {
  marketId: string;
  minPrice: string;
  maxPrice: string;
  numTicks: string;
  orderType: number;
}

export async function createLiquidityOrder(order: MarketLiquidityOrder) {
  const Augur = augurSdk.get();
  const orderProperties = createOrderParameters(
    order.numTicks,
    order.quantity,
    order.price,
    order.minPrice,
    order.maxPrice
  );
  return Augur.contracts.createOrder.publicCreateOrder(
    createBigNumber(order.orderType),
    orderProperties.attoShares,
    orderProperties.attoPrice,
    order.marketId,
    createBigNumber(order.outcomeId),
    formatBytes32String(''),
    formatBytes32String(''),
    orderProperties.tradeGroupId,
    NULL_ADDRESS
  );
}

export async function createLiquidityOrders(
  market: Getters.Markets.MarketInfo,
  orders: LiquidityOrder[]
) {
  const Augur = augurSdk.get();
  const { id, numTicks, minPrice, maxPrice } = market;
  const marketId = id;
  const kycToken = NULL_ADDRESS;
  const tradeGroupId = generateTradeGroupId();
  const outcomes = [];
  const types = [];
  const attoshareAmounts = [];
  const prices = [];

  orders.map(o => {
    const properties = createOrderParameters(
      numTicks,
      o.quantity,
      o.price,
      minPrice,
      maxPrice
    );
    const orderType = o.type === BUY ? 0 : 1;
    outcomes.push(createBigNumber(o.outcomeId));
    types.push(createBigNumber(orderType));
    attoshareAmounts.push(createBigNumber(properties.attoShares));
    prices.push(createBigNumber(properties.attoPrice));
  });

  return Augur.contracts.createOrder.publicCreateOrders(
    outcomes,
    types,
    attoshareAmounts,
    prices,
    marketId,
    tradeGroupId,
    kycToken
  );
}

function createOrderParameters(numTicks, numShares, price, minPrice, maxPrice) {
  const tickSizeBigNumber = numTicksToTickSizeWithDisplayPrices(
    createBigNumber(numTicks),
    createBigNumber(minPrice),
    createBigNumber(maxPrice)
  );
  return {
    tradeGroupId: generateTradeGroupId(),
    attoShares: convertDisplayAmountToOnChainAmount(
      createBigNumber(numShares),
      tickSizeBigNumber
    ),
    attoPrice: convertDisplayPriceToOnChainPrice(
      createBigNumber(price),
      createBigNumber(minPrice),
      tickSizeBigNumber
    ),
  };
}

export async function placeTrade(
  direction: number,
  marketId: string,
  numOutcomes: number,
  outcomeId: number,
  fingerprint: string = formatBytes32String('11'),
  kycToken: string = NULL_ADDRESS,
  doNotCreateOrders: boolean,
  numTicks: BigNumber | string,
  minPrice: BigNumber | string,
  maxPrice: BigNumber | string,
  displayAmount: BigNumber | string,
  displayPrice: BigNumber | string,
  displayShares: BigNumber | string
): Promise<void> {
  const Augur = augurSdk.get();
  const tradeGroupId = generateTradeGroupId();
  const params: PlaceTradeDisplayParams = {
    direction: direction as 0 | 1,
    market: marketId,
    numTicks: createBigNumber(numTicks),
    numOutcomes: numOutcomes as 3 | 4 | 5 | 6 | 7 | 8,
    outcome: outcomeId as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    tradeGroupId,
    fingerprint,
    kycToken,
    doNotCreateOrders,
    displayMinPrice: createBigNumber(minPrice),
    displayMaxPrice: createBigNumber(maxPrice),
    displayAmount: createBigNumber(displayAmount),
    displayPrice: createBigNumber(displayPrice),
    displayShares: createBigNumber(displayShares),
  };
  return Augur.placeTrade(params);
}

export async function simulateTrade(
  direction: number,
  marketId: string,
  numOutcomes: number,
  outcomeId: number,
  fingerprint: string = formatBytes32String('11'),
  kycToken: string = NULL_ADDRESS,
  doNotCreateOrders: boolean,
  numTicks: BigNumber | string,
  minPrice: BigNumber | string,
  maxPrice: BigNumber | string,
  displayAmount: BigNumber | string,
  displayPrice: BigNumber | string,
  displayShares: BigNumber | string
): Promise<SimulateTradeData> {
  const Augur = augurSdk.get();
  const tradeGroupId = generateTradeGroupId();
  const params: PlaceTradeDisplayParams = {
    direction: direction as 0 | 1,
    market: marketId,
    numTicks: createBigNumber(numTicks),
    numOutcomes: numOutcomes as 3 | 4 | 5 | 6 | 7 | 8,
    outcome: outcomeId as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    tradeGroupId,
    fingerprint,
    kycToken,
    doNotCreateOrders,
    displayMinPrice: createBigNumber(minPrice),
    displayMaxPrice: createBigNumber(maxPrice),
    displayAmount: createBigNumber(displayAmount),
    displayPrice: createBigNumber(displayPrice),
    displayShares: createBigNumber(displayShares),
  };

  return Augur.simulateTrade(params);
}

export async function simulateTradeGasLimit(
  direction: number,
  marketId: string,
  numOutcomes: number,
  outcomeId: number,
  fingerprint: string = formatBytes32String('11'),
  kycToken: string = NULL_ADDRESS,
  doNotCreateOrders: boolean,
  numTicks: BigNumber | string,
  minPrice: BigNumber | string,
  maxPrice: BigNumber | string,
  displayAmount: BigNumber | string,
  displayPrice: BigNumber | string,
  displayShares: BigNumber | string
): Promise<BigNumber> {
  const Augur = augurSdk.get();
  const tradeGroupId = generateTradeGroupId();
  const params: PlaceTradeDisplayParams = {
    direction: direction as 0 | 1,
    market: marketId,
    numTicks: createBigNumber(numTicks),
    numOutcomes: numOutcomes as 3 | 4 | 5 | 6 | 7 | 8,
    outcome: outcomeId as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    tradeGroupId,
    fingerprint,
    kycToken,
    doNotCreateOrders,
    displayMinPrice: createBigNumber(minPrice),
    displayMaxPrice: createBigNumber(maxPrice),
    displayAmount: createBigNumber(displayAmount),
    displayPrice: createBigNumber(displayPrice),
    displayShares: createBigNumber(displayShares),
  };

  return Augur.simulateTradeGasLimit(params);
}

export async function claimMarketsProceedsEstimateGas(
  markets: string[],
  shareHolder: string,
  fingerprint: string = formatBytes32String('11')
) {
  const augur = augurSdk.get();

  if (markets.length > 1) {
    return augur.contracts.augurTrading.claimMarketsProceeds_estimateGas(
      markets,
      shareHolder,
      fingerprint
    );
  } else {
    return augur.contracts.augurTrading.claimTradingProceeds_estimateGas(
      markets[0],
      shareHolder,
      fingerprint
    );
  }
}

export async function claimMarketsProceeds(
  markets: string[],
  shareHolder: string,
  fingerprint: string = formatBytes32String('11'),
) {
  const augur = augurSdk.get();

  if (markets.length > 1) {
    augur.contracts.augurTrading.claimMarketsProceeds(
      markets,
      shareHolder,
      fingerprint
    );
  } else {
    augur.contracts.augurTrading.claimTradingProceeds(
      markets[0],
      shareHolder,
      fingerprint
    );
  }
}

export async function migrateThroughOneForkEstimateGas(
  marketId: string,
  payoutNumerators: BigNumber[] = [],
  description: string = ''
): Promise<BigNumber> {
  const Augur = augurSdk.get();
  const market = Augur.getMarket(marketId);
  return market.migrateThroughOneFork_estimateGas(
    payoutNumerators,
    description
  );
}

export async function migrateThroughOneFork(
  marketId: string,
  payoutNumerators: BigNumber[] = [],
  description: string = ''
) {
  const Augur = augurSdk.get();
  const market = Augur.getMarket(marketId);
  try {
    market.migrateThroughOneFork(payoutNumerators, description);
  } catch (e) {
    console.error('Could not migrate market', e);
  }
}

export async function reportAndMigrateMarket_estimateGas(
  migration: doReportDisputeAddStake
) {
  const Augur = augurSdk.get();
  const market = Augur.getMarket(migration.marketId);
  const payoutNumerators = getPayoutNumerators(migration);
  try {
    market.migrateThroughOneFork_estimateGas(payoutNumerators, migration.description);
  } catch (e) {
    console.error('Could not report and migrate market', e);
  }
}

export async function reportAndMigrateMarket(
  migration: doReportDisputeAddStake
) {
  const Augur = augurSdk.get();
  const market = Augur.getMarket(migration.marketId);
  const payoutNumerators = getPayoutNumerators(migration);
  try {
    market.migrateThroughOneFork(payoutNumerators, migration.description);
  } catch (e) {
    console.error('Could not report and migrate market', e);
  }
}

export async function migrateRepToUniverseEstimateGas(
  migration: doReportDisputeAddStake
): Promise<BigNumber> {
  const { contracts } = augurSdk.get();
  const payoutNumerators = getPayoutNumerators(migration);
  const gas = await contracts.reputationToken.migrateOutByPayout_estimateGas(
    payoutNumerators,
    createBigNumber(migration.attoRepAmount)
  );
  return gas;
}

export async function migrateRepToUniverse(migration: doReportDisputeAddStake) {
  const { contracts } = augurSdk.get();
  const payoutNumerators = getPayoutNumerators(migration);
  try {
    contracts.reputationToken.migrateOutByPayout(
      payoutNumerators,
      createBigNumber(migration.attoRepAmount)
    );
  } catch (e) {
    console.error('Could not migrate REP to universe', e);
  }
}
