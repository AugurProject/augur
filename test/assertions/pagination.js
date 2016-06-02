var assert = require('chai').assert;
// pagination:
//  { numPerPage: 10,
//    numPages: 10,
//    selectedPageNum: 1,
//    nextPageNum: 2,
//    startItemNum: 1,
//    endItemNum: 10,
//    numUnpaginated: 89,
//    nextItemNum: 11,
//    onUpdateSelectedPageNum: [Function: onUpdateSelectedPageNum] },
function paginationAssertion(actual) {
	assert.isDefined(actual, `pagination isn't defined`);
	assert.isObject(actual, `pagination isn't an object`);

	assert.isDefined(actual.numPerPage, `pagination.numPerPage isn't defined`);
	assert.isNumber(actual.numPerPage, `pagination.numPerPage isn't a Number`);

	assert.isDefined(actual.numPages, `pagination.numPages isn't defined`);
	assert.isNumber(actual.numPages, `pagination.numPages isn't a Number`);

	assert.isDefined(actual.selectedPageNum, `pagination.selectedPageNum isn't defined`);
	assert.isNumber(actual.selectedPageNum, `pagination.selectedPageNum isn't a Number`);

	assert.isDefined(actual.nextPageNum, `pagination.nextPageNum isn't defined`);
	assert.isNumber(actual.nextPageNum, `pagination.nextPageNum isn't a Number`);

	assert.isDefined(actual.startItemNum, `pagination.startItemNum isn't defined`);
	assert.isNumber(actual.startItemNum, `pagination.startItemNum isn't a Number`);

	assert.isDefined(actual.endItemNum, `pagination.endItemNum isn't defined`);
	assert.isNumber(actual.endItemNum, `pagination.endItemNum isn't a Number`);

	assert.isDefined(actual.numUnpaginated, `pagination.numUnpaginated isn't defined`);
	assert.isNumber(actual.numUnpaginated, `pagination.numUnpaginated isn't a Number`);

	assert.isDefined(actual.nextItemNum, `pagination.nextItemNum isn't defined`);
	assert.isNumber(actual.nextItemNum, `pagination.nextItemNum isn't a Number`);

	assert.isDefined(actual.onUpdateSelectedPageNum, `pagination.onUpdateSelectedPageNum isn't defined`);
	assert.isFunction(actual.onUpdateSelectedPageNum, `pagination.onUpdateSelectedPageNum isn't a Function`);
}

module.exports = paginationAssertion;
