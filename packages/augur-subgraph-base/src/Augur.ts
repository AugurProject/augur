import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import {
  CompleteSetsPurchased as CompleteSetsPurchasedEvent,
  CompleteSetsSold as CompleteSetsSoldEvent,
  DesignatedReportStakeChanged as DesignatedReportStakeChangedEvent,
  DisputeCrowdsourcerCompleted as DisputeCrowdsourcerCompletedEvent,
  DisputeCrowdsourcerContribution as DisputeCrowdsourcerContributionEvent,
  DisputeCrowdsourcerCreated as DisputeCrowdsourcerCreatedEvent,
  DisputeCrowdsourcerRedeemed as DisputeCrowdsourcerRedeemedEvent,
  DisputeWindowCreated as DisputeWindowCreatedEvent,
  FinishDeployment as FinishDeploymentEvent,
  InitialReportSubmitted as InitialReportSubmittedEvent,
  InitialReporterRedeemed as InitialReporterRedeemedEvent,
  InitialReporterTransferred as InitialReporterTransferredEvent,
  MarketCreated as MarketCreatedEvent,
  MarketFinalized as MarketFinalizedEvent,
  MarketMigrated as MarketMigratedEvent,
  MarketOIChanged as MarketOIChangedEvent,
  MarketParticipantsDisavowed as MarketParticipantsDisavowedEvent,
  MarketRepBondTransferred as MarketRepBondTransferredEvent,
  MarketTransferred as MarketTransferredEvent,
  NoShowBondChanged as NoShowBondChangedEvent,
  ParticipationTokensRedeemed as ParticipationTokensRedeemedEvent,
  RegisterContract as RegisterContractEvent,
  ReportingFeeChanged as ReportingFeeChangedEvent,
  ReportingParticipantDisavowed as ReportingParticipantDisavowedEvent,
  ShareTokenBalanceChanged as ShareTokenBalanceChangedEvent,
  TimestampSet as TimestampSetEvent,
  TokenBalanceChanged as TokenBalanceChangedEvent,
  TokensBurned as TokensBurnedEvent,
  TokensMinted as TokensMintedEvent,
  TokensTransferred as TokensTransferredEvent,
  TradingProceedsClaimed as TradingProceedsClaimedEvent,
  UniverseCreated as UniverseCreatedEvent,
  UniverseForked as UniverseForkedEvent,
  ValidityBondChanged as ValidityBondChangedEvent,
  WarpSyncDataUpdated as WarpSyncDataUpdatedEvent,
} from '../generated/Augur/Augur';

import {
  CompleteSetsPurchased as CompleteSetsPurchasedEntity,
  CompleteSetsSold as CompleteSetsSoldEntity,
  DesignatedReportStakeChanged as DesignatedReportStakeChangedEntity,
  DisputeCrowdsourcerCompleted as DisputeCrowdsourcerCompletedEntity,
  DisputeCrowdsourcerContribution as DisputeCrowdsourcerContributionEntity,
  DisputeCrowdsourcerCreated as DisputeCrowdsourcerCreatedEntity,
  DisputeCrowdsourcerRedeemed as DisputeCrowdsourcerRedeemedEntity,
  DisputeWindowCreated as DisputeWindowCreatedEntity,
  FinishDeployment as FinishDeploymentEntity,
  InitialReportSubmitted as InitialReportSubmittedEntity,
  InitialReporterRedeemed as InitialReporterRedeemedEntity,
  InitialReporterTransferred as InitialReporterTransferredEntity,
  MarketCreated as MarketCreatedEntity,
  MarketFinalized as MarketFinalizedEntity,
  MarketMigrated as MarketMigratedEntity,
  MarketOIChanged as MarketOIChangedEntity,
  MarketParticipantsDisavowed as MarketParticipantsDisavowedEntity,
  MarketRepBondTransferred as MarketRepBondTransferredEntity,
  MarketTransferred as MarketTransferredEntity,
  NoShowBondChanged as NoShowBondChangedEntity,
  ParticipationTokensRedeemed as ParticipationTokensRedeemedEntity,
  RegisterContract as RegisterContractEntity,
  ReportingFeeChanged as ReportingFeeChangedEntity,
  ReportingParticipantDisavowed as ReportingParticipantDisavowedEntity,
  ShareTokenBalanceChanged as ShareTokenBalanceChangedEntity,
  TimestampSet as TimestampSetEntity,
  TokenBalanceChanged as TokenBalanceChangedEntity,
  TokensBurned as TokensBurnedEntity,
  TokensMinted as TokensMintedEntity,
  TokensTransferred as TokensTransferredEntity,
  TradingProceedsClaimed as TradingProceedsClaimedEntity,
  UniverseCreated as UniverseCreatedEntity,
  UniverseForked as UniverseForkedEntity,
  ValidityBondChanged as ValidityBondChangedEntity,
  WarpSyncDataUpdated as WarpSyncDataUpdatedEntity,
} from '../generated/schema';


