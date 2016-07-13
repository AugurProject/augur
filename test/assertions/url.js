import { assert } from 'chai';

export default function (url) {
	assert.isDefined(url, `url isn't defined`);
	assert.isString(url, `url isn't a string`);
}