import { Address, BigDecimal, BigInt, Bytes, crypto, log } from '@graphprotocol/graph-ts';
import { toChecksumAddress, mapAddressArray, mapByteArray, mapArray, bigIntToHexString } from './utils';
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
  CompleteSetsPurchasedEvent as CompleteSetsPurchasedEntity,
  CompleteSetsSoldEvent as CompleteSetsSoldEntity,
  DesignatedReportStakeChangedEvent as DesignatedReportStakeChangedEntity,
  DisputeCrowdsourcerCompletedEvent as DisputeCrowdsourcerCompletedEntity,
  DisputeCrowdsourcerContributionEvent as DisputeCrowdsourcerContributionEntity,
  DisputeCrowdsourcerCreatedEvent as DisputeCrowdsourcerCreatedEntity,
  DisputeCrowdsourcerRedeemedEvent as DisputeCrowdsourcerRedeemedEntity,
  DisputeWindowCreatedEvent as DisputeWindowCreatedEntity,
  FinishDeploymentEvent as FinishDeploymentEntity,
  InitialReportSubmittedEvent as InitialReportSubmittedEntity,
  InitialReporterRedeemedEvent as InitialReporterRedeemedEntity,
  InitialReporterTransferredEvent as InitialReporterTransferredEntity,
  MarketCreatedEvent as MarketCreatedEntity,
  MarketFinalizedEvent as MarketFinalizedEntity,
  MarketMigratedEvent as MarketMigratedEntity,
  MarketOIChangedEvent as MarketOIChangedEntity,
  MarketParticipantsDisavowedEvent as MarketParticipantsDisavowedEntity,
  MarketRepBondTransferredEvent as MarketRepBondTransferredEntity,
  MarketTransferredEvent as MarketTransferredEntity,
  NoShowBondChangedEvent as NoShowBondChangedEntity,
  ParticipationTokensRedeemedEvent as ParticipationTokensRedeemedEntity,
  RegisterContractEvent as RegisterContractEntity,
  ReportingFeeChangedEvent as ReportingFeeChangedEntity,
  ReportingParticipantDisavowedEvent as ReportingParticipantDisavowedEntity,
  ShareTokenBalanceChangedEvent as ShareTokenBalanceChangedEntity,
  TimestampSetEvent as TimestampSetEntity,
  TokenBalanceChangedEvent as TokenBalanceChangedEntity,
  TokensBurnedEvent as TokensBurnedEntity,
  TokensMintedEvent as TokensMintedEntity,
  TokensTransferredEvent as TokensTransferredEntity,
  TradingProceedsClaimedEvent as TradingProceedsClaimedEntity,
  UniverseCreatedEvent as UniverseCreatedEntity,
  UniverseForkedEvent as UniverseForkedEntity,
  ValidityBondChangedEvent as ValidityBondChangedEntity,
  WarpSyncDataUpdatedEvent as WarpSyncDataUpdatedEntity,
} from '../generated/schema';

export function handleCompleteSetsPurchasedEvent(event: CompleteSetsPurchasedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new CompleteSetsPurchasedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "CompleteSetsPurchased";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.account = toChecksumAddress(event.params.account);
  entity.numCompleteSets = bigIntToHexString(event.params.numCompleteSets);
  entity.timestamp = bigIntToHexString(event.params.timestamp);

  entity.save();
}

export function handleCompleteSetsSoldEvent(event: CompleteSetsSoldEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new CompleteSetsSoldEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "CompleteSetsSold";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.account = toChecksumAddress(event.params.account);
  entity.numCompleteSets = bigIntToHexString(event.params.numCompleteSets);
  entity.fees = bigIntToHexString(event.params.fees);
  entity.timestamp = bigIntToHexString(event.params.timestamp);

  entity.save();
}

export function handleDesignatedReportStakeChangedEvent(event: DesignatedReportStakeChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new DesignatedReportStakeChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "DesignatedReportStakeChanged";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.designatedReportStake = bigIntToHexString(event.params.designatedReportStake);

  entity.save();
}

export function handleDisputeCrowdsourcerCompletedEvent(event: DisputeCrowdsourcerCompletedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new DisputeCrowdsourcerCompletedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "DisputeCrowdsourcerCompleted";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.disputeCrowdsourcer = toChecksumAddress(event.params.disputeCrowdsourcer);
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.nextWindowStartTime = bigIntToHexString(event.params.nextWindowStartTime);
  entity.nextWindowEndTime = bigIntToHexString(event.params.nextWindowEndTime);
  entity.pacingOn = event.params.pacingOn;
  entity.totalRepStakedInPayout = bigIntToHexString(event.params.totalRepStakedInPayout);
  entity.totalRepStakedInMarket = bigIntToHexString(event.params.totalRepStakedInMarket);
  entity.disputeRound = bigIntToHexString(event.params.disputeRound);
  entity.timestamp = bigIntToHexString(event.params.timestamp);

  entity.save();
}

