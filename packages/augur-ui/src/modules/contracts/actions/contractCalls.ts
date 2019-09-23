/**
 * Things we need to figure out
 * 1. gas estimates on contract calls
 * 2. pending tx and how to support existing in-line processing feedbadk to user
 */
// put all calls to contracts here that need conversion from display values to onChain values
import { augurSdk } from 'services/augursdk';
import { BigNumber } from 'bignumber.js';
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
import { createBigNumber } from 'utils/create-big-number';
import {
  NULL_ADDRESS,
  SCALAR,
  CATEGORICAL,
  TEN_TO_THE_EIGHTEENTH_POWER,
  BUY,
} from 'modules/common/constants';
import { ContractInterfaces } from '@augurproject/core';
import { TestNetReputationToken } from '@augurproject/core/build/libraries/GenericContractInterfaces';
import { CreateMarketData, LiquidityOrder } from 'modules/types';
import { formatBytes32String } from 'ethers/utils';
import { constructMarketParams } from 'modules/create-market/helpers/construct-market-params';

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

export async function getRepBalance(address: string): Promise<number> {
  const { contracts } = augurSdk.get();
  const RepToken = contracts.getReputationToken();
  const balance = await RepToken.balanceOf_(address);
  return formatAttoRep(balance).value;
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

export async function sendEthers(address: string, amount: string) {
  const Augur = augurSdk.get();
  // TODO: have middleware supprt for transferring ETH
  return Promise.resolve();
}

export async function sendRep(address: string, amount: string) {
  const { contracts } = augurSdk.get();
  const RepToken = contracts.getReputationToken();
  const onChainAmount = createBigNumber(amount).multipliedBy(
    TEN_TO_THE_EIGHTEENTH_POWER
  );
  const result = await RepToken.send(address, onChainAmount, '');
  return result;
}

export async function sendDai(address: string, amount: string) {
  const Augur = augurSdk.get();
  // TODO: have middleware supprt for transferring DAI
  return Promise.resolve();
}

export async function getDisputeThresholdForFork() {
  const { contracts } = augurSdk.get();
  const disputeThresholdForFork = await contracts.universe.getDisputeThresholdForFork_();
  return new BigNumber(disputeThresholdForFork);
}

export async function getOpenInterestInAttoCash() {
  const { contracts } = augurSdk.get();
  const openInterestInAttoCash = await contracts.universe.getOpenInterestInAttoCash_();
  return openInterestInAttoCash;
}

export async function getForkingMarket() {
  const { contracts } = augurSdk.get();
  const forkingMarket = await contracts.universe.getForkingMarket_();
  return forkingMarket;
}

export async function getForkEndTime() {
  const { contracts } = augurSdk.get();
  const forkEndTime = await contracts.universe.getForkEndTime_();
  return forkEndTime;
}

export async function getForkReputationGoal() {
  const { contracts } = augurSdk.get();
  const forkReputationGoal = await contracts.universe.getForkReputationGoal_();
  return forkReputationGoal;
}

export async function getWinningChildUniverse() {
  const { contracts } = augurSdk.get();
  const winningChildUniverse = await contracts.universe.getWinningChildUniverse_();
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
  return contracts.cash.faucet(new BigNumber('1000000000000000000000'));
}

export function getRep() {
  const { contracts } = augurSdk.get();
  const rep = contracts.reputationToken as TestNetReputationToken<BigNumber>;
  return rep.faucet(new BigNumber('100000000000000000000'));
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
  const attoAmount = convertDisplayValuetoAttoValue(new BigNumber(amount));
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
  const attoAmount = convertDisplayValuetoAttoValue(new BigNumber(amount));
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

export async function redeemUserStakes(
  reportingParticipantsContracts: string[],
  disputeWindows: string[]
) {
  const { contracts } = augurSdk.get();
  return contracts.redeemStake.redeemStake(
    reportingParticipantsContracts,
    disputeWindows
  );
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
  amount: string;
  isInvalid: boolean;
}

export async function doInitialReport(report: doReportDisputeAddStake) {
  const market = getMarket(report.marketId);
  if (!market) return false;
  const payoutNumerators = getPayoutNumerators(report);
  const amount = convertDisplayValuetoAttoValue(
    new BigNumber(report.amount || '0')
  );
  return await market.doInitialReport(
    payoutNumerators,
    report.description,
    amount
  );
}

export async function addRepToTentativeWinningOutcome(
  addStake: doReportDisputeAddStake
) {
  const market = getMarket(addStake.marketId);
  if (!market) return false;
  const payoutNumerators = getPayoutNumerators(addStake);
  const amount = convertDisplayValuetoAttoValue(new BigNumber(addStake.amount));
  return await market.contributeToTentative(
    payoutNumerators,
    amount,
    addStake.description
  );
}

export async function contribute(dispute: doReportDisputeAddStake) {
  const market = getMarket(dispute.marketId);
  if (!market) return false;
  const payoutNumerators = getPayoutNumerators(dispute);
  const amount = convertDisplayValuetoAttoValue(new BigNumber(dispute.amount));
  return await market.contribute(payoutNumerators, amount, dispute.description);
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
  expirySource: string;
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
  backupSource?: string;
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
    expirySource: extraInfo.resolutionSource,
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
    backupSource: extraInfo.backupSource,
  };

  return createMarket(newMarket, true);
}

export async function approveToTrade() {
  const { contracts } = augurSdk.get();
  const augurContract = contracts.augur.address;
  const allowance = createBigNumber(99999999999999999999).times(
    TEN_TO_THE_EIGHTEENTH_POWER
  );
  return contracts.cash.approve(augurContract, allowance);
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
    new BigNumber(order.orderType),
    orderProperties.attoShares,
    orderProperties.attoPrice,
    order.marketId,
    new BigNumber(order.outcomeId),
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
    outcomes.push(new BigNumber(o.outcomeId));
    types.push(new BigNumber(orderType));
    attoshareAmounts.push(new BigNumber(properties.attoShares));
    prices.push(new BigNumber(properties.attoPrice));
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
    new BigNumber(numTicks),
    new BigNumber(minPrice),
    new BigNumber(maxPrice)
  );
  return {
    tradeGroupId: generateTradeGroupId(),
    attoShares: convertDisplayAmountToOnChainAmount(
      new BigNumber(numShares),
      tickSizeBigNumber
    ),
    attoPrice: convertDisplayPriceToOnChainPrice(
      new BigNumber(price),
      new BigNumber(minPrice),
      tickSizeBigNumber
    ),
  };
}

export async function placeTrade(
  direction: number,
  marketId: string,
  numOutcomes: number,
  outcomeId: number,
  affiliateAddress: string = NULL_ADDRESS,
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
    affiliateAddress,
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
  affiliateAddress: string = NULL_ADDRESS,
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
    affiliateAddress,
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
  affiliateAddress: string = NULL_ADDRESS,
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
    affiliateAddress,
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

export async function claimMarketsProceedsGasEstimation(
  markets: string[],
  shareHolder: string,
  affiliateAddress: string = NULL_ADDRESS
): Promise<BigNumber> {
  const augur = augurSdk.get();
  const gas = await augur.contracts.claimTradingProceeds.claimMarketsProceeds_estimateGas(
    markets,
    shareHolder,
    affiliateAddress
  );
  return gas;
}

export async function claimMarketsProceeds(
  markets: string[],
  shareHolder: string,
  affiliateAddress: string = NULL_ADDRESS
) {
  const augur = augurSdk.get();
  augur.contracts.claimTradingProceeds.claimMarketsProceeds(
    markets,
    shareHolder,
    affiliateAddress
  );
}
