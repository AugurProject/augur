import { UPDATE_ENV } from "modules/app/actions/update-env";

const DEFAULT_STATE = {
  useWeb3Transport: false
};

export default function(env = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_ENV:
      return action.env;
    default:
      return env;
  }
}
