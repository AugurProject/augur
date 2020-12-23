import {
  Market,
  MigrateMarketEvent,
  FinalizeMarketEvent,
  CreateMarketEvent,
  TransferMarketEvent,
  OIChangeMarketEvent,
  VolumeChangeMarketEvent,
  MarketReport,
  Outcome,
  MarketTemplate,
  MarketTemplateInput
} from "../../../generated/schema";
import {
  MarketCreated,
  MarketTransferred,
  MarketMigrated,
  MarketFinalized,
  MarketOIChanged,
} from "../../../generated/Augur/Augur";
import {
  MarketVolumeChanged
} from "../../../generated/AugurTrading/AugurTrading"
import {
  ethereum,
  Bytes,
  BigInt,
  log,
  JSONValueKind,
  JSONValue
} from "@graphprotocol/graph-ts";
import { marketTypes, YES_NO, SCALAR, CATEGORICAL } from "../constants";

export function getOrCreateMarket(
  id: String,
  createIfNotFound: boolean = true
): Market {
  let market = Market.load(id);

  if (market == null && createIfNotFound) {
    market = new Market(id);
  }

  return market as Market;
}

export function createAndSaveCreateMarketEvent(
  ethereumEvent: MarketCreated
): void {
  let id = getEventId(ethereumEvent);
  let event = new CreateMarketEvent(id);

  event.market = ethereumEvent.params.market.toHexString();
  event.timestamp = ethereumEvent.block.timestamp;
  event.block = ethereumEvent.block.number;
  event.tx_hash = ethereumEvent.transaction.hash.toHexString();
  event.universe = ethereumEvent.params.universe.toHexString();
  event.endTime = ethereumEvent.params.endTime;
  event.extraInfo = ethereumEvent.params.extraInfo;
  event.marketCreator = ethereumEvent.params.marketCreator.toHexString();
  event.designatedReporter = ethereumEvent.params.designatedReporter.toHexString();
  event.feePerCashInAttoCash = ethereumEvent.params.feePerCashInAttoCash;
  event.prices = ethereumEvent.params.prices;
  event.marketTypeRaw = ethereumEvent.params.marketType;
  event.marketType = getMarketTypeFromInt(ethereumEvent.params.marketType);
  event.numTicks = ethereumEvent.params.numTicks;
  event.outcomes = ethereumEvent.params.outcomes;
  event.noShowBond = ethereumEvent.params.noShowBond;
  event.creationTimestamp = ethereumEvent.params.timestamp;

  event.save();
}

export function createAndSaveFinalizeMarketEvent(
  ethereumEvent: MarketFinalized
): void {
  let id = getEventId(ethereumEvent);
  let event = new FinalizeMarketEvent(id);

  event.market = ethereumEvent.params.market.toHexString();
  event.timestamp = ethereumEvent.block.timestamp;
  event.block = ethereumEvent.block.number;
  event.tx_hash = ethereumEvent.transaction.hash.toHexString();
  event.finalizeTimestamp = ethereumEvent.params.timestamp;
  event.winningPayoutNumerators = ethereumEvent.params.winningPayoutNumerators;

  event.save();
}

export function createAndSaveTransferMarketEvent(
  ethereumEvent: MarketTransferred
): void {
  let id = getEventId(ethereumEvent);
  let event = new TransferMarketEvent(id);

  event.market = ethereumEvent.params.market.toHexString();
  event.timestamp = ethereumEvent.block.timestamp;
  event.block = ethereumEvent.block.number;
  event.tx_hash = ethereumEvent.transaction.hash.toHexString();

  event.universe = ethereumEvent.params.universe.toHexString();
  event.from = ethereumEvent.params.from.toHexString();
  event.to = ethereumEvent.params.to.toHexString();

  event.save();
}

