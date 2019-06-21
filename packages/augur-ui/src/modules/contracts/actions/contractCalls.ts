/**
 * Things we need to figure out
 * 1. gas estimates on contract calls
 * 2. pending tx and how to support existing in-line processing feedbadk to user
 */
// put all calls to contracts here that need conversion from display values to onChain values
import { augurSdk } from 'services/augursdk';
import { BigNumber } from 'bignumber.js';
import { formatAttoRep, formatAttoEth } from 'utils/format-number';
import {
  PlaceTradeDisplayParams,
  SimulateTradeData,
  stringTo32ByteHex,
} from '@augurproject/sdk/build';
import { generateTradeGroupId } from 'utils/generate-trade-group-id';
import { createBigNumber } from 'utils/create-big-number';
import { NULL_ADDRESS, SCALAR, CATEGORICAL, TEN_TO_THE_EIGHTEENTH_POWER } from 'modules/common/constants';
import { NewMarket } from 'modules/types';

export function clearUserTx(): void {
  const Augur = augurSdk.get();
  // TODO: impl this for ethers
  // old comment - clear ethrpc transaction history, registered callbacks, and alerts
}

export function isWeb3Transport(): boolean {
  return augurSdk.isWeb3Transport;
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

export async function getRepBalance(address: string) {
  const { contracts } = augurSdk.get();
  const RepToken = contracts.getReputationToken();
  const balance = await RepToken.balanceOf_(address);
  return formatAttoRep(balance).formattedValue;
}

export async function getEthBalance(address: string): Promise<string> {
  const Augur = augurSdk.get();
  const balance = await Augur.getEthBalance(address);
  const balances = formatAttoEth(balance, { decimals: 4 }).formattedValue;
  console.log('address balance', address, balances);
  return balances as string;
}

export async function getDaiBalance(address: string) {
  const { contracts } = augurSdk.get();
  const balance = await contracts.cash.balanceOf_(address);
  return formatAttoEth(balance).formattedValue;
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
  return contracts.cash.faucet(new BigNumber("1000000000000000000000"));
}

export function createMarket(newMarket: NewMarket) {
  const feePerCashInAttoCash = new BigNumber(newMarket.settlementFee).multipliedBy(TEN_TO_THE_EIGHTEENTH_POWER);
  const affiliateFeeDivisor = new BigNumber(newMarket.affiliateFee);
  const byteTopic = stringTo32ByteHex(newMarket.category);
  const marketEndTime = new BigNumber(newMarket.endTime);
  const extraInfo = JSON.stringify({
    longDescription: newMarket.detailsText,
    resolutionSource: newMarket.expirySource,
    tags: [newMarket.tag1, newMarket.tag2],
    scalarDenomination: newMarket.scalarDenomination
  });
  const { contracts } = augurSdk.get();

  switch (newMarket.marketType) {
    case SCALAR: {
      const prices = [new BigNumber(newMarket.minPrice), new BigNumber(newMarket.maxPrice)];
      const numTicks = prices[1].minus(prices[0]).dividedBy(new BigNumber(newMarket.tickSize));
      return contracts.universe.createScalarMarket(marketEndTime, feePerCashInAttoCash, affiliateFeeDivisor, newMarket.designatedReporterAddress, prices, numTicks, byteTopic, extraInfo);
    }
    case CATEGORICAL: {
      return contracts.universe.createCategoricalMarket(marketEndTime, feePerCashInAttoCash, affiliateFeeDivisor, newMarket.designatedReporterAddress, newMarket.outcomes, byteTopic, extraInfo);
    }
    default: {
      return contracts.universe.createYesNoMarket(marketEndTime, feePerCashInAttoCash, affiliateFeeDivisor, newMarket.designatedReporterAddress, byteTopic, extraInfo);
    }
  }
}

export async function approveToTrade(amount: BigNumber) {
  const { contracts } = augurSdk.get();
  const augurContract = contracts.augur.address;
  return contracts.cash.approve(augurContract, amount);
}

export async function getAllowance(account: string): Promise<BigNumber>  {
  const { contracts } = augurSdk.get();
  const augurContract = contracts.augur.address;
  return contracts.cash.allowance_(account, augurContract);
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
  displayShares: BigNumber | string,
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
  displayShares: BigNumber | string,
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
