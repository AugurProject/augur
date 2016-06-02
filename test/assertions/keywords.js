var assert = require('chai').assert;
// keywords: {
// 		value: String,
// 		onChangeKeywords: [Function: onChangeKeywords]
// },
function keywordsAssertion(actual) {
	assert.isDefined(actual, `keywords isn't defined`);
	assert.isObject(actual, `keywords isn't an object`);
	assert.isDefined(actual.value, `keywords.value isn't defined`);
	assert.isString(actual.value, `keywords.value isn't a string`);
	assert.isDefined(actual.onChangeKeywords, `keywords.onChangeKeywords isn't defined`);
	assert.isFunction(actual.onChangeKeywords, `keywords.onChangeKeywords isn't a function`);
}

module.exports = keywordsAssertion
