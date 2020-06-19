import type { SDKConfiguration } from '@augurproject/artifacts';

export const UPDATE_ENV = 'UPDATE_ENV';

export function updateEnv(env: SDKConfiguration) {
  return {
    type: UPDATE_ENV,
    data: { env },
  };
}
