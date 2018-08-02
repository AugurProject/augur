export const UPDATE_IS_LOADING = 'UPDATE_IS_LOADING'

export const updateIsLoading = isLoading => (
  {
    type: UPDATE_IS_LOADING,
    data: {
      isLoading,
    },
  }
)
