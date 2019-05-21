import { EnvObject } from "modules/types";

export const UPDATE_ENV = "UPDATE_ENV";

export function updateEnv(env: EnvObject) {
  return {
    type: UPDATE_ENV,
    data: { env },
  };
}
