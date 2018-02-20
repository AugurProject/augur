import { getOverrideTimestamp } from "../blockchain/process-block";

export function getCurrentTime(): number {
  return  getOverrideTimestamp() || Date.now() / 1000;
}