function mapAddressArray(arr:Address[]):string[] {
  let result = new Array<string>();
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i].toHexString());
  }

  return result;
}

function mapByteArray(arr:Bytes[]):string[] {
  let result = new Array<string>();
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i].toHexString());
  }

  return result;
}

function mapArray(arr: BigInt[]):string[] {
  let result = new Array<string>();
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i].toHexString());
  }

  return result;
}


export function handleCompleteSetsPurchased(event: CompleteSetsPurchasedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new CompleteSetsPurchasedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "CompleteSetsPurchased";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.market = event.params.market.toHexString();
  entity.account = event.params.account.toHexString();
  entity.numCompleteSets = event.params.numCompleteSets.toHexString();
  entity.timestamp = event.params.timestamp.toHexString();

  entity.save();
}

export function handleCompleteSetsSold(event: CompleteSetsSoldEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new CompleteSetsSoldEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "CompleteSetsSold";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.market = event.params.market.toHexString();
  entity.account = event.params.account.toHexString();
  entity.numCompleteSets = event.params.numCompleteSets.toHexString();
  entity.fees = event.params.fees.toHexString();
  entity.timestamp = event.params.timestamp.toHexString();

  entity.save();
}

export function handleDesignatedReportStakeChanged(event: DesignatedReportStakeChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new DesignatedReportStakeChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "DesignatedReportStakeChanged";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.designatedReportStake = event.params.designatedReportStake.toHexString();

  entity.save();
}

export function handleDisputeCrowdsourcerCompleted(event: DisputeCrowdsourcerCompletedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new DisputeCrowdsourcerCompletedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "DisputeCrowdsourcerCompleted";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.market = event.params.market.toHexString();
  entity.disputeCrowdsourcer = event.params.disputeCrowdsourcer.toHexString();
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.nextWindowStartTime = event.params.nextWindowStartTime.toHexString();
  entity.nextWindowEndTime = event.params.nextWindowEndTime.toHexString();
  entity.pacingOn = event.params.pacingOn;
  entity.totalRepStakedInPayout = event.params.totalRepStakedInPayout.toHexString();
  entity.totalRepStakedInMarket = event.params.totalRepStakedInMarket.toHexString();
  entity.disputeRound = event.params.disputeRound.toHexString();
  entity.timestamp = event.params.timestamp.toHexString();

  entity.save();
}

export function handleDisputeCrowdsourcerContribution(event: DisputeCrowdsourcerContributionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new DisputeCrowdsourcerContributionEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "DisputeCrowdsourcerContribution";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.reporter = event.params.reporter.toHexString();
  entity.market = event.params.market.toHexString();
  entity.disputeCrowdsourcer = event.params.disputeCrowdsourcer.toHexString();
  entity.amountStaked = event.params.amountStaked.toHexString();
  entity.description = event.params.description;
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.currentStake = event.params.currentStake.toHexString();
  entity.stakeRemaining = event.params.stakeRemaining.toHexString();
  entity.disputeRound = event.params.disputeRound.toHexString();
  entity.timestamp = event.params.timestamp.toHexString();

  entity.save();
}

export function handleDisputeCrowdsourcerCreated(event: DisputeCrowdsourcerCreatedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new DisputeCrowdsourcerCreatedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "DisputeCrowdsourcerCreated";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.market = event.params.market.toHexString();
  entity.disputeCrowdsourcer = event.params.disputeCrowdsourcer.toHexString();
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.size = event.params.size.toHexString();
  entity.disputeRound = event.params.disputeRound.toHexString();

  entity.save();
}

export function handleDisputeCrowdsourcerRedeemed(event: DisputeCrowdsourcerRedeemedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new DisputeCrowdsourcerRedeemedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "DisputeCrowdsourcerRedeemed";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.reporter = event.params.reporter.toHexString();
  entity.market = event.params.market.toHexString();
  entity.disputeCrowdsourcer = event.params.disputeCrowdsourcer.toHexString();
  entity.amountRedeemed = event.params.amountRedeemed.toHexString();
  entity.repReceived = event.params.repReceived.toHexString();
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.timestamp = event.params.timestamp.toHexString();

  entity.save();
}

export function handleDisputeWindowCreated(event: DisputeWindowCreatedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new DisputeWindowCreatedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "DisputeWindowCreated";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.disputeWindow = event.params.disputeWindow.toHexString();
  entity.startTime = event.params.startTime.toHexString();
  entity.endTime = event.params.endTime.toHexString();
  entity.id = event.params.id.toHexString();
  entity.initial = event.params.initial;

  entity.save();
}

