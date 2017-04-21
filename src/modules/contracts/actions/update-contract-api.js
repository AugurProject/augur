export const UPDATE_CONTRACT_API = 'UPDATE_CONTRACT_API';
export const UPDATE_FUNCTIONS_API = 'UPDATE_FUNCTIONS_API';
export const UPDATE_EVENTS_API = 'UPDATE_EVENTS_API';

export const updateContractAPI = contractAPI => ({ type: UPDATE_CONTRACT_API, contractAPI });
export const updateFunctionsAPI = functionsAPI => ({ type: UPDATE_FUNCTIONS_API, functionsAPI });
export const updateEventsAPI = eventsAPI => ({ type: UPDATE_EVENTS_API, eventsAPI });
