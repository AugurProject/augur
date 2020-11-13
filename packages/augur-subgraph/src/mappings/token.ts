import { Address, BigInt, Bytes, Value, log } from "@graphprotocol/graph-ts";
import {
  TokensMinted,
  TokensBurned,
  TokensTransferred,
  TokenBalanceChanged,
  ShareTokenBalanceChanged
} from "../../generated/Augur/Augur";
import {
  getOrCreateShareToken,
  getOrCreateUser,
  getTokenTypeFromInt,
  createAndSaveTokenBurnedEvent,
  createAndSaveTokenMintedEvent,
  createAndSaveTokenTransferredEvents,
  getOrCreateUserReputationTokenBalance,
  getOrCreateUserDisputeTokenBalance,
  getOrCreateUserParticipationTokenBalance,
  getUserBalanceId,
  getOrCreateToken
} from "../utils/helpers";
import {
  ZERO_ADDRESS,
  BIGINT_ONE,
  BIGINT_ZERO,
  REPUTATION_TOKEN,
  PARTICIPATION_TOKEN,
  DISPUTE_CROWDSOURCER
} from "../utils/constants";
import { toDecimal } from "../utils/decimals";

// - event: TokensMinted(indexed address,indexed address,indexed address,uint256,uint8,address,uint256)
//   handler: handleTokensMinted

// TokensMinted(address universe, address token, address target, uint256 amount,
// enum Augur.TokenType tokenType, address market, uint256 totalSupply)

export function handleTokensMinted(event: TokensMinted): void {
  let token = getOrCreateToken(
    event.params.token.toHexString(),
    event.params.tokenType,
    event.params.universe.toHexString()
  );
  createAndSaveTokenMintedEvent(event);
}

// - event: TokensBurned(indexed address,indexed address,indexed address,uint256,uint8,address,uint256)
//   handler: handleTokensBurned

// TokensBurned(address universe, address token, address target, uint256 amount,
// enum Augur.TokenType tokenType, address market, uint256 totalSupply)

export function handleTokensBurned(event: TokensBurned): void {
  let token = getOrCreateToken(
    event.params.token.toHexString(),
    event.params.tokenType,
    event.params.universe.toHexString()
  );
  createAndSaveTokenBurnedEvent(event);
}

// - event: TokensTransferred(indexed address,address,indexed address,indexed address,uint256,uint8,address)
//   handler: handleTokensTransferred

// TokensTransferred(address universe, address token, address from, address to,
// uint256 value, enum Augur.TokenType tokenType, address market)

export function handleTokensTransferred(event: TokensTransferred): void {
  let token = getOrCreateToken(
    event.params.token.toHexString(),
    event.params.tokenType,
    event.params.universe.toHexString()
  );
  createAndSaveTokenTransferredEvents(event);
}

// - event: TokenBalanceChanged(indexed address,indexed address,address,uint8,address,uint256,uint256)
//   handler: handleTokenBalanceChanged

// TokenBalanceChanged(address universe, address owner, address token,
// enum Augur.TokenType tokenType, address market, uint256 balance, uint256 outcome)

export function handleTokenBalanceChanged(event: TokenBalanceChanged): void {
  let tokenType = getTokenTypeFromInt(event.params.tokenType);
  let targetUser = getOrCreateUser(event.params.owner.toHexString());
  let token = getOrCreateToken(
    event.params.token.toHexString(),
    event.params.tokenType,
    event.params.universe.toHexString()
  );

  let userTokenBalanceId = getUserBalanceId(
    event.params.owner.toHexString(),
    event.params.token.toHexString(),
    event.params.tokenType
  );

  if (tokenType == REPUTATION_TOKEN) {
    let userTokenBalance = getOrCreateUserReputationTokenBalance(
      userTokenBalanceId
    );
    userTokenBalance.user = targetUser.id;
    userTokenBalance.universe = event.params.universe.toHexString();
    userTokenBalance.token = event.params.token.toHexString();
    userTokenBalance.balance = event.params.balance;
    userTokenBalance.attoBalance = toDecimal(event.params.balance);
    userTokenBalance.save();
  } else if (tokenType == DISPUTE_CROWDSOURCER) {
    let userTokenBalance = getOrCreateUserDisputeTokenBalance(
      userTokenBalanceId
    );
    userTokenBalance.token = event.params.token.toHexString();
    userTokenBalance.market = event.params.market.toHexString();
    userTokenBalance.universe = event.params.universe.toHexString();
    userTokenBalance.user = targetUser.id;
    userTokenBalance.outcome = event.params.outcome;
    userTokenBalance.balance = event.params.balance;
    userTokenBalance.attoBalance = toDecimal(event.params.balance);
    userTokenBalance.save();
  } else if (tokenType == PARTICIPATION_TOKEN) {
    let userTokenBalance = getOrCreateUserParticipationTokenBalance(
      userTokenBalanceId
    );
    userTokenBalance.user = targetUser.id;
    userTokenBalance.token = event.params.token.toHexString();
    userTokenBalance.universe = event.params.universe.toHexString();
    userTokenBalance.balance = event.params.balance;
    userTokenBalance.attoBalance = toDecimal(event.params.balance);
    userTokenBalance.save();
  } else {
    log.error("Invalid token type, type: '{}'", [tokenType]);
    return;
  }
}

// - event: ShareTokenBalanceChanged(indexed address,indexed address,indexed address,uint256,uint256)
//   handler: handleShareTokenBalanceChanged

export function handleShareTokenBalanceChanged(
  event: ShareTokenBalanceChanged
): void {
  let user = getOrCreateUser(event.params.account.toHexString());
  let outcomeId = event.params.market
    .toHexString()
    .concat("-")
    .concat(event.params.outcome.toString());
  let shareTokenId = event.params.market
    .toHexString()
    .concat("-")
    .concat(user.id)
    .concat("-")
    .concat(event.params.outcome.toString());
  let shareToken = getOrCreateShareToken(shareTokenId);
  shareToken.balance = event.params.balance;
  shareToken.outcomeRaw = event.params.outcome;
  shareToken.outcome = outcomeId;
  shareToken.market = event.params.market.toHexString();
  shareToken.owner = user.id;
  shareToken.save();
}
