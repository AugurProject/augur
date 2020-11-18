/**
 * Things we need to figure out
 * 1. gas estimates on contract calls
 * 2. pending tx and how to support existing in-line processing feedbadk to user
 */
import { TestNetReputationToken } from '@augurproject/core/build/libraries/GenericContractInterfaces';
import type {
  CreateCategoricalMarketParams,
  CreateScalarMarketParams,
  Getters,
  PlaceTradeDisplayParams,
  SimulateTradeData,
} from '@augurproject/sdk';
import {
  calculatePayoutNumeratorsArray,
  ExtraInfoTemplate,
  AccountData
} from '@augurproject/sdk-lite';
import {
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
  convertDisplayValuetoAttoValue,
  numTicksToTickSizeWithDisplayPrices,
} from '@augurproject/utils';
import { TransactionResponse } from 'ethers/providers';
import { formatBytes32String } from 'ethers/utils';
import {
  BUY,
  CATEGORICAL,
  ETHER,
  FAKE_HASH,
  NULL_ADDRESS,
  ONE,
  SCALAR,
  TEN_TO_THE_EIGHTEENTH_POWER,
  ZERO,
  NETWORK_IDS,
  ACCOUNT_ACTIVATION_GAS_COST,
  DISPUTE_GAS_COST,
} from 'modules/common/constants';
import { constructMarketParams } from 'modules/create-market/helpers/construct-market-params';
import {
  CreateMarketData,
  FormattedNumber,
  LiquidityOrder,
} from 'modules/types';
// put all calls to contracts here that need conversion from display values to onChain values
import { augurSdk } from 'services/augursdk';
import { augurSdkLite } from 'services/augursdklite';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import {
  formatAttoDai,
  formatAttoRep,
  formatPercent,
} from 'utils/format-number';
import { generateTradeGroupId } from 'utils/generate-trade-group-id';
import { getFingerprint } from 'utils/get-fingerprint';

export function isWeb3Transport(): boolean {
  return augurSdk.isWeb3Transport;
}

export async function isTransactionConfirmed(hash: string): Promise<boolean> {
  const confirmations = await transactionConfirmations(hash);
  if (confirmations === null || confirmations === undefined) {
    console.log('Transaction could not be found', hash);
    return false;
  }
  // confirmations is number of blocks beyond block that includes tx
  return confirmations > 0;
}

export async function transactionConfirmations(hash: string): Promise<number> {
  const tx = await getTransaction(hash);
  return tx?.confirmations;
}

export async function getTransaction(hash: string): Promise<TransactionResponse> {
  const Augur = augurSdk.get();
  const tx = await Augur.getTransaction(hash);
  return tx;
}

export async function getGasPrice(): Promise<BigNumber> {
  const Augur = augurSdk.get();
  const gasPrice = await Augur.getGasPrice();
  return gasPrice;
}

export function getNetworkId(): string {
  // default to mainnet most likely that's the case
  let networkId = NETWORK_IDS.Mainnet;
  try {
    const augur = augurSdkLite.get();
    networkId = augur.networkId;
  } catch (e) {
    console.error(e);
  }
  return networkId;
}

let maxEndTime = null; // cache value
export async function getMaxMarketEndTime(): Promise<number> {
  const { contracts } = augurSdk.get();
  if (!maxEndTime) {
    maxEndTime = await contracts.augur.getMaximumMarketEndDate_();
  }
  return new BigNumber(maxEndTime).toNumber();
}

export async function isRepV2Approved(account): Promise<boolean> {
  const { contracts } = augurSdk.get();
  try {
    const currentAllowance = await contracts.legacyReputationToken.allowance_(
      account,
      contracts.reputationToken.address
    );
    if (currentAllowance.lte(0)) {
      return false;
    }
    return true;
  } catch (error) {
    throw error;
  }
}

export async function convertV1ToV2Approve() {
  const { contracts } = augurSdk.get();

  const allowance = createBigNumber(99999999999999999999).times(
    TEN_TO_THE_EIGHTEENTH_POWER
  );
  let response = null;
  try {
    const getReputationToken = await contracts.universe.getReputationToken_();
    response = await contracts.legacyReputationToken.approve(getReputationToken, allowance);
  } catch (e) {
    console.error(e);
  }
  return response;
}

