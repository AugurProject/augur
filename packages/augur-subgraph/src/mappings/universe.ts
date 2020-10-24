import { Address, BigInt, Bytes, Value, log } from "@graphprotocol/graph-ts";
import {
  UniverseCreated,
  UniverseForked,
  ReportingFeeChanged,
  ValidityBondChanged,
  NoShowBondChanged,
  WarpSyncDataUpdated,
  DesignatedReportStakeChanged
} from "../../generated/Augur/Augur";
import { getOrCreateUniverse } from "../utils/helpers";
import { ZERO_ADDRESS, BIGINT_ONE, BIGINT_ZERO } from "../utils/constants";
import { toDecimal } from "../utils/decimals";

// - event: UniverseCreated(indexed address,indexed address,uint256[],uint256)
//   handler: handleUniverseCreated

// UniverseCreated(address parentUniverse, address childUniverse, uint256[] payoutNumerators, uint256 creationTimestamp)

export function handleUniverseCreated(event: UniverseCreated): void {
  let childUniverse = getOrCreateUniverse(
    event.params.childUniverse.toHexString()
  );

  if (event.params.parentUniverse.toHexString() != ZERO_ADDRESS) {
    let parentUniverse = getOrCreateUniverse(
      event.params.parentUniverse.toHexString()
    );
    parentUniverse.save();

    childUniverse.parentUniverse = parentUniverse.id;
  }

  childUniverse.payoutNumerators = event.params.payoutNumerators;
  childUniverse.creationTimestamp = event.params.creationTimestamp;
  childUniverse.save();
}

// - event: UniverseForked(indexed address,address)
//   handler: handleUniverseForked

// UniverseForked(address universe, contract IMarket forkingMarket)

export function handleUniverseForked(event: UniverseForked): void {}

// - event: ReportingFeeChanged(indexed address,uint256)
//   handler: handleReportingFeeChanged

export function handleReportingFeeChanged(event: ReportingFeeChanged): void {
  let universe = getOrCreateUniverse(event.params.universe.toHexString());

  universe.reportingFee = event.params.reportingFee;
  universe.save();
}

// - event: DesignatedReportStakeChanged(indexed address,uint256)
//   handler: handleDesignatedReportStakeChanged

export function handleDesignatedReportStakeChanged(event: DesignatedReportStakeChanged): void {
  let universe = getOrCreateUniverse(event.params.universe.toHexString());

  universe.designatedReportStake = event.params.designatedReportStake;
  universe.save();
}

// - event: NoShowBondChanged(indexed address,uint256)
//   handler: handleNoShowBondChanged

export function handleNoShowBondChanged(event: NoShowBondChanged): void {
  let universe = getOrCreateUniverse(event.params.universe.toHexString());

  universe.noShowBond = event.params.noShowBond;
  universe.save();
}

// - event: ValidityBondChanged(indexed address,uint256)
//   handler: handleValidityBondChanged

export function handleValidityBondChanged(event: ValidityBondChanged): void {
  let universe = getOrCreateUniverse(event.params.universe.toHexString());

  universe.validityBond = event.params.validityBond;
  universe.save();
}

// - event: WarpSyncDataUpdated(indexed address,uint256,uint256)
//   handler: handleWarpSyncDataUpdated

export function handleWarpSyncDataUpdated(event: WarpSyncDataUpdated): void {
  let universe = getOrCreateUniverse(event.params.universe.toHexString());

  universe.warpSyncHash = event.params.warpSyncHash;
  universe.save();
}
