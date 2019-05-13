/**
 * Things we need to figure out
 * 1. gas estimates on contract calls
 * 2. pending tx and how to support existing in-line processing feedbadk to user
 */
// put all calls to contracts here that need conversion from display values to onChain values
import { augurSdk } from "services/augursdk";
import { ethers } from "ethers";
import { BigNumber } from "ethers/utils";

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
  return ethers.utils.formatEther(balance);
}

export async function getEthBalance(address: string) {
  const Augur = augurSdk.get();
  const balance = await Augur.provider.getBalance(address);
  return ethers.utils.formatEther(balance);
}

export async function getDaiBalance(address: string) {
  const { contracts } = augurSdk.get();
  const balance = await contracts.cash.balanceOf_(address);
  return ethers.utils.formatEther(balance);
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