export async function convertV1ToV2() {
  const { contracts } = augurSdk.get();
  let response = false;
  try {
    response = await contracts.reputationToken.migrateFromLegacyReputationToken();
  } catch (e) {
    console.error(e);
  }
  return response;
}

export async function convertV1ToV2_estimate() {
  const { contracts } = augurSdk.get();
  const allowance = createBigNumber(99999999999999999999).times(
    TEN_TO_THE_EIGHTEENTH_POWER
  );

  let approvalGas = ZERO;
  let migrationGas = ZERO;

  try {
    const getReputationToken = await contracts.universe.getReputationToken_();
    approvalGas = await contracts.legacyReputationToken.approve_estimateGas(
      getReputationToken,
      allowance
    );

    migrationGas = await contracts.reputationToken.migrateFromLegacyReputationToken_estimateGas();
  } catch (e) {
    console.error(e);
  }

  return approvalGas.plus(migrationGas);
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
  if (!address) return ZERO;
  const { contracts } = augurSdk.get();
  const lagacyRep = contracts.legacyReputationToken.address;
  const networkId = getNetworkId();
  const balance = !!address ? await contracts
    .reputationTokenFromAddress(lagacyRep, networkId)
    .balanceOf_(address) : createBigNumber(0);
  return balance;
}


export async function getEthBalance(address: string): Promise<string> {
  if (!address) return "0";
  const Augur = augurSdk.get();
  const balance = await Augur.getEthBalance(address);
  return String(createBigNumber(String(balance)).dividedBy(ETHER));
}

export async function getDaiBalance(address: string): Promise<number> {
  if (!address) return 0;
  const { contracts } = augurSdk.get();
  const balance = await contracts.cash.balanceOf_(address);
  return createBigNumber(String(balance)).dividedBy(ETHER);
}

export async function sendDai_estimateGas(address: string, amount: string): Promise<BigNumber> {
  const { contracts } = augurSdk.get();
  const Cash = contracts.cash;
  const onChainAmount = createBigNumber(amount).multipliedBy(
    TEN_TO_THE_EIGHTEENTH_POWER
  ).decimalPlaces(0);
  return Cash.transfer_estimateGas(address, onChainAmount);
}

export async function sendDai(address: string, amount: string) {
  const { contracts } = augurSdk.get();
  const Cash = contracts.cash;
  const onChainAmount = createBigNumber(amount).multipliedBy(
    TEN_TO_THE_EIGHTEENTH_POWER
  ).decimalPlaces(0);
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
  return contracts.cash.faucet(new BigNumber('1000000000000000000000'));
}

export async function getRepRate(): Promise<BigNumber> {
  const { uniswap, contracts } = augurSdk.get();
  const rate = await uniswap.getExchangeRate(contracts.reputationToken.address, contracts.cash.address);
  return rate;
}

export async function getUsdtRate(): Promise<BigNumber> {
  const { uniswap, contracts } = augurSdk.get();
  const rate = await uniswap.getExchangeRate(contracts.usdt.address, contracts.cash.address);
  return rate;
}

export async function getUsdcRate(): Promise<BigNumber> {
  const { uniswap, contracts } = augurSdk.get();
  const rate = await uniswap.getExchangeRate(contracts.usdc.address, contracts.cash.address);
  return rate;
}

export async function getEthForDaiRate(): BigNumber {
  const augur = augurSdk.get();
  const ethToDaiRate = await augur.getExchangeRate();
  return ethToDaiRate;
}

export async function addLiquidityRepDai(
  dai: BigNumber,
  rep: BigNumber
): Promise<void> {
  const { contracts, uniswap } = augurSdk.get();
  const cashAmount = dai.multipliedBy(ETHER);
  const repAmount = rep.multipliedBy(ETHER);

  uniswap.addLiquidity(
    contracts.reputationToken.address,
    contracts.cash.address,
    repAmount,
    cashAmount,
    new BigNumber(0),
    new BigNumber(0)
  );
}

