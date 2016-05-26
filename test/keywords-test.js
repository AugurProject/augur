import {assert} from 'chai';

const selectorsLocation =
process.env.selectors ? process.env.selectors : '../src/selectors';
const selectors = require(selectorsLocation);

describe(`seletors.keywords tests:`, () => {
	if (selectors.keywords) {
		// keywords: {
		// 		value: String,
		// 		onChangeKeywords: [Function: onChangeKeywords]
		// },
		it(`should contain a keywords object with the correct shape`, () => {
			let actual = selectors.keywords;
			assert.isDefined(actual, `keywords isn't defined`);
			assert.isObject(actual, `keywords isn't an object`);
			assert.isDefined(actual.value, `keywords.value isn't defined`);
			assert.isString(actual.value, `keywords.value isn't a string`);
			assert.isDefined(actual.onChangeKeywords, `keywords.onChangeKeywords isn't defined`);
			assert.isFunction(actual.onChangeKeywords, `keywords.onChangeKeywords isn't a function`);
		});
	} else {
		console.log(`
- selectors.keywords isn't defined.
	- skipping keywords tests.`);
	}
});
