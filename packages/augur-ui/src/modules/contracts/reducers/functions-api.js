import {
  UPDATE_FUNCTIONS_API,
  UPDATE_FROM_ADDRESS
} from "modules/contracts/actions/update-contract-api";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(functionsAPI = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_FUNCTIONS_API:
      return data.functionsAPI;
    case UPDATE_FROM_ADDRESS:
      return Object.keys(functionsAPI).reduce((p, contractName) => {
        p[contractName] = Object.keys(functionsAPI[contractName]).reduce(
          (q, functionName) => {
            q[functionName] = {
              ...functionsAPI[contractName][functionName],
              from: data.fromAddress
            };
            return q;
          },
          {}
        );
        return p;
      }, {});
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return functionsAPI;
  }
}