export async function checkTokenApproval(account, contract): Promise<boolean> {
  const { contracts } = augurSdk.get();
  try {
    const currentAllowance = await contract.allowance_(
      account,
      contracts.uniswap.address
    );

    if (currentAllowance.lte(0)) {
      return false
    }
    return true;
  } catch (error) {
    throw error;
  }
}

export async function setTokenApproval(account, contract): Promise<void> {
  const { contracts } = augurSdk.get();
  try {
    const currentAllowance = await contract.allowance_(
      account,
      contracts.uniswap.address
    );
    if (currentAllowance.lte(0)) {
      await contract.approve(contracts.uniswap.address, APPROVAL_AMOUNT);
    }
  } catch (error) {
    throw error;
  }
}

export async function checkSetApprovalAmount(account, contract): Promise<void> {
  const { contracts } = augurSdk.get();
  try {
    const APPROVAL_AMOUNT = new BigNumber(2 ** 255);
    const currentAllowance = await contract.allowance_(
      account,
      contracts.uniswap.address
    );
    if (currentAllowance.lte(0)) {
      await contract.approve(contracts.uniswap.address, APPROVAL_AMOUNT);
    }
  } catch (error) {
    throw error;
  }
}

export async function uniswapTokenForDai(
  tokenAddress: string,
  tokenAmount: BigNumber,
  dai: BigNumber,
  tradeSpread: number
): Promise<void> {
  const { contracts, uniswap } = augurSdk.get();

  let exactTokenAmount;
  let minDai;

  if (
    [contracts.reputationToken.address, contracts.cash.address].includes(
      tokenAddress
    )
  ) {
    exactTokenAmount = tokenAmount.multipliedBy(10 ** 18);
    minDai = createBigNumber(
      dai
        .minus(dai.multipliedBy(createBigNumber(tradeSpread).minus(1)))
        .multipliedBy(10 ** 18)
        .toNumber()
    );
  } else if (
    [contracts.usdc.address, contracts.usdt.address].includes(tokenAddress)
  ) {
    exactTokenAmount = tokenAmount.multipliedBy(10 ** 6);
    minDai = createBigNumber(
      Math.floor(
        dai
          .minus(dai.multipliedBy(createBigNumber(tradeSpread).minus(1)))
          .multipliedBy(10 ** 6)
          .toNumber()
      )
    );
  } else {
    throw new Error("provided tokenAddress not supported");
  }

  try {
    await uniswap.swapExactTokensForTokens(
      tokenAddress,
      contracts.cash.address,
      exactTokenAmount,
      minDai
    );
  } catch (error) {
    console.error("uniswapTokenForDai", error);
    throw error;
  }
}

export async function uniswapTokenForRep(
  tokenAddress: string,
  tokenAmount: BigNumber,
  rep: BigNumber,
  tradeSpread: number
): Promise<void> {
  const { contracts, uniswap } = augurSdk.get();

  const exactTokenAmount = tokenAmount.multipliedBy(10 ** 18);
  const minRep = createBigNumber(
    rep
      .minus(rep.multipliedBy(createBigNumber(tradeSpread).minus(1)))
      .multipliedBy(10 ** 18)
      .toNumber()
  );

  try {
    await uniswap.swapExactTokensForTokens(
      tokenAddress,
      contracts.reputationToken.address,
      exactTokenAmount,
      createBigNumber(minRep.toNumber())
    );
  } catch (error) {
    console.error("uniswapTokenForRep", error);
    throw error;
  }
}

export async function uniswapTokenForETH(
  tokenAddress: string,
  tokenAmount: BigNumber,
  eth: BigNumber,
  tradeSpread: number
): Promise<void> {
  const { contracts, uniswap } = augurSdk.get();
  const exactTokenAmount = tokenAmount.multipliedBy(10 ** 18);
  const minETH = eth
    .minus(eth.multipliedBy(createBigNumber(tradeSpread).minus(1)))
    .multipliedBy(10 ** 18);

  try {
    await uniswap.swapTokensForExactETH(
      tokenAddress,
      exactTokenAmount,
      createBigNumber(minETH.toNumber())
    );
  } catch (error) {
    console.error("uniswapDaiForETH", error);
    throw error;
  }
}

