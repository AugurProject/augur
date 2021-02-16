import { Address, BigInt, Bytes, Value, log } from "@graphprotocol/graph-ts";
import {
  InitialReportSubmitted,
  DisputeCrowdsourcerCompleted,
  DisputeCrowdsourcerContribution,
  DisputeCrowdsourcerCreated,
  DisputeCrowdsourcerRedeemed,
  DisputeWindowCreated
} from "../../generated/Augur/Augur";

import { Market as MarketContract } from '../../generated/Augur/Market';

import {
  getOrCreateUser,
  getOrCreateMarket,
  getOrCreateMarketReport,
  getOrCreateDispute,
  getOrCreateDisputeRound,
  getOrCreateDisputeWindow,
  getOrCreateDisputeCrowdsourcer,
  updateOutcomesForMarket
} from "../utils/helpers";
import {
  ZERO_ADDRESS,
  BIGINT_ONE,
  BIGINT_ZERO,
  STATUS_SETTLED,
  STATUS_TRADING,
  STATUS_DISPUTING,
  STATUS_FINALIZED,
  STATUS_REPORTING
} from "../utils/constants";
import { toDecimal } from "../utils/decimals";

// - event: InitialReportSubmitted(indexed address,indexed address,indexed address,address,uint256,bool,uint256[],string,uint256,uint256,uint256)(indexed address,indexed address,indexed address,uint256,uint256)
//   handler: handleInitialReportSubmitted

// event InitialReportSubmitted(address indexed universe, address indexed reporter, address indexed market, address initialReporter, uint256 amountStaked, bool isDesignatedReporter, uint256[] payoutNumerators, string description, uint256 nextWindowStartTime, uint256 nextWindowEndTime, uint256 timestamp);

export function handleInitialReportSubmitted(
  event: InitialReportSubmitted
): void {
  let market = getOrCreateMarket(event.params.market.toHexString());
  let reporter = getOrCreateUser(event.params.reporter.toHexString());
  let marketReport = getOrCreateMarketReport(event.params.market.toHexString());
  let dispute = getOrCreateDispute(event.params.market.toHexString());
  let disputeRound = getOrCreateDisputeRound(
    event.params.market.toHexString().concat("-0")
  );

  let marketContractInstance = MarketContract.bind(Address.fromString(event.params.market.toHexString()));
  market.currentDisputeWindow = marketContractInstance.getDisputeWindow().toHexString();
  market.status = STATUS_REPORTING;
  market.dispute = dispute.id;
  market.report = marketReport.id;

  marketReport.payoutNumerators = event.params.payoutNumerators;
  marketReport.firstReportedAt = event.block.timestamp;
  marketReport.lastReportedAt = event.block.timestamp;
  marketReport.initialReporter = reporter.id;
  marketReport.isDesignatedReporter = event.params.isDesignatedReporter;

  dispute.market = market.id;
  dispute.currentReport = marketReport.id;
  dispute.universe = event.params.universe.toHexString();
  dispute.currentDisputeRound = disputeRound.id;
  dispute.creationTimestamp = event.block.timestamp;
  dispute.block = event.block.number;
  dispute.tx_hash = event.transaction.hash.toHexString();

  disputeRound.dispute = dispute.id;
  disputeRound.market = market.id;
  disputeRound.universe = event.params.universe.toHexString();

  dispute.save();
  disputeRound.save();
  market.save();
  marketReport.save();

  updateOutcomesForMarket(market.id, event.params.payoutNumerators, false);
}

// - event: DisputeCrowdsourcerCompleted(indexed address,indexed address,address,uint256[],uint256,uint256,bool,uint256,uint256,uint256,uint256)
//   handler: handleDisputeCrowdsourcerCompleted

// event DisputeCrowdsourcerCompleted(address indexed universe, address indexed market, address disputeCrowdsourcer, uint256[] payoutNumerators, uint256 nextWindowStartTime, uint256 nextWindowEndTime, bool pacingOn, uint256 totalRepStakedInPayout, uint256 totalRepStakedInMarket, uint256 disputeRound, uint256 timestamp);

