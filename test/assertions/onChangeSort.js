var assert = require('chai').assert;
// onChangeSort: [Function],
function onChangeSortAssertion(actual) {
	assert.isDefined(actual, `onChangeSort isn't defined`);
	assert.isFunction(actual, `onChangeSort isn't a function`);
}

module.exports = onChangeSortAssertion;
