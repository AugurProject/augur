import { Address, BigDecimal, BigInt, Bytes, crypto, log } from '@graphprotocol/graph-ts';
import { toChecksumAddress, mapAddressArray, mapByteArray, mapArray, bigIntToHexString } from './utils';
import {
  CompleteSetsPurchased as CompleteSetsPurchasedEvent,
  CompleteSetsSold as CompleteSetsSoldEvent,
  FinishDeployment as FinishDeploymentEvent,
  MarketOIChanged as MarketOIChangedEvent,
  RegisterContract as RegisterContractEvent,
  ReportingFeeChanged as ReportingFeeChangedEvent,
  ShareTokenBalanceChanged as ShareTokenBalanceChangedEvent,
  TradingProceedsClaimed as TradingProceedsClaimedEvent,
} from '../generated/templates/ParaAugur/ParaAugur';

import {
  CompleteSetsPurchased as CompleteSetsPurchasedEntity,
  CompleteSetsSold as CompleteSetsSoldEntity,
  FinishDeployment as FinishDeploymentEntity,
  MarketOIChanged as MarketOIChangedEntity,
  RegisterContract as RegisterContractEntity,
  ReportingFeeChanged as ReportingFeeChangedEntity,
  ShareTokenBalanceChanged as ShareTokenBalanceChangedEntity,
  TradingProceedsClaimed as TradingProceedsClaimedEntity,
} from '../generated/schema';

export function handleCompleteSetsPurchased(event: CompleteSetsPurchasedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new CompleteSetsPurchasedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "CompleteSetsPurchased";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.account = toChecksumAddress(event.params.account);
  entity.numCompleteSets = bigIntToHexString(event.params.numCompleteSets);
  entity.timestamp = bigIntToHexString(event.params.timestamp);
  entity.para = toChecksumAddress(event.params.para);

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

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.account = toChecksumAddress(event.params.account);
  entity.numCompleteSets = bigIntToHexString(event.params.numCompleteSets);
  entity.fees = bigIntToHexString(event.params.fees);
  entity.timestamp = bigIntToHexString(event.params.timestamp);
  entity.para = toChecksumAddress(event.params.para);

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

export function handleMarketOIChanged(event: MarketOIChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketOIChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "MarketOIChanged";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.marketOI = bigIntToHexString(event.params.marketOI);
  entity.para = toChecksumAddress(event.params.para);

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

  entity.contractAddress = toChecksumAddress(event.params.contractAddress);
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

  entity.universe = toChecksumAddress(event.params.universe);
  entity.reportingFee = bigIntToHexString(event.params.reportingFee);
  entity.para = toChecksumAddress(event.params.para);

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

  entity.universe = toChecksumAddress(event.params.universe);
  entity.account = toChecksumAddress(event.params.account);
  entity.market = toChecksumAddress(event.params.market);
  entity.outcome = bigIntToHexString(event.params.outcome);
  entity.balance = bigIntToHexString(event.params.balance);
  entity.para = toChecksumAddress(event.params.para);

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

  entity.universe = toChecksumAddress(event.params.universe);
  entity.sender = toChecksumAddress(event.params.sender);
  entity.market = toChecksumAddress(event.params.market);
  entity.outcome = bigIntToHexString(event.params.outcome);
  entity.numShares = bigIntToHexString(event.params.numShares);
  entity.numPayoutTokens = bigIntToHexString(event.params.numPayoutTokens);
  entity.fees = bigIntToHexString(event.params.fees);
  entity.timestamp = bigIntToHexString(event.params.timestamp);
  entity.para = toChecksumAddress(event.params.para);

  entity.save();
}
