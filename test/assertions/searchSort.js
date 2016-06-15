var assert = require('chai').assert;
// searchSort: {
// 	selectedSort: { prop: String, isDesc: Boolean },
//   sortOptions: [ { label: String, value: String }, Object, Object ]
// },
function searchSortAssertion(actual) {
	assert.isDefined(actual, `searchSort isn't defined`);
	assert.isObject(actual, `searchSort isn't an object`);
	assert.isDefined(actual.onChangeSort, `searchSort.onChangeSort isn't defined`);
	assert.isFunction(actual.onChangeSort, `searchSort.onChangeSort isn't a function`);
	selectedSortAssertion(actual.selectedSort);
	sortOptionsAssertion(actual.sortOptions);
}

function selectedSortAssertion(actual) {
	assert.isDefined(actual, `selectedSort isn't defined`);
	assert.isObject(actual, `selectedSort isn't an Object`);
	assert.isDefined(actual.prop, `selectedSort.prop isn't defined`);
	assert.isString(actual.prop, `selectedSort.prop isn't a string`);
	assert.isDefined(actual.isDesc, `selectedSort.isDesc isn't defined`);
	assert.isBoolean(actual.isDesc, `selectedSort.isDesc isn't a boolean`);
}

function sortOptionsAssertion(actual) {
	assert.isDefined(actual, `sortOptions isn't defined`);
	assert.isArray(actual, `sortOptions isn't an array`);

	assert.isDefined(actual[0], `sortOptions[0] doesn't exist`);
	assert.isObject(actual[0], `sortOptions[0] isn't an object`);
	assert.isDefined(actual[0].label, `sortOptions[0].label isn't defined`);
	assert.isString(actual[0].label, `sortOptions[0].label isn't a string`);
	assert.isDefined(actual[0].value, `sortOptions[0].value isn't defined`);
	assert.isString(actual[0].value, `sortOptions[0].value isn't a string`);
}

module.exports = searchSortAssertion;
// module.exports = {
// 	searchSortAssertion: searchSortAssertion,
// 	selectedSortAssertion: selectedSortAssertion,
// 	sortOptionsAssertion: sortOptionsAssertion
// };
