export const UPDATE_FOOTER_HEIGHT = 'UPDATE_FOOTER_HEIGHT'

export function updateFooterHeight(footerHeight) {
  return {
    type: UPDATE_FOOTER_HEIGHT,
    data: {
      footerHeight
    }
  }
}
