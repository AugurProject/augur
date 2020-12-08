import {
  Bytes,
  json,
  JSONValueKind,
  JSONValue
} from "@graphprotocol/graph-ts";
import { BigDecimal } from '@graphprotocol/graph-ts/index';
import {
  MarketCreated,
  MarketTransferred,
  MarketMigrated,
  MarketFinalized,
  MarketOIChanged,
} from "../../generated/Augur/Augur";
import {
  MarketVolumeChanged
} from "../../generated/AugurTrading/AugurTrading"
import { Universe } from '../../generated/schema';
import {
  getOrCreateUniverse,
  getOrCreateUser,
  getOrCreateMarket,
  getOrCreateMarketReport,
  getOrCreateDispute,
  createAndSaveCreateMarketEvent,
  createAndSaveMigrateMarketEvent,
  createAndSaveTransferMarketEvent,
  createAndSaveFinalizeMarketEvent,
  createAndSaveOIChangeMarketEvent,
  createAndSaveVolumeChangeMarketEvent,
  getMarketTypeFromInt,
  createOutcomesForMarket,
  updateOutcomesForMarket,
  getOrCreateMarketTemplate
} from "../utils/helpers";
import {
  STATUS_TRADING,
  STATUS_FINALIZED,
} from "../utils/constants";

// - event: MarketCreated(indexed address,uint256,string,address,indexed address,address,uint256,int256[],uint8,uint256,bytes32[],uint256,uint256)
//   handler: handleMarketCreated

// MarketCreated(contract IUniverse universe, uint256 endTime, string extraInfo,
// contract IMarket market, address marketCreator, address designatedReporter,
// uint256 feePerCashInAttoCash, int256[] prices, enum IMarket.MarketType marketType,
// uint256 numTicks, bytes32[] outcomes, uint256 noShowBond, uint256 timestamp)

export function handleMarketCreated(event: MarketCreated): void {
  let universe = Universe.load(event.params.universe.toHexString());
  if (universe == null) {
    // Universe is in another deploy. Ignore it.
    return;
  }

  let market = getOrCreateMarket(event.params.market.toHexString());
  let creator = getOrCreateUser(event.params.marketCreator.toHexString());
  let designatedReporter = getOrCreateUser(
    event.params.designatedReporter.toHexString()
  );

  market.creator = creator.id;
  market.universe = universe.id;
  market.owner = creator.id;
  market.numTicks = event.params.numTicks;
  market.designatedReporter = designatedReporter.id;
  market.endTimestamp = event.params.endTime;
  market.prices = event.params.prices;
  market.marketTypeRaw = event.params.marketType;
  market.marketType = getMarketTypeFromInt(event.params.marketType);
  market.timestamp = event.params.timestamp;
  market.noShowBond = event.params.noShowBond;
  market.status = STATUS_TRADING;
  market.numOutcomes = createOutcomesForMarket(
    event.params.outcomes,
    market.marketType,
    market.id
  );
  market.extraInfoRaw = event.params.extraInfo;

  // Parsing the JSON data, safe check of every parsed value before saving.
  let extraInfoParsed = json.try_fromBytes(
    Bytes.fromUTF8(market.extraInfoRaw) as Bytes
  );
  let isOk = extraInfoParsed.isOk;
  if (isOk) {
    let extraInfoObject = extraInfoParsed.value.toObject();
    let description = extraInfoObject.get("description");
    if (description.kind == JSONValueKind.STRING) {
      market.description = description.toString();
    }

    let longDescription = extraInfoObject.get("longDescription");
    if (longDescription.kind == JSONValueKind.STRING) {
      market.longDescription = longDescription.toString();
    }

    let categories = extraInfoObject.get("categories")
    if (categories.kind == JSONValueKind.ARRAY) {
      let categoryArray = categories.toArray()
      let resultingArray = new Array<String>()
      for(let i = 0; i < categoryArray.length; i++) {
        if(categoryArray[i].kind == JSONValueKind.STRING) {
          resultingArray.push(categoryArray[i].toString())
        }
      }
      market.categories = resultingArray;
    }

    let scalarDenomination = extraInfoObject.get("_scalarDenomination");
    if(scalarDenomination.kind == JSONValueKind.BOOL) {
      market.scalarDenomination = scalarDenomination.toBool();
    }

    let offsetName = extraInfoObject.get("offsetName");
    if(offsetName.kind == JSONValueKind.STRING) {
      market.offsetName = offsetName.toString();
    }

    let template = extraInfoObject.get("template");
    if(template.kind == JSONValueKind.OBJECT) {
      // This creates a market template if possible, and returns its' id or null if it can't be parsed
      market.template = getOrCreateMarketTemplate(template as JSONValue, market.id) as String;
    }
  }

  market.save();

  universe.save();

  creator.save();

  createAndSaveCreateMarketEvent(event);
}

