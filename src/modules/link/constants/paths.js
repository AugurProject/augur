import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from '../../site/constants/pages';
import { REGISTER, LOGIN, LOGOUT } from '../../auth/constants/auth-types';

export const PATHS_PAGES = {
	'/': MARKETS,
	'/make': MAKE,
	'/positions': POSITIONS,
	'/transactions': TRANSACTIONS,
	'/register': REGISTER,
	'/login': LOGIN,
	'/logout': LOGOUT,
	'/m': M
};
export const PAGES_PATHS = Object.keys(PATHS_PAGES).reduce((finalObj, key) => { finalObj[PATHS_PAGES[key]] = key; return finalObj; }, {});

export const PATHS_AUTH = {
	'/register': REGISTER,
	'/login': LOGIN,
	'/logout': LOGOUT
};
export const AUTH_PATHS = Object.keys(PATHS_AUTH).reduce((finalObj, key) => { finalObj[PATHS_AUTH[key]] = key; return finalObj; }, {});
