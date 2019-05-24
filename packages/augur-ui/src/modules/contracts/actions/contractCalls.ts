/**
 * Things we need to figure out
 * 1. gas estimates on contract calls
 * 2. pending tx and how to support existing in-line processing feedbadk to user
 */
// put all calls to contracts here that need conversion from display values to onChain values
import { augurSdk } from "services/augursdk";
import { BigNumber } from "bignumber.js";
import { formatAttoRep, formatAttoEth } from "utils/format-number";

export function clearUserTx(): void {
  const Augur = augurSdk.get();
  // TODO: impl this for ethers
  // old comment - clear ethrpc transaction history, registered callbacks, and alerts
}

export function isWeb3Transport(): boolean {
  return augurSdk.isWeb3Transport;
}

export async function getTransaction(): Promise<string> {
  const Augur = augurSdk.get();
  const tx = await Augur.provider.getTransaction();
  return tx;
}

export async function getGasPrice(): Promise<BigNumber> {
  const Augur = augurSdk.get();
  const gasPrice = await Augur.provider.getGasPrice();
  return gasPrice;
}

export async function isUnlocked(address: string): Promise<boolean> {
  const Augur = augurSdk.get();
  const isUnlockedAccount = await Augur.provider.unlock(address);
  return isUnlockedAccount;
}

export function getNetworkId(): number {
  const Augur = augurSdk.get();
  const networkId = Augur.provider.network.chainId;
  return networkId;
}

export async function getAccounts(): Promise<Array<string>> {
  const Augur = augurSdk.get();
  const accounts = await Augur.provider.listAccounts();
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

export async function getTimestamp() {
  const { contracts } = augurSdk.get();
  const timestamp = await contracts.Augur.getTimestamp();
  return timestamp;
}

export async function getRepBalance(address: string) {
  const { contracts } = augurSdk.get();
  const RepToken = contracts.getReputationToken();
  const balance = await RepToken.balanceOf_(address);
  return formatAttoRep(balance).formattedValue;
}

export async function getEthBalance(address: string): Promise<string> {
  const Augur = augurSdk.get();
  const balance = await Augur.provider.getBalance(address);
  const balances =  formatAttoEth(balance).formattedValue;
  console.log("address balance", address, balances);
  return balances;
}

export async function getDaiBalance(address: string) {
  const { contracts } = augurSdk.get();
  const balance = await contracts.cash.balanceOf_(address);
  return formatAttoEth(balance).formattedValue;
}

export async function getDisputeThresholdForFork() {
  const { contracts } = augurSdk.get();
  const disputeThresholdForFork = await contracts.universe.getDisputeThresholdForFork();
  return new BigNumber(disputeThresholdForFork);
}

export async function getOpenInterestInAttoCash() {
  const { contracts } = augurSdk.get();
  const openInterestInAttoCash = await contracts.universe.getOpenInterestInAttoCash();
  return openInterestInAttoCash;
}

export async function getForkingMarket() {
  const { contracts } = augurSdk.get();
  const forkingMarket = await contracts.universe.getForkingMarket();
  return forkingMarket;
}

export async function getForkEndTime() {
  const { contracts } = augurSdk.get();
  const forkEndTime = await contracts.universe.getForkEndTime();
  return forkEndTime;
}

export async function getForkReputationGoal() {
  const { contracts } = augurSdk.get();
  const forkReputationGoal = await contracts.universe.getForkReputationGoal();
  return forkReputationGoal;
}

export async function getWinningChildUniverse() {
  const { contracts } = augurSdk.get();
  const winningChildUniverse = await contracts.universe.getWinningChildUniverse();
  return winningChildUniverse;
}

export async function getOrCacheDesignatedReportStake() {
  const { contracts } = augurSdk.get();
  const initialReporterStake = await contracts.universe.getOrCacheDesignatedReportStake();
  return initialReporterStake;
}

export async function isFinalized(marketId: string) {
  const { contracts } = augurSdk.get();
  const market = contracts.getMarket(marketId);
  if (!market) return false; // TODO: prob should throw error if market not found
  const status = await market.isFinalized();
  return status;
}

export function getDai() {
  const { contracts } = augurSdk.get();
  return contracts.cash.faucet("1000000000000000000000");
}
