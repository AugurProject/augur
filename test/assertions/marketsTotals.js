var assert = require('chai').assert;

/*
	marketsTotals: {
		numAll: 1,
		numFavorites: 0,
		numFiltered: 0,
		numPendingReports: 19,
		numUnpaginated: 0
	}
*/

function checkDefinedAndNumber(obj, name) {
	assert.isDefined(obj, `marketsTotals.${name} isn't defined`);
	assert.isNumber(obj, `marketsTotals.${name} isn't a number`);
}

function marketsTotalsAssertion(actual) {
	assert.isDefined(actual, `marketsTotals isn't defined`);
	assert.isObject(actual, `marketsTotals isn't an object`);

	checkDefinedAndNumber(actual.numAll, `numAll`);
	checkDefinedAndNumber(actual.numFavorites, `numFavorites`);
	checkDefinedAndNumber(actual.numFiltered, `numFiltered`);
	checkDefinedAndNumber(actual.numPendingReports, `numPendingReports`);
	checkDefinedAndNumber(actual.numUnpaginated, `numUnpaginated`);
}

module.exports = marketsTotalsAssertion;