export function handleFinishDeployment(event: FinishDeploymentEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new FinishDeploymentEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "FinishDeployment";
  entity.transactionHash = event.transaction.hash.toHexString();


  entity.save();
}

export function handleInitialReportSubmitted(event: InitialReportSubmittedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new InitialReportSubmittedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "InitialReportSubmitted";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.reporter = event.params.reporter.toHexString();
  entity.market = event.params.market.toHexString();
  entity.initialReporter = event.params.initialReporter.toHexString();
  entity.amountStaked = event.params.amountStaked.toHexString();
  entity.isDesignatedReporter = event.params.isDesignatedReporter;
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.description = event.params.description;
  entity.nextWindowStartTime = event.params.nextWindowStartTime.toHexString();
  entity.nextWindowEndTime = event.params.nextWindowEndTime.toHexString();
  entity.timestamp = event.params.timestamp.toHexString();

  entity.save();
}

export function handleInitialReporterRedeemed(event: InitialReporterRedeemedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new InitialReporterRedeemedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "InitialReporterRedeemed";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.reporter = event.params.reporter.toHexString();
  entity.market = event.params.market.toHexString();
  entity.initialReporter = event.params.initialReporter.toHexString();
  entity.amountRedeemed = event.params.amountRedeemed.toHexString();
  entity.repReceived = event.params.repReceived.toHexString();
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.timestamp = event.params.timestamp.toHexString();

  entity.save();
}

export function handleInitialReporterTransferred(event: InitialReporterTransferredEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new InitialReporterTransferredEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "InitialReporterTransferred";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.market = event.params.market.toHexString();
  entity.from = event.params.from.toHexString();
  entity.to = event.params.to.toHexString();

  entity.save();
}

export function handleMarketCreated(event: MarketCreatedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketCreatedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "MarketCreated";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.endTime = event.params.endTime.toHexString();
  entity.extraInfo = event.params.extraInfo;
  entity.market = event.params.market.toHexString();
  entity.marketCreator = event.params.marketCreator.toHexString();
  entity.designatedReporter = event.params.designatedReporter.toHexString();
  entity.feePerCashInAttoCash = event.params.feePerCashInAttoCash.toHexString();
  entity.prices = mapArray(event.params.prices);
  entity.marketType = event.params.marketType;
  entity.numTicks = event.params.numTicks.toHexString();
  entity.outcomes = event.params.outcomes;
  entity.noShowBond = event.params.noShowBond.toHexString();
  entity.timestamp = event.params.timestamp.toHexString();

  entity.save();
}

export function handleMarketFinalized(event: MarketFinalizedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketFinalizedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "MarketFinalized";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.market = event.params.market.toHexString();
  entity.timestamp = event.params.timestamp.toHexString();
  entity.winningPayoutNumerators = mapArray(event.params.winningPayoutNumerators);

  entity.save();
}

export function handleMarketMigrated(event: MarketMigratedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketMigratedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "MarketMigrated";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.market = event.params.market.toHexString();
  entity.originalUniverse = event.params.originalUniverse.toHexString();
  entity.newUniverse = event.params.newUniverse.toHexString();

  entity.save();
}

export function handleMarketOIChanged(event: MarketOIChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketOIChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "MarketOIChanged";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.market = event.params.market.toHexString();
  entity.marketOI = event.params.marketOI.toHexString();

  entity.save();
}

export function handleMarketParticipantsDisavowed(event: MarketParticipantsDisavowedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketParticipantsDisavowedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "MarketParticipantsDisavowed";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.market = event.params.market.toHexString();

  entity.save();
}

export function handleMarketRepBondTransferred(event: MarketRepBondTransferredEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketRepBondTransferredEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "MarketRepBondTransferred";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.market = event.params.market.toHexString();
  entity.from = event.params.from.toHexString();
  entity.to = event.params.to.toHexString();

  entity.save();
}

export function handleMarketTransferred(event: MarketTransferredEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketTransferredEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "MarketTransferred";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.market = event.params.market.toHexString();
  entity.from = event.params.from.toHexString();
  entity.to = event.params.to.toHexString();

  entity.save();
}

export function handleNoShowBondChanged(event: NoShowBondChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new NoShowBondChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "NoShowBondChanged";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.noShowBond = event.params.noShowBond.toHexString();

  entity.save();
}

export function handleParticipationTokensRedeemed(event: ParticipationTokensRedeemedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ParticipationTokensRedeemedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "ParticipationTokensRedeemed";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.disputeWindow = event.params.disputeWindow.toHexString();
  entity.account = event.params.account.toHexString();
  entity.attoParticipationTokens = event.params.attoParticipationTokens.toHexString();
  entity.feePayoutShare = event.params.feePayoutShare.toHexString();
  entity.timestamp = event.params.timestamp.toHexString();

  entity.save();
}

