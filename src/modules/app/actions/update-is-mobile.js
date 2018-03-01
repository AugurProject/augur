export const UPDATE_IS_MOBILE = 'UPDATE_IS_MOBILE'
export const UPDATE_IS_MOBILE_SMALL = 'UPDATE_IS_MOBILE_SMALL'

export function updateIsMobile(isMobile) {
  return {
    type: UPDATE_IS_MOBILE,
    data: {
      isMobile,
    },
  }
}

export function updateIsMobileSmall(isMobileSmall) {
  return {
    type: UPDATE_IS_MOBILE_SMALL,
    data: {
      isMobileSmall,
    },
  }
}
