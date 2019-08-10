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
  CreateYesNoMarketParams,
  CreateCategoricalMarketParams,
  CreateScalarMarketParams,
  stringTo32ByteHex,
} from '@augurproject/sdk';

import { generateTradeGroupId } from 'utils/generate-trade-group-id';
import { createBigNumber } from 'utils/create-big-number';
import {
  NULL_ADDRESS,
  SCALAR,
  CATEGORICAL,
  TEN_TO_THE_EIGHTEENTH_POWER,
} from 'modules/common/constants';
import { TestNetReputationToken } from '@augurproject/core/build/libraries/GenericContractInterfaces';

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
    console.log("Transaction could not be found", hash);
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
  const noShowBond = await contracts.universe.getOrCacheDesignatedReportNoShowBond_();
  const validityBondFormatted = formatAttoDai(vBond, {
    decimals: 4,
  });
  const noShowFormatted = formatAttoRep(noShowBond, {
    decimals: 4,
  });
  return { validityBondFormatted, noShowFormatted };
}

export interface CreateNewMarketParams {
  outcomes?: string[];
  scalarSmallNum: string;
  scalarBigNum: string;
  scalarDenomination: string;
  expirySource: string;
  description: string;
  designatedReporterAddress: string;
  minPrice: string;
  maxPrice: string;
  endTime: number;
  tickSize: number;
  marketType: string;
  detailsText?: string;
  categories: string[];
  settlementFee: number;
  affiliateFee: number;
  offsetName?: string;
}

export function createMarket(newMarket: CreateNewMarketParams) {
  const fee = new BigNumber(newMarket.settlementFee).div(new BigNumber(100))
  const feePerCashInAttoCash = fee.multipliedBy(TEN_TO_THE_EIGHTEENTH_POWER);
  const affiliateFeeDivisor = new BigNumber(newMarket.affiliateFee);
  const marketEndTime = new BigNumber(newMarket.endTime);
  const extraInfo = JSON.stringify({
    categories: newMarket.categories,
    description: newMarket.description,
    longDescription: newMarket.detailsText,
    resolutionSource: newMarket.expirySource,
    scalarDenomination: newMarket.scalarDenomination,
    offsetName: newMarket.offsetName,
  });

  const baseParams: CreateYesNoMarketParams = {
    endTime: marketEndTime,
    feePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter: newMarket.designatedReporterAddress,
    extraInfo,
  };
  const Augur = augurSdk.get();

  switch (newMarket.marketType) {
    case SCALAR: {
      const prices = [
        new BigNumber(newMarket.minPrice),
        new BigNumber(newMarket.maxPrice),
      ];
      const numTicks = prices[1]
        .minus(prices[0])
        .dividedBy(new BigNumber(newMarket.tickSize));
      const params: CreateScalarMarketParams = Object.assign(baseParams, {
        prices,
        numTicks,
      });
      return Augur.createScalarMarket(params);
    }
    case CATEGORICAL: {
      const params: CreateCategoricalMarketParams = Object.assign(baseParams, {
        outcomes: newMarket.outcomes.map(o => stringTo32ByteHex(o)),
      });
      return Augur.createCategoricalMarket(params);
    }
    default: {
      return Augur.createYesNoMarket(baseParams);
    }
  }
}

export async function approveToTrade(amount: BigNumber) {
  const { contracts } = augurSdk.get();
  const augurContract = contracts.augur.address;
  return contracts.cash.approve(augurContract, amount);
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

export async function placeTrade(
  direction: number,
  marketId: string,
  numOutcomes: number,
  outcomeId: number,
  ignoreShares: boolean,
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
    ignoreShares,
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
  ignoreShares: boolean,
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
    ignoreShares,
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
  ignoreShares: boolean,
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
    ignoreShares,
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