export async function uniswapEthForRep(
  eth: BigNumber,
  rep: BigNumber,
  exchangeRateBufferMultiplier: number
): Promise<void> {
  const { contracts, uniswap } = augurSdk.get();
  const exactRep = rep.multipliedBy(10 ** 18);
  const maxEth = eth
    .multipliedBy(10 ** 18)
    .multipliedBy(exchangeRateBufferMultiplier);

  try {
    await uniswap.swapETHForExactTokens(
      contracts.reputationToken.address,
      exactRep,
      maxEth
    );
  } catch (error) {
    console.error("uniswapEthForRep", error);
    throw error;
  }
}

export async function uniswapEthForDai(
  eth: BigNumber,
  dai: BigNumber,
  exchangeRateBufferMultiplier: number
): Promise<void> {
  const { contracts, uniswap } = augurSdk.get();
  const exactDai = dai.multipliedBy(10 ** 18);
  const maxEth = eth
    .multipliedBy(10 ** 18)
    .multipliedBy(exchangeRateBufferMultiplier);

  try {
    await uniswap.swapETHForExactTokens(
      contracts.cash.address,
      exactDai,
      maxEth
    );
  } catch (error) {
    console.error("uniswapEthForDai", error);
    throw error;
  }
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
  const validityBondFormatted = formatAttoDai(vBond, { decimals: 2, decimalsRounded: 2});
  const noShowFormatted = formatAttoRep(noShowBond, {
    decimals: 4,
  });
  return { validityBondFormatted, noShowFormatted };
}

export async function getReportingFeePercentage(): Promise<FormattedNumber> {
  const { contracts } = augurSdk.get();
  const reportingFee = await contracts.universe.getReportingFeeDivisor_();
  const reportingFeePercent = (ONE.dividedBy(reportingFee)).times(100);
  return formatPercent(reportingFeePercent);
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
    console.error('Could not redeem REPv2', e);
  }
}

export async function disavowMarket(marketId: string) {
  const { contracts } = augurSdk.get();
  return contracts.marketFromAddress(marketId).disavowCrowdsourcers();
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
  isWarpSync?: boolean;
  warpSyncHash?: string;
}

export async function doInitialReport_estimaetGas(report: doReportDisputeAddStake) {
  if(report.isWarpSync) return doInitialReportWarpSync_estimaetGas(report);
  const market = getMarket(report.marketId);
  if (!market) return false;
  const payoutNumerators = await getPayoutNumerators(report);
  return market.doInitialReport_estimateGas(
    payoutNumerators,
    report.description,
    createBigNumber(report.attoRepAmount || '0')
  );
}

export async function doInitialReport(report: doReportDisputeAddStake) {
  if(report.isWarpSync) return doInitialReportWarpSync(report);
  const market = getMarket(report.marketId);
  if (!market) return false;
  const payoutNumerators = await getPayoutNumerators(report);
  return market.doInitialReport(
    payoutNumerators,
    report.description,
    createBigNumber(report.attoRepAmount || '0')
  );
}

export async function doInitialReportWarpSync_estimaetGas(report: doReportDisputeAddStake) {
  const Augur = augurSdk.get();
  const universe = Augur.contracts.universe.address;
  const payoutNumerators = await getPayoutNumerators(report);
  return Augur.contracts.warpSync.doInitialReport_estimateGas(
    universe,
    payoutNumerators,
    report.description
  );
}

export async function doInitialReportWarpSync(report: doReportDisputeAddStake) {
  const Augur = augurSdk.get();
  const universe = Augur.contracts.universe.address;
  const payoutNumerators = await getPayoutNumerators(report);
  return Augur.contracts.warpSync.doInitialReport(
    universe,
    payoutNumerators,
    report.description
  );
}

// cash the value doesn't change fast
let attoRep = null;
export async function getWarpSyncRepReward(
  warpMarketAddress: string
): Promise<string> {
  if (!attoRep) {
    const Augur = augurSdk.get();
    attoRep = await Augur.contracts.warpSync.getFinalizationReward_(
      warpMarketAddress
    ).catch(e => {
      console.error(e);
      return formatAttoRep(0).formatted;
    });
    return formatAttoRep(attoRep || 0).formatted;
  } else {
    return formatAttoRep(attoRep || 0).formatted;
  }
}

