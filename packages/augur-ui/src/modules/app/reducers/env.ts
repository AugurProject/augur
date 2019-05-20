import { EnvObject, BaseAction } from "modules/types";
import { UPDATE_ENV } from "modules/app/actions/update-env";

const DEFAULT_STATE: EnvObject = {
  useWeb3Transport: true,
};

export default function(env = DEFAULT_STATE, action: BaseAction) {
  switch (action.type) {
    case UPDATE_ENV:
      return action.data.env;
    default:
      return env;
  }
}
