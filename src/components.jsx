import App from './app';
import * as assertionsRaw from '../test/assertions/';

const assertions = Object.keys(assertionsRaw.default).reduce((p, assertionKey) => {
	if (assertionsRaw.default[assertionKey].default) {
		p[assertionKey] = assertionsRaw.default[assertionKey].default;
	}
	else {
		p[assertionKey] = assertionsRaw.default[assertionKey];
	}
	return p;
}, {});

const components = {
	App,
	assertions
};
export default components;

// also adding this notation to allow for importing specific pieces: import { App } from '...';
export {
	App,
	assertions
};

