export const UPDATE_VERSIONS = "UPDATE_VERSIONS";

interface Versions {
  augurNode: string;
  augurjs: string;
  augurui: string;
}

export function updateVersions(versions: Versions) {
  return {
    type: UPDATE_VERSIONS,
    data: versions
  };
}