// - event: MarketFinalized(indexed address,indexed address,uint256,uint256[])
//   handler: handleMarketFinalized

// MarketFinalized(address universe, address market, uint256 timestamp, uint256[] winningPayoutNumerators)

export function handleMarketFinalized(event: MarketFinalized): void {
  let market = getOrCreateMarket(event.params.market.toHexString());
  let dispute = getOrCreateDispute(event.params.market.toHexString());
  let marketReport = getOrCreateMarketReport(event.params.market.toHexString());

  dispute.isDone = true;

  market.status = STATUS_FINALIZED;

  marketReport.isFinal = true;
  marketReport.payoutNumerators = event.params.winningPayoutNumerators;

  marketReport.save();
  market.save();
  dispute.save();

  createAndSaveFinalizeMarketEvent(event);

  updateOutcomesForMarket(market.id, marketReport.payoutNumerators, true);
}

// - event: MarketTransferred(indexed address,indexed address,address,address)
//   handler: handleMarketTransferred

// MarketTransferred(address universe, address market, address from, address to)

export function handleMarketTransferred(event: MarketTransferred): void {
  let market = getOrCreateMarket(event.params.market.toHexString());
  let newOwner = getOrCreateUser(event.params.to.toHexString());

  market.owner = newOwner.id;
  market.save();

  newOwner.save();

  createAndSaveTransferMarketEvent(event);
}

// - event: MarketMigrated(indexed address,indexed address,address)
//   handler: handleMarketTransferred

// MarketMigrated(address market, address originalUniverse, address newUniverse)

export function handleMarketMigrated(event: MarketMigrated): void {
  let market = getOrCreateMarket(event.params.market.toHexString());
  let originalUniverse = getOrCreateUniverse(
    event.params.originalUniverse.toHexString()
  );
  let newUniverse = getOrCreateUniverse(event.params.newUniverse.toHexString());

  market.universe = newUniverse.id;
  market.save();

  originalUniverse.save();

  newUniverse.save();

  createAndSaveMigrateMarketEvent(event);
}

// - event: MarketOIChanged(indexed address,indexed address,uint256)
//   handler: handleMarketOIChanged

export function handleMarketOIChanged(event: MarketOIChanged): void {
  let market = getOrCreateMarket(event.params.market.toHexString());
  market.openInterest = event.params.marketOI;
  market.save();

  createAndSaveOIChangeMarketEvent(event);
}

// - event: MarketVolumeChanged(indexed address,indexed address,uint256,uint256[],uint256,uint256)
//   handler: handleMarketVolumeChanged

export function handleMarketVolumeChanged(event: MarketVolumeChanged): void {
  let market = getOrCreateMarket(event.params.market.toHexString());
  market.outcomeVolumes = event.params.outcomeVolumes
  market.totalTrades = event.params.totalTrades;
  market.save();

  createAndSaveVolumeChangeMarketEvent(event);
}