export function handleDisputeCrowdsourcerCompleted(
  event: DisputeCrowdsourcerCompleted
): void {
  let market = getOrCreateMarket(event.params.market.toHexString());
  let marketReport = getOrCreateMarketReport(event.params.market.toHexString());
  let disputeCrowdsourcer = getOrCreateDisputeCrowdsourcer(
    event.params.disputeCrowdsourcer.toHexString()
  );

  disputeCrowdsourcer.bondFilled = true;

  let marketContractInstance = MarketContract.bind(Address.fromString(event.params.market.toHexString()));
  market.currentDisputeWindow = marketContractInstance.getDisputeWindow().toHexString();
  market.status = STATUS_DISPUTING;

  marketReport.payoutNumerators = event.params.payoutNumerators;
  marketReport.isInitialReport = false;
  marketReport.lastReportedAt = event.block.timestamp;

  market.save();
  marketReport.save();
  disputeCrowdsourcer.save();

  updateOutcomesForMarket(market.id, event.params.payoutNumerators, false);
}

// - event: DisputeCrowdsourcerContribution(indexed address,indexed address,indexed address,address,uint256,string,uint256[],uint256,uint256,uint256,uint256)
//   handler: handleDisputeCrowdsourcerContribution

// event DisputeCrowdsourcerContribution(address indexed universe, address indexed reporter, address indexed market, address disputeCrowdsourcer, uint256 amountStaked, string description, uint256[] payoutNumerators, uint256 currentStake, uint256 stakeRemaining, uint256 disputeRound, uint256 timestamp);

export function handleDisputeCrowdsourcerContribution(
  event: DisputeCrowdsourcerContribution
): void {
  let disputeCrowdsourcer = getOrCreateDisputeCrowdsourcer(
    event.params.disputeCrowdsourcer.toHexString()
  );
  disputeCrowdsourcer.staked =
    disputeCrowdsourcer.staked + event.params.amountStaked;

  disputeCrowdsourcer.save();
}

// - event: DisputeCrowdsourcerCreated(indexed address,indexed address,address,uint256[],uint256,uint256)
//   handler: handleDisputeCrowdsourcerCreated

// event DisputeCrowdsourcerCreated(address indexed universe, address indexed market, address disputeCrowdsourcer, uint256[] payoutNumerators, uint256 size, uint256 disputeRound);

export function handleDisputeCrowdsourcerCreated(
  event: DisputeCrowdsourcerCreated
): void {
  let disputeRoundId = event.params.market
    .toHexString()
    .concat("-")
    .concat(event.params.disputeRound.toString());

  let market = getOrCreateMarket(event.params.market.toHexString());
  let marketContractInstance = MarketContract.bind(Address.fromString(event.params.market.toHexString()));
  market.currentDisputeWindow = marketContractInstance.getDisputeWindow().toHexString();

  let dispute = getOrCreateDispute(event.params.market.toHexString());
  let disputeRound = getOrCreateDisputeRound(dispute.currentDisputeRound);
  if (disputeRound.id != disputeRoundId) {
    disputeRound = getOrCreateDisputeRound(disputeRoundId);

    dispute.currentDisputeRound = disputeRound.id;

    disputeRound.dispute = dispute.id;
    disputeRound.market = event.params.market.toHexString();
    disputeRound.universe = event.params.universe.toHexString();

    disputeRound.save();
    dispute.save();
  }

  let disputeCrowdsourcer = getOrCreateDisputeCrowdsourcer(
    event.params.disputeCrowdsourcer.toHexString()
  );

  disputeCrowdsourcer.disputeRound = disputeRound.id;
  disputeCrowdsourcer.payoutNumerators = event.params.payoutNumerators;
  disputeCrowdsourcer.disputeBondSize = event.params.size;
  disputeCrowdsourcer.market = event.params.market.toHexString();
  disputeCrowdsourcer.universe = event.params.universe.toHexString();

  disputeCrowdsourcer.save();
}

// - event: DisputeWindowCreated(indexed address,address,uint256,uint256,uint256,bool)
//   handler: handleDisputeWindowCreated

// event DisputeWindowCreated(address indexed universe, address disputeWindow, uint256 startTime, uint256 endTime, uint256 id, bool initial);

export function handleDisputeWindowCreated(event: DisputeWindowCreated): void {
  let disputeWindow = getOrCreateDisputeWindow(
    event.params.disputeWindow.toHexString()
  );

  disputeWindow.startTime = event.params.startTime;
  disputeWindow.endTime = event.params.endTime;
  disputeWindow.universe = event.params.universe.toHexString();

  disputeWindow.save();
}
