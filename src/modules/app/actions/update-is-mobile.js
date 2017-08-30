export const UPDATE_IS_MOBILE = 'UPDATE_IS_MOBILE'

export function updateIsMobile(isMobile) {
  return {
    type: UPDATE_IS_MOBILE,
    data: {
      isMobile
    }
  }
}