export function handleDisputeCrowdsourcerContributionEvent(event: DisputeCrowdsourcerContributionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new DisputeCrowdsourcerContributionEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "DisputeCrowdsourcerContribution";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.reporter = toChecksumAddress(event.params.reporter);
  entity.market = toChecksumAddress(event.params.market);
  entity.disputeCrowdsourcer = toChecksumAddress(event.params.disputeCrowdsourcer);
  entity.amountStaked = bigIntToHexString(event.params.amountStaked);
  entity.description = event.params.description;
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.currentStake = bigIntToHexString(event.params.currentStake);
  entity.stakeRemaining = bigIntToHexString(event.params.stakeRemaining);
  entity.disputeRound = bigIntToHexString(event.params.disputeRound);
  entity.timestamp = bigIntToHexString(event.params.timestamp);

  entity.save();
}

export function handleDisputeCrowdsourcerCreatedEvent(event: DisputeCrowdsourcerCreatedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new DisputeCrowdsourcerCreatedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "DisputeCrowdsourcerCreated";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.disputeCrowdsourcer = toChecksumAddress(event.params.disputeCrowdsourcer);
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.size = bigIntToHexString(event.params.size);
  entity.disputeRound = bigIntToHexString(event.params.disputeRound);

  entity.save();
}

export function handleDisputeCrowdsourcerRedeemedEvent(event: DisputeCrowdsourcerRedeemedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new DisputeCrowdsourcerRedeemedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "DisputeCrowdsourcerRedeemed";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.reporter = toChecksumAddress(event.params.reporter);
  entity.market = toChecksumAddress(event.params.market);
  entity.disputeCrowdsourcer = toChecksumAddress(event.params.disputeCrowdsourcer);
  entity.amountRedeemed = bigIntToHexString(event.params.amountRedeemed);
  entity.repReceived = bigIntToHexString(event.params.repReceived);
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.timestamp = bigIntToHexString(event.params.timestamp);

  entity.save();
}

export function handleDisputeWindowCreatedEvent(event: DisputeWindowCreatedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new DisputeWindowCreatedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "DisputeWindowCreated";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.disputeWindow = toChecksumAddress(event.params.disputeWindow);
  entity.startTime = bigIntToHexString(event.params.startTime);
  entity.endTime = bigIntToHexString(event.params.endTime);
  entity.id = bigIntToHexString(event.params.id);
  entity.initial = event.params.initial;

  entity.save();
}

export function handleFinishDeploymentEvent(event: FinishDeploymentEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new FinishDeploymentEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "FinishDeployment";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();


  entity.save();
}

export function handleInitialReportSubmittedEvent(event: InitialReportSubmittedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new InitialReportSubmittedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "InitialReportSubmitted";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.reporter = toChecksumAddress(event.params.reporter);
  entity.market = toChecksumAddress(event.params.market);
  entity.initialReporter = toChecksumAddress(event.params.initialReporter);
  entity.amountStaked = bigIntToHexString(event.params.amountStaked);
  entity.isDesignatedReporter = event.params.isDesignatedReporter;
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.description = event.params.description;
  entity.nextWindowStartTime = bigIntToHexString(event.params.nextWindowStartTime);
  entity.nextWindowEndTime = bigIntToHexString(event.params.nextWindowEndTime);
  entity.timestamp = bigIntToHexString(event.params.timestamp);

  entity.save();
}

export function handleInitialReporterRedeemedEvent(event: InitialReporterRedeemedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new InitialReporterRedeemedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "InitialReporterRedeemed";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.reporter = toChecksumAddress(event.params.reporter);
  entity.market = toChecksumAddress(event.params.market);
  entity.initialReporter = toChecksumAddress(event.params.initialReporter);
  entity.amountRedeemed = bigIntToHexString(event.params.amountRedeemed);
  entity.repReceived = bigIntToHexString(event.params.repReceived);
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.timestamp = bigIntToHexString(event.params.timestamp);

  entity.save();
}

export function handleInitialReporterTransferredEvent(event: InitialReporterTransferredEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new InitialReporterTransferredEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "InitialReporterTransferred";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.from = toChecksumAddress(event.params.from);
  entity.to = toChecksumAddress(event.params.to);

  entity.save();
}

