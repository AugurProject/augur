import { UPDATE_ENV } from "modules/app/actions/update-env";

const DEFAULT_STATE = {
  useWeb3Transport: true
};

export default function(env = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_ENV:
      return data.env;
    default:
      return env;
  }
}