export async function addRepToTentativeWinningOutcome_estimateGas(
  addStake: doReportDisputeAddStake
) {
  const market = getMarket(addStake.marketId);
  if (!market) return false;
  const payoutNumerators = await getPayoutNumerators(addStake);
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
  const payoutNumerators = await getPayoutNumerators(addStake);
  return market.contributeToTentative(
    payoutNumerators,
    createBigNumber(addStake.attoRepAmount),
    addStake.description
  );
}

export async function contribute_estimateGas(dispute: doReportDisputeAddStake) {
  const market = getMarket(dispute.marketId);
  if (!market) return false;
  const payoutNumerators = await getPayoutNumerators(dispute);
  try {
    return await market.contribute_estimateGas(
      payoutNumerators,
      createBigNumber(dispute.attoRepAmount),
      dispute.description
    );
  } catch (e) {
    console.error('estimate gas for dispute failed using default');
    return DISPUTE_GAS_COST;
  }
}

export async function contribute(dispute: doReportDisputeAddStake) {
  const market = getMarket(dispute.marketId);
  if (!market) return false;
  const payoutNumerators = await getPayoutNumerators(dispute);
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

async function getPayoutNumerators(inputs: doReportDisputeAddStake) {
  const augur = augurSdk.get();
  return inputs.isWarpSync
    ? await augur.getPayoutFromWarpSyncHash(inputs.warpSyncHash || FAKE_HASH)
    : calculatePayoutNumeratorsArray(
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
    template: extraInfo.template,
  };

  return createMarket(newMarket, true);
}
const APPROVAL_AMOUNT = new BigNumber(2**255).minus(1);
const APPROVAL_TEST_AMOUNT = new BigNumber(0);
export async function isContractApproval(account, contract, approvalContract): Promise<boolean> {
  try {
    const currentAllowance = await approvalContract.allowance_(account, contract);
    return currentAllowance.gt(APPROVAL_TEST_AMOUNT);
  }
  catch(error) {
    throw error;
  }
}

export async function approvalsNeededMarketCreation(address) {
  const { contracts } = augurSdk.get();
  const isApproved = await isContractApproval(address, contracts.augur.address, contracts.cash);
  return Number(!isApproved); // true is 1, so negating. false is 0 so negating.
}

export async function approveMarketCreation(): Promise<void> {
  const { contracts } = augurSdk.get();
  const augurContract = contracts.augur.address;
  return await contracts.cash.approve(augurContract, APPROVAL_AMOUNT);
}

export async function approvalsNeededToTrade(address): Promise<number> {
  const { contracts } = augurSdk.get();
  const cashContractApproval = await isContractApproval(address, contracts.ZeroXTrade.address, contracts.cash);
  const fillContractApproval = await isContractApproval(address, contracts.fillOrder.address, contracts.cash);
  const fillShareAllContractApproval = await contracts.shareToken.isApprovedForAll_(address, contracts.fillOrder.address);
  console.log(fillContractApproval, cashContractApproval, fillShareAllContractApproval);
  const approvals = [fillContractApproval, cashContractApproval, fillShareAllContractApproval].filter(a => !a);
  return (approvals.length > 0 ? approvals.length + 1 : 0); // add additional 1 for referral address
}

export async function approveZeroX(address, ) {
  const { contracts } = augurSdk.get();
  try {
    if (!(await isContractApproval(address, contracts.ZeroXTrade.address, contracts.cash))) {
      return await contracts.cash.approve(contracts.ZeroXTrade.address, APPROVAL_AMOUNT);
    }
  } catch(error) {
    console.error('approveZeroX', error);
    return false;
  }
}

export async function approveShareToken(address, ) {
  const { contracts } = augurSdk.get();
  try {
    if (!(await contracts.shareToken.isApprovedForAll_(address, contracts.fillOrder.address))) {
      return await contracts.shareToken.setApprovalForAll(contracts.fillOrder.address, true);
    }
  } catch(error) {
    console.error('approveShareToken', error);
    return false;
  }
}

export async function approveFillOrder(address, ) {
  const { contracts } = augurSdk.get();
  try {
    if (!(await isContractApproval(address, contracts.fillOrder.address, contracts.cash))) {
      return await contracts.cash.approve(contracts.fillOrder.address, APPROVAL_AMOUNT);
    }
  } catch(error) {
    console.error('approveFillOrder', error);
    return false;
  }
}

export async function approveZeroXCheck(address) {
  const { contracts } = augurSdk.get();
  return await isContractApproval(address, contracts.ZeroXTrade.address, contracts.cash);
}

export async function approveShareTokenCheck(address) {
  const { contracts } = augurSdk.get();
  return await contracts.shareToken.isApprovedForAll_(address, contracts.fillOrder.address);
}

export async function approveFillOrderCheck(address) {
  const { contracts } = augurSdk.get();
  return await isContractApproval(address, contracts.fillOrder.address, contracts.cash);
}

export async function approveToTrade(address, referalAddress = NULL_ADDRESS) {
  const { contracts } = augurSdk.get();
  const approvals = [];
  if (!(await isContractApproval(address, contracts.ZeroXTrade.address, contracts.cash))) {
    approvals.push(contracts.cash.approve(contracts.ZeroXTrade.address, APPROVAL_AMOUNT));
  }
  approvals.push(contracts.affiliates.setReferrer(referalAddress));
  if (!(await contracts.shareToken.isApprovedForAll_(address, contracts.fillOrder.address))) {
    approvals.push(contracts.shareToken.setApprovalForAll(contracts.fillOrder.address, true));
  }
  if (!(await isContractApproval(address, contracts.fillOrder.address, contracts.cash))) {
    approvals.push(contracts.cash.approve(contracts.fillOrder.address, APPROVAL_AMOUNT));
  }
  return Promise.all(approvals);
}

export async function getReportingDivisor(): Promise<BigNumber> {
  const { contracts } = augurSdk.get();
  return await contracts.universe.getReportingFeeDivisor_();
}

export async function cancelZeroXOpenOrder(orderId: string) {
  const Augur = augurSdk.get();
  return Augur.cancelOrder(orderId);
}

export async function cancelZeroXOpenBatchOrders(orderIds: string[]) {
  const Augur = augurSdk.get();
  return Augur.batchCancelOrders(orderIds);
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
  );
}

