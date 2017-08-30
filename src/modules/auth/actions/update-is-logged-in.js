export const UPDATE_IS_LOGGED_IN = 'UPDATE_IS_LOGGED_IN'

export const updateIsLoggedIn = isLoggedIn => (
  {
    type: UPDATE_IS_LOGGED_IN,
    data: {
      isLoggedIn
    }
  }
)