export function handleMarketCreatedEvent(event: MarketCreatedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketCreatedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "MarketCreated";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.endTime = bigIntToHexString(event.params.endTime);
  entity.extraInfo = event.params.extraInfo;
  entity.market = toChecksumAddress(event.params.market);
  entity.marketCreator = toChecksumAddress(event.params.marketCreator);
  entity.designatedReporter = toChecksumAddress(event.params.designatedReporter);
  entity.feePerCashInAttoCash = bigIntToHexString(event.params.feePerCashInAttoCash);
  entity.prices = mapArray(event.params.prices);
  entity.marketType = event.params.marketType;
  entity.numTicks = bigIntToHexString(event.params.numTicks);
  entity.outcomes = event.params.outcomes;
  entity.noShowBond = bigIntToHexString(event.params.noShowBond);
  entity.timestamp = bigIntToHexString(event.params.timestamp);

  entity.save();
}

export function handleMarketFinalizedEvent(event: MarketFinalizedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketFinalizedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "MarketFinalized";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.timestamp = bigIntToHexString(event.params.timestamp);
  entity.winningPayoutNumerators = mapArray(event.params.winningPayoutNumerators);

  entity.save();
}

export function handleMarketMigratedEvent(event: MarketMigratedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketMigratedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "MarketMigrated";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.market = toChecksumAddress(event.params.market);
  entity.originalUniverse = toChecksumAddress(event.params.originalUniverse);
  entity.newUniverse = toChecksumAddress(event.params.newUniverse);

  entity.save();
}

export function handleMarketOIChangedEvent(event: MarketOIChangedEvent): void {
  let market = toChecksumAddress(event.params.market);

  let id = market;

  let entity = MarketOIChangedEntity.load(id);
  if (entity == null) {
    entity = new MarketOIChangedEntity(id);
  }

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "MarketOIChanged";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.marketOI = bigIntToHexString(event.params.marketOI);

  entity.save();
}

export function handleMarketParticipantsDisavowedEvent(event: MarketParticipantsDisavowedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketParticipantsDisavowedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "MarketParticipantsDisavowed";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);

  entity.save();
}

export function handleMarketRepBondTransferredEvent(event: MarketRepBondTransferredEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketRepBondTransferredEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "MarketRepBondTransferred";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.from = toChecksumAddress(event.params.from);
  entity.to = toChecksumAddress(event.params.to);

  entity.save();
}

export function handleMarketTransferredEvent(event: MarketTransferredEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketTransferredEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "MarketTransferred";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.from = toChecksumAddress(event.params.from);
  entity.to = toChecksumAddress(event.params.to);

  entity.save();
}

export function handleNoShowBondChangedEvent(event: NoShowBondChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new NoShowBondChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "NoShowBondChanged";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.noShowBond = bigIntToHexString(event.params.noShowBond);

  entity.save();
}

export function handleParticipationTokensRedeemedEvent(event: ParticipationTokensRedeemedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ParticipationTokensRedeemedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "ParticipationTokensRedeemed";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.disputeWindow = toChecksumAddress(event.params.disputeWindow);
  entity.account = toChecksumAddress(event.params.account);
  entity.attoParticipationTokens = bigIntToHexString(event.params.attoParticipationTokens);
  entity.feePayoutShare = bigIntToHexString(event.params.feePayoutShare);
  entity.timestamp = bigIntToHexString(event.params.timestamp);

  entity.save();
}

export function handleRegisterContractEvent(event: RegisterContractEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new RegisterContractEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "RegisterContract";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.contractAddress = toChecksumAddress(event.params.contractAddress);
  entity.key = event.params.key;

  entity.save();
}

export function handleReportingFeeChangedEvent(event: ReportingFeeChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ReportingFeeChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "ReportingFeeChanged";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.reportingFee = bigIntToHexString(event.params.reportingFee);

  entity.save();
}

export function handleReportingParticipantDisavowedEvent(event: ReportingParticipantDisavowedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ReportingParticipantDisavowedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "ReportingParticipantDisavowed";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.reportingParticipant = toChecksumAddress(event.params.reportingParticipant);

  entity.save();
}

export function handleShareTokenBalanceChangedEvent(event: ShareTokenBalanceChangedEvent): void {
  let account = toChecksumAddress(event.params.account);
  let market = toChecksumAddress(event.params.market);
  let outcome = bigIntToHexString(event.params.outcome);

  let id = account + "-" + market + "-" + outcome;

  let entity = ShareTokenBalanceChangedEntity.load(id);
  if (entity == null) {
    entity = new ShareTokenBalanceChangedEntity(id);
  }

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "ShareTokenBalanceChanged";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.account = toChecksumAddress(event.params.account);
  entity.market = toChecksumAddress(event.params.market);
  entity.outcome = bigIntToHexString(event.params.outcome);
  entity.balance = bigIntToHexString(event.params.balance);

  entity.save();
}

