export const UPDATE_IS_LOGGED = 'UPDATE_IS_LOGGED'

export const updateIsLogged = isLoggedIn => (
  {
    type: UPDATE_IS_LOGGED,
    data: {
      isLoggedIn
    }
  }
)
