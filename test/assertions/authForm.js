var assert = require('chai').assert;
// authForm: Object,
function authFormAssertion(actual) {
	assert.isDefined(actual, `authForm isn't defined`);
	assert.isObject(actual, `authForm isn't an object`);
}
module.exports = authFormAssertion;
