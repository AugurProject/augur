export const UPDATE_IS_ANIMATING = 'UPDATE_IS_ANIMATING'

export function updateIsAnimating(isAnimating) {
  return {
    type: UPDATE_IS_ANIMATING,
    data: {
      isAnimating,
    },
  }
}
