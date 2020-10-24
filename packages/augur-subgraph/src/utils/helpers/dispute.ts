import {
  MarketReport,
  Dispute,
  DisputeWindow,
  DisputeRound,
  DisputeCrowdsourcer
} from "../../../generated/schema";
import {
  MarketCreated,
  MarketTransferred,
  MarketMigrated,
  MarketFinalized,
  MarketOIChanged,
  TokensMinted,
  TokensBurned,
  TokensTransferred,
  TokenBalanceChanged
} from "../../../generated/Augur/Augur";
import {
  Address,
  BigInt,
  Bytes,
  log
} from "@graphprotocol/graph-ts";
import { DEFAULT_DECIMALS, toDecimal } from "../decimals";
import {
  ZERO_ADDRESS,
  BIGINT_ZERO,
  BIGINT_ONE,
  BIGDECIMAL_ZERO,
  DISPUTE_CROWDSOURCER,
  REPUTATION_TOKEN,
  PARTICIPATION_TOKEN,
  marketTypes,
  tokenTypes
} from "../constants";

export function getOrCreateDispute(
  id: String,
  createIfNotFound: boolean = true
): Dispute {
  let dispute = Dispute.load(id);

  if (dispute == null && createIfNotFound) {
    dispute = new Dispute(id);

    dispute.isDone = false;
  }

  return dispute as Dispute;
}

export function getOrCreateDisputeWindow(
  id: String,
  createIfNotFound: boolean = true
): DisputeWindow {
  let disputeWindow = DisputeWindow.load(id);

  if (disputeWindow == null && createIfNotFound) {
    disputeWindow = new DisputeWindow(id);
  }

  return disputeWindow as DisputeWindow;
}

export function getOrCreateDisputeRound(
  id: String,
  createIfNotFound: boolean = true
): DisputeRound {
  let disputeRound = DisputeRound.load(id);

  if (disputeRound == null && createIfNotFound) {
    disputeRound = new DisputeRound(id);
  }

  return disputeRound as DisputeRound;
}

export function getOrCreateDisputeCrowdsourcer(
  id: String,
  createIfNotFound: boolean = true
): DisputeCrowdsourcer {
  let disputeCrowdsourcer = DisputeCrowdsourcer.load(id);

  if (disputeCrowdsourcer == null && createIfNotFound) {
    disputeCrowdsourcer = new DisputeCrowdsourcer(id);

    disputeCrowdsourcer.bondFilled = false;
    disputeCrowdsourcer.staked = BIGINT_ZERO;
  }

  return disputeCrowdsourcer as DisputeCrowdsourcer;
}
