export const UPDATE_ENV = 'UPDATE_ENV'

export function updateEnv(env) {
  return {
    type: UPDATE_ENV,
    env,
  }
}
