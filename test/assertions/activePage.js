import { assert } from 'chai';

export function activePage(activePage) {
	assert.isDefined(activePage, `activePage isn't defined`);
	assert.isString(activePage, `activePage isn't a string`);
}