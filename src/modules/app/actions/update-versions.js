export const UPDATE_VERSIONS = "UPDATE_VERSIONS";

export function updateVersions(versions) {
  return {
    type: UPDATE_VERSIONS,
    data: versions
  };
}
