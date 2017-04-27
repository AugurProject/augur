import { augur } from 'services/augurjs';

export const UPDATE_EVENTS_API = 'UPDATE_EVENTS_API';
export const UPDATE_FUNCTIONS_API = 'UPDATE_FUNCTIONS_API';
export const UPDATE_FROM_ADDRESS = 'UPDATE_FROM_ADDRESS';

export const updateEventsAPI = eventsAPI => ({ type: UPDATE_EVENTS_API, eventsAPI });
export const updateFunctionsAPI = functionsAPI => (dispatch, getState) => {
  const { loginAccount } = getState();
  augur.api = augur.generateContractAPI(functionsAPI, loginAccount && loginAccount.privateKey);
  dispatch({ type: UPDATE_FUNCTIONS_API, functionsAPI });
};
export const updateFromAddress = fromAddress => (dispatch, getState) => {
  console.log('updating from address:', fromAddress);
  dispatch({ type: UPDATE_FROM_ADDRESS, fromAddress });
  const { functionsAPI, loginAccount} = getState();
  console.log('new functions API:', functionsAPI);
  console.log('loginAccount:', loginAccount);
  augur.api = augur.generateContractAPI(functionsAPI, loginAccount && loginAccount.privateKey);
};