export function handleRegisterContract(event: RegisterContractEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new RegisterContractEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "RegisterContract";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.contractAddress = event.params.contractAddress.toHexString();
  entity.key = event.params.key;

  entity.save();
}

export function handleReportingFeeChanged(event: ReportingFeeChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ReportingFeeChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "ReportingFeeChanged";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.reportingFee = event.params.reportingFee.toHexString();

  entity.save();
}

export function handleReportingParticipantDisavowed(event: ReportingParticipantDisavowedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ReportingParticipantDisavowedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "ReportingParticipantDisavowed";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.market = event.params.market.toHexString();
  entity.reportingParticipant = event.params.reportingParticipant.toHexString();

  entity.save();
}

export function handleShareTokenBalanceChanged(event: ShareTokenBalanceChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ShareTokenBalanceChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "ShareTokenBalanceChanged";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.account = event.params.account.toHexString();
  entity.market = event.params.market.toHexString();
  entity.outcome = event.params.outcome.toHexString();
  entity.balance = event.params.balance.toHexString();

  entity.save();
}

export function handleTimestampSet(event: TimestampSetEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TimestampSetEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "TimestampSet";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.newTimestamp = event.params.newTimestamp.toHexString();

  entity.save();
}

export function handleTokenBalanceChanged(event: TokenBalanceChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TokenBalanceChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "TokenBalanceChanged";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.owner = event.params.owner.toHexString();
  entity.token = event.params.token.toHexString();
  entity.tokenType = event.params.tokenType;
  entity.market = event.params.market.toHexString();
  entity.balance = event.params.balance.toHexString();
  entity.outcome = event.params.outcome.toHexString();

  entity.save();
}

export function handleTokensBurned(event: TokensBurnedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TokensBurnedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "TokensBurned";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.token = event.params.token.toHexString();
  entity.target = event.params.target.toHexString();
  entity.amount = event.params.amount.toHexString();
  entity.tokenType = event.params.tokenType;
  entity.market = event.params.market.toHexString();
  entity.totalSupply = event.params.totalSupply.toHexString();

  entity.save();
}

export function handleTokensMinted(event: TokensMintedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TokensMintedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "TokensMinted";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.token = event.params.token.toHexString();
  entity.target = event.params.target.toHexString();
  entity.amount = event.params.amount.toHexString();
  entity.tokenType = event.params.tokenType;
  entity.market = event.params.market.toHexString();
  entity.totalSupply = event.params.totalSupply.toHexString();

  entity.save();
}

export function handleTokensTransferred(event: TokensTransferredEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TokensTransferredEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "TokensTransferred";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.token = event.params.token.toHexString();
  entity.from = event.params.from.toHexString();
  entity.to = event.params.to.toHexString();
  entity.value = event.params.value.toHexString();
  entity.tokenType = event.params.tokenType;
  entity.market = event.params.market.toHexString();

  entity.save();
}

export function handleTradingProceedsClaimed(event: TradingProceedsClaimedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TradingProceedsClaimedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "TradingProceedsClaimed";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.sender = event.params.sender.toHexString();
  entity.market = event.params.market.toHexString();
  entity.outcome = event.params.outcome.toHexString();
  entity.numShares = event.params.numShares.toHexString();
  entity.numPayoutTokens = event.params.numPayoutTokens.toHexString();
  entity.fees = event.params.fees.toHexString();
  entity.timestamp = event.params.timestamp.toHexString();

  entity.save();
}

export function handleUniverseCreated(event: UniverseCreatedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new UniverseCreatedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "UniverseCreated";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.parentUniverse = event.params.parentUniverse.toHexString();
  entity.childUniverse = event.params.childUniverse.toHexString();
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.creationTimestamp = event.params.creationTimestamp.toHexString();

  entity.save();
}

export function handleUniverseForked(event: UniverseForkedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new UniverseForkedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "UniverseForked";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.forkingMarket = event.params.forkingMarket.toHexString();

  entity.save();
}

export function handleValidityBondChanged(event: ValidityBondChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ValidityBondChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "ValidityBondChanged";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.validityBond = event.params.validityBond.toHexString();

  entity.save();
}

export function handleWarpSyncDataUpdated(event: WarpSyncDataUpdatedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new WarpSyncDataUpdatedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "WarpSyncDataUpdated";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = event.params.universe.toHexString();
  entity.warpSyncHash = event.params.warpSyncHash.toHexString();
  entity.marketEndTime = event.params.marketEndTime.toHexString();

  entity.save();
}
