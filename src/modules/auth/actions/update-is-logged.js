export const UPDATE_IS_LOGGED = 'UPDATE_IS_LOGGED'

export const updateIsLogged = isLogged => (
  {
    type: UPDATE_IS_LOGGED,
    data: {
      isLogged,
    },
  }
)