export async function createLiquidityOrders(
  market: Getters.Markets.MarketInfo,
  orders: LiquidityOrder[]
) {
  const Augur = augurSdk.get();
  const { id, numTicks, minPrice, maxPrice } = market;
  const marketId = id;
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
  doNotCreateOrders: boolean,
  numTicks: BigNumber | string,
  minPrice: BigNumber | string,
  maxPrice: BigNumber | string,
  displayAmount: BigNumber | string,
  displayPrice: BigNumber | string,
  displayShares: BigNumber | string,
  expirationTime?: BigNumber,
  tradeGroupId?: string,
  postOnly?: boolean,
  fingerprint: string = getFingerprint(),
): Promise<boolean> {
  const Augur = augurSdk.get();
  const params: PlaceTradeDisplayParams = {
    direction: direction as 0 | 1,
    market: marketId,
    numTicks: createBigNumber(numTicks),
    numOutcomes: numOutcomes as 3 | 4 | 5 | 6 | 7 | 8,
    outcome: outcomeId as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    tradeGroupId: tradeGroupId ? tradeGroupId : generateTradeGroupId(),
    fingerprint,
    doNotCreateOrders,
    displayMinPrice: createBigNumber(minPrice),
    displayMaxPrice: createBigNumber(maxPrice),
    displayAmount: createBigNumber(displayAmount),
    displayPrice: createBigNumber(displayPrice),
    displayShares: createBigNumber(displayShares),
    expirationTime,
    postOnly,
  };
  return Augur.placeTrade(params);
}