export function handleTimestampSetEvent(event: TimestampSetEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TimestampSetEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "TimestampSet";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.newTimestamp = bigIntToHexString(event.params.newTimestamp);

  entity.save();
}

export function handleTokenBalanceChangedEvent(event: TokenBalanceChangedEvent): void {
  let owner = toChecksumAddress(event.params.owner);
  let token = toChecksumAddress(event.params.token);

  let id = owner + "-" + token;

  let entity = TokenBalanceChangedEntity.load(id);
  if (entity == null) {
    entity = new TokenBalanceChangedEntity(id);
  }

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "TokenBalanceChanged";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.owner = toChecksumAddress(event.params.owner);
  entity.token = toChecksumAddress(event.params.token);
  entity.tokenType = event.params.tokenType;
  entity.market = toChecksumAddress(event.params.market);
  entity.balance = bigIntToHexString(event.params.balance);
  entity.outcome = bigIntToHexString(event.params.outcome);

  entity.save();
}

export function handleTokensBurnedEvent(event: TokensBurnedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TokensBurnedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "TokensBurned";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.token = toChecksumAddress(event.params.token);
  entity.target = toChecksumAddress(event.params.target);
  entity.amount = bigIntToHexString(event.params.amount);
  entity.tokenType = event.params.tokenType;
  entity.market = toChecksumAddress(event.params.market);
  entity.totalSupply = bigIntToHexString(event.params.totalSupply);

  entity.save();
}

export function handleTokensMintedEvent(event: TokensMintedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TokensMintedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "TokensMinted";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.token = toChecksumAddress(event.params.token);
  entity.target = toChecksumAddress(event.params.target);
  entity.amount = bigIntToHexString(event.params.amount);
  entity.tokenType = event.params.tokenType;
  entity.market = toChecksumAddress(event.params.market);
  entity.totalSupply = bigIntToHexString(event.params.totalSupply);

  entity.save();
}

export function handleTokensTransferredEvent(event: TokensTransferredEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TokensTransferredEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "TokensTransferred";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.token = toChecksumAddress(event.params.token);
  entity.from = toChecksumAddress(event.params.from);
  entity.to = toChecksumAddress(event.params.to);
  entity.value = bigIntToHexString(event.params.value);
  entity.tokenType = event.params.tokenType;
  entity.market = toChecksumAddress(event.params.market);

  entity.save();
}

export function handleTradingProceedsClaimedEvent(event: TradingProceedsClaimedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TradingProceedsClaimedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "TradingProceedsClaimed";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.sender = toChecksumAddress(event.params.sender);
  entity.market = toChecksumAddress(event.params.market);
  entity.outcome = bigIntToHexString(event.params.outcome);
  entity.numShares = bigIntToHexString(event.params.numShares);
  entity.numPayoutTokens = bigIntToHexString(event.params.numPayoutTokens);
  entity.fees = bigIntToHexString(event.params.fees);
  entity.timestamp = bigIntToHexString(event.params.timestamp);

  entity.save();
}

export function handleUniverseCreatedEvent(event: UniverseCreatedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new UniverseCreatedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "UniverseCreated";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.parentUniverse = toChecksumAddress(event.params.parentUniverse);
  entity.childUniverse = toChecksumAddress(event.params.childUniverse);
  entity.payoutNumerators = mapArray(event.params.payoutNumerators);
  entity.creationTimestamp = bigIntToHexString(event.params.creationTimestamp);

  entity.save();
}

export function handleUniverseForkedEvent(event: UniverseForkedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new UniverseForkedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "UniverseForked";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.forkingMarket = toChecksumAddress(event.params.forkingMarket);

  entity.save();
}

export function handleValidityBondChangedEvent(event: ValidityBondChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ValidityBondChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "ValidityBondChanged";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.validityBond = bigIntToHexString(event.params.validityBond);

  entity.save();
}

export function handleWarpSyncDataUpdatedEvent(event: WarpSyncDataUpdatedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new WarpSyncDataUpdatedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "WarpSyncDataUpdated";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.warpSyncHash = bigIntToHexString(event.params.warpSyncHash);
  entity.marketEndTime = bigIntToHexString(event.params.marketEndTime);

  entity.save();
}
