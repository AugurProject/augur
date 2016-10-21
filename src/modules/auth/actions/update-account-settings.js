export const UPDATE_ACCOUNT_SETTINGS = 'UPDATE_ACCOUNT_SETTINGS';

export function updateAccountSettings(settings) {
	return { type: UPDATE_ACCOUNT_SETTINGS, settings };
}
