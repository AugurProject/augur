export const UPDATE_HEADER_HEIGHT = 'UPDATE_HEADER_HEIGHT'

export function updateHeaderHeight(headerHeight) {
  return {
    type: UPDATE_HEADER_HEIGHT,
    data: {
      headerHeight
    }
  }
}
