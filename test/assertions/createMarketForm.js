var assert = require('chai').assert;
// createMarketForm: {}
function createMarketFormAssertion(actual) {
	assert.isDefined(actual, `createMarketForm isn't defined`);
	assert.isObject(actual, `createMarketForm isn't an object`);
}
module.exports = createMarketFormAssertion;
