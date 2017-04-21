import { UPDATE_CONTRACT_API, UPDATE_FUNCTIONS_API, UPDATE_EVENTS_API } from 'modules/contracts/actions/set-contracts-api';

export default function (contractAPI = {}, action) {
  switch (action.type) {
    case UPDATE_CONTRACT_API:
      return action.contractAPI;
    case UPDATE_FUNCTIONS_API:
      return { ...contractAPI, functions: action.functionsAPI };
    case UPDATE_EVENTS_API:
      return { ...contractAPI, events: action.eventsAPI };
    default:
      return contractAPI;
  }
}
