var assert = require('chai').assert;
// update: function
function updateAssertion(actual) {
	assert.isDefined(actual, `update isn't defined`)
	assert.isFunction(actual, `update isn't a function`);
}

module.exports = updateAssertion;
