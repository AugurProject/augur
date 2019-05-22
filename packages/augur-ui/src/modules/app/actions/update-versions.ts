import { Versions, BaseVersion } from "modules/types";

export const UPDATE_VERSIONS = "UPDATE_VERSIONS";

export function updateVersions(versions: Versions): BaseVersion {
  return {
    type: UPDATE_VERSIONS,
    data: versions
  };
}
