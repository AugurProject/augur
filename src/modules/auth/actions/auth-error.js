export const AUTH_ERROR = 'AUTH_ERROR';

export function authError(err) {
	return { type: AUTH_ERROR, err };
}