export function createAndSaveMigrateMarketEvent(
  ethereumEvent: MarketMigrated
): void {
  let id = getEventId(ethereumEvent);
  let event = new MigrateMarketEvent(id);

  event.market = ethereumEvent.params.market.toHexString();
  event.timestamp = ethereumEvent.block.timestamp;
  event.block = ethereumEvent.block.number;
  event.tx_hash = ethereumEvent.transaction.hash.toHexString();

  event.originalUniverse = ethereumEvent.params.originalUniverse.toHexString();
  event.newUniverse = ethereumEvent.params.newUniverse.toHexString();

  event.save();
}

export function createAndSaveOIChangeMarketEvent(
  ethereumEvent: MarketOIChanged
): void {
  let id = getEventId(ethereumEvent);
  let event = new OIChangeMarketEvent(id);

  event.market = ethereumEvent.params.market.toHexString();
  event.timestamp = ethereumEvent.block.timestamp;
  event.block = ethereumEvent.block.number;
  event.tx_hash = ethereumEvent.transaction.hash.toHexString();

  event.openInterest = ethereumEvent.params.marketOI;

  event.save();
}

export function createAndSaveVolumeChangeMarketEvent(
  ethereumEvent: MarketVolumeChanged
): void {
  let id = getEventId(ethereumEvent);
  let event = new VolumeChangeMarketEvent(id);

  event.market = ethereumEvent.params.market.toHexString();
  event.timestamp = ethereumEvent.block.timestamp;
  event.block = ethereumEvent.block.number;
  event.tx_hash = ethereumEvent.transaction.hash.toHexString();

  event.volume = ethereumEvent.params.volume;
  event.outcomeVolumes = ethereumEvent.params.outcomeVolumes
  event.totalTrades = ethereumEvent.params.totalTrades;

  event.save();
}

export function getEventId(event: ethereum.Event): String {
  return event.transaction.hash
    .toHexString()
    .concat("-")
    .concat(event.logIndex.toHexString());
}

export function getMarketTypeFromInt(numericalType: i32): String {
  return marketTypes[numericalType];
}

export function getOrCreateMarketReport(
  id: String,
  createIfNotFound: boolean = true
): MarketReport {
  let marketReport = MarketReport.load(id);

  if (marketReport == null && createIfNotFound) {
    marketReport = new MarketReport(id);

    marketReport.market = id;
    marketReport.isFinal = false;
    marketReport.isInitialReport = true;
  }

  return marketReport as MarketReport;
}

function getOutcomesAmountForMarketType(
  outcomes: Bytes[],
  marketType: String
): i32 {
  if (marketType == SCALAR || marketType == YES_NO) {
    return 3;
  } else {
    return outcomes.length;
  }
}

function createInvalidOutcome(marketId: String): String {
  let outcome = getOrCreateOutcome(marketId.concat("-0"));
  outcome.market = marketId;
  outcome.value = "INVALID";

  outcome.save();
  return outcome.id;
}

export function getOrCreateOutcome(
  id: String,
  createIfNotFound: boolean = true
): Outcome {
  let outcome = Outcome.load(id);

  if (outcome == null && createIfNotFound) {
    outcome = new Outcome(id);

    outcome.isFinalNumerator = false;
  }

  return outcome as Outcome;
}

