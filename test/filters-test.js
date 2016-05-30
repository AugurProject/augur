import {assert} from 'chai';

const selectorsLocation =
process.env.selectors ? process.env.selectors : '../src/selectors';
let selectors = require(selectorsLocation);
process.env.selectors ? selectors = selectors.default : selectors;

describe(`selector.filters tests:`, () => {
	if (selectors.filters) {
		// filters:
		// [ { title: 'Status', options: [ Object, ... ] },
		// 	{ title: 'Type', options: [ Object, ... ] },
		// 	{ title: 'Tags', options: [ Object, ... ] } ],
		it(`should contain a filters array with the correct shape`, () => {
			let actual = selectors.filters;
			console.log(actual);
			assert.isDefined(actual, `filters isn't defined`);
			assert.isArray(actual, `filters isn't an array`);
			assert.equal(actual.length, 3, `filters array isn't the expected length`);
			assert.isObject(actual[0], `filters[0] isn't an object`);
			assert.isObject(actual[1], `filters[1] isn't an object`);
			assert.isObject(actual[2], `filters[2] isn't an object`);
		});

		it(`filters should contain a Status object with correct shape`, () => {
			let actual = selectors.filters[0];

			assert.isDefined(actual, `filters[0] isn't defined`);
			assert.isObject(actual, `filters[0] isn't an object`);
			assert.isDefined(actual.title, `filters[0].title isn't defined`);
			assert.isString(actual.title, `filters[0].title isn't a string`);
			assert.equal(actual.title, 'Status', `filters[0].title should equal 'Status'`);
			assert.isDefined(actual.options, `filters[0].options isn't defined`);
			assert.isArray(actual.options, `filters[0].options isn't an array`);
			assert.isDefined(actual.options[0], `filters[0].options[0] isn't defined`);
			assert.isObject(actual.options[0], `filters[0].options[0] isn't an object`);
		});

		it(`filters[0].options[0] should be the correct shape`, () => {
			let actual = selectors.filters[0].options[0];

			assert.isDefined(actual, `[0].options[0] isn't defined`);
			assert.isObject(actual, `[0].options[0] isn't a object`);
			assert.isDefined(actual.name, `[0].options[0].name isn't defined`);
			assert.isString(actual.name, `[0].options[0].name isn't a string`);
			assert.isDefined(actual.value, `[0].options[0].value isn't defined`);
			assert.isString(actual.value, `[0].options[0].value isn't a string`);
			assert.isDefined(actual.numMatched, `[0].options[0].numMatched isn't defined`);
			assert.isNumber(actual.numMatched, `[0].options[0].numMatched isn't a number`);
			assert.isDefined(actual.isSelected, `[0].options[0].isSelected isn't defined`);
			assert.isBoolean(actual.isSelected, `[0].options[0].isSelected isn't a boolean`);
			assert.isDefined(actual.onClick, `[0].options[0].onClick isn't defined`);
			assert.isFunction(actual.onClick, `[0].options[0].onClick isn't a function`);
		});

		it(`filters should contain a Type object with correct shape`, () => {
			let actual = selectors.filters[1];

			assert.isDefined(actual, `filters[1] isn't defined`);
			assert.isObject(actual, `filters[1] isn't an object`);
			assert.isDefined(actual.title, `filters[1].title isn't defined`);
			assert.isString(actual.title, `filters[1].title isn't a string`);
			assert.equal(actual.title, 'Type', `filters[1].title should equal 'Status'`);
			assert.isDefined(actual.options, `filters[1].options isn't defined`);
			assert.isArray(actual.options, `filters[1].options isn't an array`);
			assert.isDefined(actual.options[1], `filters[1].options[1] isn't defined`);
			assert.isObject(actual.options[1], `filters[1].options[1] isn't an object`);
		});

		it(`filters[1].options[1] should be the correct shape`, () => {
			let actual = selectors.filters[1].options[1];

			assert.isDefined(actual, `[1].options[1] isn't defined`);
			assert.isObject(actual, `[1].options[1] isn't a object`);
			assert.isDefined(actual.name, `[1].options[1].name isn't defined`);
			assert.isString(actual.name, `[1].options[1].name isn't a string`);
			assert.isDefined(actual.value, `[1].options[1].value isn't defined`);
			assert.isString(actual.value, `[1].options[1].value isn't a string`);
			assert.isDefined(actual.numMatched, `[1].options[1].numMatched isn't defined`);
			assert.isNumber(actual.numMatched, `[1].options[1].numMatched isn't a number`);
			assert.isDefined(actual.isSelected, `[1].options[1].isSelected isn't defined`);
			assert.isBoolean(actual.isSelected, `[1].options[1].isSelected isn't a boolean`);
			assert.isDefined(actual.onClick, `[1].options[1].onClick isn't defined`);
			assert.isFunction(actual.onClick, `[1].options[1].onClick isn't a function`);
		});

		it(`filters should contain a Tags object with correct shape`, () => {
			let actual = selectors.filters[2];

			assert.isDefined(actual, `filters[2] isn't defined`);
			assert.isObject(actual, `filters[2] isn't an object`);
			assert.isDefined(actual.title, `filters[2].title isn't defined`);
			assert.isString(actual.title, `filters[2].title isn't a string`);
			assert.equal(actual.title, 'Tags', `filters[2].title should equal 'Status'`);
			assert.isDefined(actual.options, `filters[2].options isn't defined`);
			assert.isArray(actual.options, `filters[2].options isn't an array`);
			assert.isDefined(actual.options[2], `filters[2].options[2] isn't defined`);
			assert.isObject(actual.options[2], `filters[2].options[2] isn't an object`);
		});

		it(`filters[2].options[2] should be the correct shape`, () => {
			let actual = selectors.filters[2].options[2];

			assert.isDefined(actual, `[2].options[2] isn't defined`);
			assert.isObject(actual, `[2].options[2] isn't a object`);
			assert.isDefined(actual.name, `[2].options[2].name isn't defined`);
			assert.isString(actual.name, `[2].options[2].name isn't a string`);
			assert.isDefined(actual.value, `[2].options[2].value isn't defined`);
			assert.isString(actual.value, `[2].options[2].value isn't a string`);
			assert.isDefined(actual.numMatched, `[2].options[2].numMatched isn't defined`);
			assert.isNumber(actual.numMatched, `[2].options[2].numMatched isn't a number`);
			assert.isDefined(actual.isSelected, `[2].options[2].isSelected isn't defined`);
			assert.isBoolean(actual.isSelected, `[2].options[2].isSelected isn't a boolean`);
			assert.isDefined(actual.onClick, `[2].options[2].onClick isn't defined`);
			assert.isFunction(actual.onClick, `[2].options[2].onClick isn't a function`);
		});
	} else {
		console.log(`
- selectors.filters isn't defined.
	- skipping filters tests.`);
	}

});
