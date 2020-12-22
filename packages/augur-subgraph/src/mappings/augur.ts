import {
  TimestampSet,
  RegisterContract,
  FinishDeployment
} from "../../generated/Augur/Augur";
import { getOrCreateAugur, getOrCreateContract } from "../utils/helpers";

export function handleTimestampSet(event: TimestampSet): void {
  let augur = getOrCreateAugur();

  augur.timestamp = event.params.newTimestamp;

  augur.save();
}

export function handleRegisterContract(event: RegisterContract): void {
  let augur = getOrCreateAugur();
  let contract = getOrCreateContract(event.params.key.toString())

  contract.address = event.params.contractAddress.toHexString();
  contract.augur = augur.id;
  contract.lastModified = event.block.timestamp;

  contract.save();
}

export function handleFinishDeployment(event: FinishDeployment): void {
  let augur = getOrCreateAugur();

  augur.deployBlock = event.block.number;
  augur.deployTx_hash = event.transaction.hash.toHexString();
  augur.deployTimestamp = event.block.timestamp;

  augur.save();
}
