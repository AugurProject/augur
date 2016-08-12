import App from './app';
import * as PAGES from './modules/site/constants/pages';
import * as AUTH_TYPES from './modules/auth/constants/auth-types';
import * as TRANSACTION_TYPES from './modules/transactions/constants/types';

const constants = {
	PAGES,
	AUTH_TYPES,
	TRANSACTION_TYPES
};

const components = {
	App,
	constants
};
export default components;

// also adding this notation to allow for importing specific pieces: import { App } from '...';
export {
	App,
	constants
};

