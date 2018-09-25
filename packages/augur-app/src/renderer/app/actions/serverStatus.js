export const UPDATE_SERVER_ATTRIB = 'UPDATE_SERVER_ATTRIB'

export function updateServerAttrib(attrib) {
  return {
    type: UPDATE_SERVER_ATTRIB,
    attrib
  }
}
