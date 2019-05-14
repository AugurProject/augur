export const UPDATE_VERSIONS = "UPDATE_VERSIONS";

interface Versions {
  augurNode: String;
  augurjs: String;
  augurui: String;
}

export function updateVersions(versions: Versions) {
  return {
    type: UPDATE_VERSIONS,
    data: versions
  };
}
