import App from './app';
import * as assertionsRaw from '../test/assertions/';

const assertions = Object.keys(assertionsRaw.default).reduce((p, assertionKey) => {
	p[assertionKey] = assertionsRaw.default[assertionKey];
	return p;
}, {});

console.log(assertions);

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

