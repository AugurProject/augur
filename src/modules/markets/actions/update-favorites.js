export const UPDATE_FAVORITES = 'UPDATE_FAVORITES'
export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE'

export const updateFavorites = favorites => ({ type: UPDATE_FAVORITES, favorites })

export const toggleFavorite = marketId => ({ type: TOGGLE_FAVORITE, marketId })
