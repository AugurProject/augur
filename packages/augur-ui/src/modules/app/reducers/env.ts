import { EnvObject, BaseAction } from "modules/types";
import { UPDATE_ENV } from "modules/app/actions/update-env";

const DEFAULT_STATE: EnvObject = {
  useWeb3Transport: true,
  universe: undefined,
};

export default function(env = DEFAULT_STATE, { type, data }: BaseAction): EnvObject {
  switch (type) {
    case UPDATE_ENV:
      return data.env;
    default:
      return env;
  }
}
