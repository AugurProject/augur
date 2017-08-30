export const UPDATE_ACCOUNT_NAME = 'UPDATE_ACCOUNT_NAME'

export const updateAccountName = name => (dispatch) => {
  dispatch({ type: UPDATE_ACCOUNT_NAME, data: { name } })
}
