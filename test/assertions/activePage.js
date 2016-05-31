var assert = require('chai').assert;
// activePage: String,
function activePageAssertion(actual) {
	assert.isDefined(actual, `activePage isn't defined`);
	assert.isString(actual, `activePage isn't a string`);
}
module.exports = activePageAssertion;
