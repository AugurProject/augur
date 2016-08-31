import { assert } from 'chai';

export default function (marketLink) {
	assert.isDefined(marketLink);
	assert.isObject(marketLink);
	assert.isDefined(marketLink.text);
	assert.isString(marketLink.text);
	assert.isDefined(marketLink.className);
	assert.isString(marketLink.className);
	assert.isDefined(marketLink.onClick);
	assert.isFunction(marketLink.onClick);
}