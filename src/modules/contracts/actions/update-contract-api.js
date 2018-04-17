import { augur } from 'services/augurjs'

export const UPDATE_EVENTS_API = 'UPDATE_EVENTS_API'
export const UPDATE_FUNCTIONS_API = 'UPDATE_FUNCTIONS_API'
export const UPDATE_FROM_ADDRESS = 'UPDATE_FROM_ADDRESS'

export const updateEventsAPI = eventsAPI => ({ type: UPDATE_EVENTS_API, eventsAPI })
export const updateFunctionsAPI = functionsAPI => (dispatch) => {
  augur.api = augur.generateContractApi(functionsAPI)
  dispatch({ type: UPDATE_FUNCTIONS_API, functionsAPI })
}
export const updateFromAddress = fromAddress => (dispatch, getState) => {
  dispatch({ type: UPDATE_FROM_ADDRESS, fromAddress })
  augur.api = augur.generateContractApi(getState().functionsAPI)
}