export async function simulateTrade(
  direction: number,
  marketId: string,
  numOutcomes: number,
  outcomeId: number,
  fingerprint: string = getFingerprint(),
  doNotCreateOrders: boolean,
  numTicks: BigNumber | string,
  minPrice: BigNumber | string,
  maxPrice: BigNumber | string,
  displayAmount: BigNumber | string,
  displayPrice: BigNumber | string,
  displayShares: BigNumber | string,
  address: string,
  postOnly?: boolean,
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
    doNotCreateOrders,
    displayMinPrice: createBigNumber(minPrice),
    displayMaxPrice: createBigNumber(maxPrice),
    displayAmount: createBigNumber(displayAmount),
    displayPrice: createBigNumber(displayPrice),
    displayShares: createBigNumber(displayShares),
    takerAddress: address,
    postOnly,
  };

  return Augur.simulateTrade(params);
}

export async function simulateTradeGasLimit(
  direction: number,
  marketId: string,
  numOutcomes: number,
  outcomeId: number,
  fingerprint: string = getFingerprint(),
  doNotCreateOrders: boolean,
  numTicks: BigNumber | string,
  minPrice: BigNumber | string,
  maxPrice: BigNumber | string,
  displayAmount: BigNumber | string,
  displayPrice: BigNumber | string,
  displayShares: BigNumber | string,
  address: string,
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
    doNotCreateOrders,
    displayMinPrice: createBigNumber(minPrice),
    displayMaxPrice: createBigNumber(maxPrice),
    displayAmount: createBigNumber(displayAmount),
    displayPrice: createBigNumber(displayPrice),
    displayShares: createBigNumber(displayShares),
    takerAddress: address,
  };

  return Augur.simulateTradeGasLimit(params);
}

export async function claimMarketsProceedsEstimateGas(
  markets: string[],
  shareHolder: string,
  fingerprint: string = getFingerprint(),
) {
  const augur = augurSdk.get();
  return augur.contracts.augurTrading.claimMarketsProceeds_estimateGas(
    markets,
    shareHolder,
    fingerprint
  );
}

export async function claimMarketsProceeds(
  markets: string[],
  shareHolder: string,
  fingerprint: string = formatBytes32String('11'),
) {
  const augur = augurSdk.get();
  augur.contracts.augurTrading.claimMarketsProceeds(
    markets,
    shareHolder,
    fingerprint
  );
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
  try {
    const Augur = augurSdk.get();
    const market = Augur.getMarket(marketId);
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
  const payoutNumerators = await getPayoutNumerators(migration);
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
  const payoutNumerators = await getPayoutNumerators(migration);
  return market.migrateThroughOneFork(payoutNumerators, migration.description);
}

export async function migrateRepToUniverseEstimateGas(
  migration: doReportDisputeAddStake
): Promise<BigNumber> {
  const { contracts } = augurSdk.get();
  const payoutNumerators = await getPayoutNumerators(migration);
  const gas = await contracts.reputationToken.migrateOutByPayout_estimateGas(
    payoutNumerators,
    createBigNumber(migration.attoRepAmount)
  );
  return gas;
}

export async function migrateRepToUniverse(migration: doReportDisputeAddStake) {
  const { contracts } = augurSdk.get();
  const payoutNumerators = await getPayoutNumerators(migration);

  try {
    contracts.reputationToken.migrateOutByPayout(
      payoutNumerators,
      createBigNumber(migration.attoRepAmount)
    );
  } catch (e) {
    console.error('Could not migrate REPv2 to universe', e);
  }
}

export async function runPeriodicals_estimateGas() {
  try {
    const { contracts } = augurSdk.get();
    const gas = await contracts.universe.runPeriodicals_estimateGas();
    return gas;
  } catch (e) {
    return ACCOUNT_ACTIVATION_GAS_COST;
  }
}

export async function loadAccountData_exchangeRates(account: string) {
  const { contracts } = augurSdk.get();
  const sdk = await augurSdkLite.get();
  const repToken = contracts.getReputationToken();
  const usdc = contracts.usdc.address;
  const usdt = contracts.usdt.address;
  const values: AccountData = await sdk.loadAccountData(account, repToken.address, usdc, usdt);
  return values;
}