export function createOutcomesForMarket(
  outcomes: Bytes[],
  marketType: String,
  marketId: String
): i32 {
  let outcomeAmount = getOutcomesAmountForMarketType(outcomes, marketType);
  let numOutcomes = 1;
  createInvalidOutcome(marketId);

  if (marketType == SCALAR) {
    let shortOutcome = getOrCreateOutcome(marketId.concat("-1"));
    let longOutcome = getOrCreateOutcome(marketId.concat("-2"));

    shortOutcome.market = marketId;
    shortOutcome.value = "SHORT";

    longOutcome.market = marketId;
    longOutcome.value = "LONG";

    shortOutcome.save();
    longOutcome.save();

    numOutcomes = 3;
  } else if (marketType == YES_NO) {
    let noOutcome = getOrCreateOutcome(marketId.concat("-1"));
    let yesOutcome = getOrCreateOutcome(marketId.concat("-2"));

    noOutcome.market = marketId;
    noOutcome.value = "NO";

    yesOutcome.market = marketId;
    yesOutcome.value = "YES";

    noOutcome.save();
    yesOutcome.save();

    numOutcomes = 3;
  } else if (marketType == CATEGORICAL) {
    let outcomeId = "";
    for (let i = 0; i < outcomeAmount; i++) {
      let id = i + 1; // because invalid is not present in the outcome list for categoricals
      outcomeId = marketId.concat("-").concat(id.toString());

      let outcome = getOrCreateOutcome(outcomeId);
      outcome.value = outcomes[i].toString();
      outcome.valueRaw = outcomes[i];
      outcome.market = marketId;
      outcome.save();

      numOutcomes++;
    }
  } else {
    log.error("Market type invalid: {}. Market ID: {}", [marketType, marketId]);
    return 0;
  }
  return numOutcomes;
}

export function updateOutcomesForMarket(
  marketId: String,
  payoutNumerators: BigInt[],
  isFinal: boolean
): void {
  let market = getOrCreateMarket(marketId);
  for (let i = 0; i < payoutNumerators.length; i++) {
    let outcomeId = marketId.concat("-").concat(i.toString());
    let outcome = getOrCreateOutcome(outcomeId, false);
    if (outcome == null) {
      log.error("Outcome {} doesn't exist...", [outcomeId]);
    } else {
      outcome.payoutNumerator = payoutNumerators[i];
      outcome.isFinalNumerator = isFinal;
      outcome.save();
    }
  }
}

export function getOrCreateMarketTemplate(
  json: JSONValue,
  marketId: String,
  createIfNotFound: boolean = true
): String | null {
  let jsonObject = json.toObject();
  let hash = jsonObject.get("hash");
  if (hash.kind == JSONValueKind.STRING) {
    let template = MarketTemplate.load(hash.toString());

    if (template == null && createIfNotFound) {
      template = new MarketTemplate(hash.toString());

      let question = jsonObject.get("question");
      if (question.kind == JSONValueKind.STRING) {
        template.question = question.toString();
      }
    }

    let inputs = jsonObject.get("inputs");
    if (inputs.kind == JSONValueKind.ARRAY) {
      createInputsForMarketTemplate(
        inputs.toArray(),
        hash.toString(),
        marketId
      );
    }

    template.save();

    return template.id;
  } else {
    log.warning("Couldn't parse market template for market {}", [marketId]);
    return null;
  }
}

function createInputsForMarketTemplate(
  inputs: Array<JSONValue>,
  templateId: String,
  marketId: String
): void {
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].kind == JSONValueKind.OBJECT) {
      createMarketTemplateInput(inputs[i], templateId, marketId);
    }
  }
}

function createMarketTemplateInput(
  json: JSONValue,
  templateId: String,
  marketId: String
): void {
  let jsonObject = json.toObject();
  let internalId = jsonObject.get("id");
  if (internalId.kind == JSONValueKind.NUMBER) {
    let id = templateId.concat('-').concat(marketId).concat('-').concat(internalId.toBigInt().toString())
    let input = MarketTemplateInput.load(id);

    if (input == null) {
      input = new MarketTemplateInput(id);
      input.internalId = internalId.toBigInt();

      let value = jsonObject.get("value")
      if(value.kind == JSONValueKind.STRING) {
        input.value = value.toString();
      }

      let type = jsonObject.get("type")
      if(type.kind == JSONValueKind.STRING) {
        input.type = type.toString();
      }

      let timestamp = jsonObject.get("timestamp")
      if(timestamp.kind == JSONValueKind.NUMBER) {
        input.timestamp = timestamp.toBigInt();
      }

      input.market = marketId;
      input.template = templateId;

      input.save();

    }
  } else {
    log.warning("Couldn't parse input for template {} and market {}", [
      templateId,
      marketId
    ]);
  }
}
