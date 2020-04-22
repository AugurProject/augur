import { BaseAction } from 'modules/types';

export const IS_LOGGED = 'isLogged';
export const RESTORED_ACCOUNT = 'restoredAccount';
export const UPDATE_AUTH_STATUS = 'UPDATE_AUTH_STATUS';

export function updateAuthStatus(
  statusKey: string,
  value: string | boolean | undefined
): BaseAction {
  return {
    type: UPDATE_AUTH_STATUS,
    data: {
      statusKey,
      value,
    },
  };
}
