import { ACCOUNT, MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from '../../app/constants/pages';
import { NEW_REGISTER, REGISTER, LOGIN } from '../../auth/constants/auth-types';

export const PATHS_PAGES = {
	'/': MARKETS,
	'/make': MAKE,
	'/positions': POSITIONS,
	'/transactions': TRANSACTIONS,
	'/register': REGISTER,
	'/login': LOGIN,
	'/m': M,
	'/account': ACCOUNT,
	'/newRegister': NEW_REGISTER,
};

export const PAGES_PATHS = Object.keys(PATHS_PAGES).reduce(
	(finalObj, key) => {
		finalObj[PATHS_PAGES[key]] = key;
		return finalObj;
	}, {});

export const PATHS_AUTH = {
	'/register': REGISTER,
	'/login': LOGIN,
	'/newRegister': NEW_REGISTER,
};

export const AUTH_PATHS = Object.keys(PATHS_AUTH).reduce(
	(finalObj, key) => {
		finalObj[PATHS_AUTH[key]] = key;
		return finalObj;
	}, {});
