import {
  ShareToken,
  UserReputationTokenBalance,
  UserParticipationTokenBalance,
  UserDisputeTokenBalance,
  TokenMintedEvent,
  TokenBurnedEvent,
  TokenTransferredEvent,
  Token, ParaShareToken,
} from '../../../generated/schema';
import {
  TokensMinted,
  TokensBurned,
  TokensTransferred,
  TokenBalanceChanged
} from "../../../generated/Augur/Augur";
import { log } from "@graphprotocol/graph-ts";
import { BIGINT_ZERO, tokenTypes } from "../constants";
import { getEventId } from "./index";

export function getOrCreateToken(
  id: String,
  tokenType: i32,
  universeId: String,
  createIfNotFound: boolean = true,
  save: boolean = true
): Token {
  let token = Token.load(id);

  if (token == null && createIfNotFound) {
    token = new Token(id);

    token.tokenType = getTokenTypeFromInt(tokenType);
    token.universe = universeId;

    if (save) {
      token.save();
    }
  }

  return token as Token;
}

export function getOrCreateUserReputationTokenBalance(
  id: String,
  createIfNotFound: boolean = true
): UserReputationTokenBalance {
  let tokenBalance = UserReputationTokenBalance.load(id);

  if (tokenBalance == null && createIfNotFound) {
    tokenBalance = new UserReputationTokenBalance(id);

    tokenBalance.balance = BIGINT_ZERO;
  }

  return tokenBalance as UserReputationTokenBalance;
}

export function getOrCreateUserDisputeTokenBalance(
  id: String,
  createIfNotFound: boolean = true
): UserDisputeTokenBalance {
  let tokenBalance = UserDisputeTokenBalance.load(id);

  if (tokenBalance == null && createIfNotFound) {
    tokenBalance = new UserDisputeTokenBalance(id);

    tokenBalance.balance = BIGINT_ZERO;
  }

  return tokenBalance as UserDisputeTokenBalance;
}

export function getOrCreateUserParticipationTokenBalance(
  id: String,
  createIfNotFound: boolean = true
): UserParticipationTokenBalance {
  let tokenBalance = UserParticipationTokenBalance.load(id);

  if (tokenBalance == null && createIfNotFound) {
    tokenBalance = new UserParticipationTokenBalance(id);

    tokenBalance.balance = BIGINT_ZERO;
  }

  return tokenBalance as UserParticipationTokenBalance;
}

export function getUserBalanceId(
  userId: String,
  tokenId: String,
  tokenType: i32
): String {
  return getTokenTypeFromInt(tokenType)
    .concat("-")
    .concat(userId)
    .concat("-")
    .concat(tokenId);
}

export function createAndSaveTokenMintedEvent(
  ethereumEvent: TokensMinted
): void {
  let id = getEventId(ethereumEvent);
  let event = new TokenMintedEvent(id);

  let userTokenBalanceId = getUserBalanceId(
    ethereumEvent.params.target.toHexString(),
    ethereumEvent.params.token.toHexString(),
    ethereumEvent.params.tokenType
  );

  event.timestamp = ethereumEvent.block.timestamp;
  event.block = ethereumEvent.block.number;
  event.tx_hash = ethereumEvent.transaction.hash.toHexString();
  event.token = ethereumEvent.params.token.toHexString();
  event.userTokenBalance = userTokenBalanceId;
  event.universe = ethereumEvent.params.universe.toHexString();
  event.amount = ethereumEvent.params.amount;

  event.save();
}

export function createAndSaveTokenBurnedEvent(
  ethereumEvent: TokensBurned
): void {
  let id = getEventId(ethereumEvent);
  let event = new TokenBurnedEvent(id);

  let userTokenBalanceId = getUserBalanceId(
    ethereumEvent.params.target.toHexString(),
    ethereumEvent.params.token.toHexString(),
    ethereumEvent.params.tokenType
  );

  event.timestamp = ethereumEvent.block.timestamp;
  event.block = ethereumEvent.block.number;
  event.tx_hash = ethereumEvent.transaction.hash.toHexString();
  event.token = ethereumEvent.params.token.toHexString();
  event.userTokenBalance = userTokenBalanceId;
  event.universe = ethereumEvent.params.universe.toHexString();
  event.amount = ethereumEvent.params.amount;

  event.save();
}

export function createAndSaveTokenTransferredEvents(
  ethereumEvent: TokensTransferred
): void {
  let idFrom = getEventId(ethereumEvent).concat("-FROM");
  let idTo = getEventId(ethereumEvent).concat("-TO");
  let eventFrom = new TokenTransferredEvent(idFrom);
  let eventTo = new TokenTransferredEvent(idTo);

  let userTokenBalanceIdFrom = getUserBalanceId(
    ethereumEvent.params.from.toHexString(),
    ethereumEvent.params.token.toHexString(),
    ethereumEvent.params.tokenType
  );
  let userTokenBalanceIdTo = getUserBalanceId(
    ethereumEvent.params.to.toHexString(),
    ethereumEvent.params.token.toHexString(),
    ethereumEvent.params.tokenType
  );

  eventFrom.timestamp = ethereumEvent.block.timestamp;
  eventFrom.block = ethereumEvent.block.number;
  eventFrom.tx_hash = ethereumEvent.transaction.hash.toHexString();
  eventFrom.token = ethereumEvent.params.token.toHexString();
  eventFrom.userTokenBalance = userTokenBalanceIdFrom;
  eventFrom.amount = ethereumEvent.params.value;
  eventFrom.from = ethereumEvent.params.from.toHexString();
  eventFrom.to = ethereumEvent.params.to.toHexString();
  eventFrom.relatedEvent = eventTo.id;
  eventFrom.universe = ethereumEvent.params.universe.toHexString();
  eventFrom.isSender = true;

  eventTo.timestamp = ethereumEvent.block.timestamp;
  eventTo.block = ethereumEvent.block.number;
  eventTo.tx_hash = ethereumEvent.transaction.hash.toHexString();
  eventTo.token = ethereumEvent.params.token.toHexString();
  eventTo.userTokenBalance = userTokenBalanceIdTo;
  eventTo.amount = ethereumEvent.params.value;
  eventTo.from = ethereumEvent.params.from.toHexString();
  eventTo.to = ethereumEvent.params.to.toHexString();
  eventTo.relatedEvent = eventFrom.id;
  eventTo.universe = ethereumEvent.params.universe.toHexString();
  eventTo.isSender = false;

  eventFrom.save();
  eventTo.save();
}

export function getOrCreateShareToken(
  id: String,
  createIfNotFound: boolean = true
): ShareToken {
  let token = ShareToken.load(id);

  if (token == null && createIfNotFound) {
    token = new ShareToken(id);

    token.balance = BIGINT_ZERO;
  }

  return token as ShareToken;
}

export function getTokenTypeFromInt(numericalType: i32): String {
  return tokenTypes[numericalType];
}

export function getOrCreateParaShareToken(id: string, cash: string): ParaShareToken {
  let token = ParaShareToken.load(id);

  if (token == null) {
    token = new ParaShareToken(id);
    token.cash = cash;
  }

  return token as ParaShareToken;
}
