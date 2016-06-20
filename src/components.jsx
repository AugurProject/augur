import App from './app';
import * as assertions from '../test/assertions/';

const components = {
	App,
	assertions
};
export default components;

// also adding this notation to allow for importing specific pieces: import { App } from '...';
export { App, assertions };

