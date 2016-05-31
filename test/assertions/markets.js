var assert = require('chai').assert;
// markets: [ Object, Object, ... ]
function marketsAssertion(actual) {
	assert.isDefined(actual, `markets is not defined`);
	assert.isArray(actual, `markets isn't an array`);
}
module.exports = marketsAssertion;
