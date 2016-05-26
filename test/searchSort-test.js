import {assert} from 'chai';

const selectorsLocation =
process.env.selectors ? process.env.selectors : '../src/selectors';
const selectors = require(selectorsLocation);

describe(`selectors.searchSort tests:`, () => {
	if (selectors.searchSort) {
		// searchSort: {
		// 	selectedSort: { prop: String, isDesc: Boolean },
	  //   sortOptions: [ { label: String, value: String }, Object, Object ]
		// },
		it(`should contain a searchSort and is the expected shape`, () => {
			let actual = selectors.searchSort;
			assert.isDefined(actual, `searchSort isn't defined`);
			assert.isObject(actual, `searchSort isn't an object`);
		});

		it(`searchSort should contain a selectedSort object with correct shape`, () => {
			let actual = selectors.searchSort.selectedSort;
			assert.isDefined(actual, `selectedSort isn't defined`);
			assert.isObject(actual, `selectedSort isn't an Object`);
			assert.isDefined(actual.prop, `selectedSort.prop isn't defined`);
			assert.isString(actual.prop, `selectedSort.prop isn't a string`);
			assert.isDefined(actual.isDesc, `selectedSort.isDesc isn't defined`);
			assert.isBoolean(actual.isDesc, `selectedSort.isDesc isn't a boolean`);
		});

		it(`searchSort should contain a sortOptions array of objects with correct shape`, () => {
			let actual = selectors.searchSort.sortOptions;
			let actualObj = selectors.searchSort.sortOptions[0];

			assert.isDefined(actual, `sortOptions isn't defined`);
			assert.isArray(actual, `sortOptions isn't an array`);

			assert.isDefined(actualObj, `sortOptions[0] doesn't exist`);
			assert.isObject(actualObj, `sortOptions[0] isn't an object`);
			assert.isDefined(actualObj.label, `sortOptions[0].label isn't defined`);
			assert.isString(actualObj.label, `sortOptions[0].label isn't a string`);
			assert.isDefined(actualObj.value, `sortOptions[0].value isn't defined`);
			assert.isString(actualObj.value, `sortOptions[0].value isn't a string`);
		});
	} else {
		console.log(`
- selectors.searchSort isn't defined.
	- skipping searchSort tests.`);
	}
});
