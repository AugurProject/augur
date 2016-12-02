import { describe, it } from 'mocha';
import { assert } from 'chai';
import validator from '../../../src/modules/create-market/validators/validate-categorical-outcomes';

describe(`modules/market/validators/validate-categorical-outcomes.js`, () => {
	let mockData;
	let test;
	let out;

	it(`should return any errors in an array if an answer is blank.`, () => {
		mockData = ['test', '', 'test2', ''];
		test = validator(mockData);
		out = ['', 'Answer cannot be blank', '', 'Answer cannot be blank'];
		assert.deepEqual(test, out, `Didn't add error message for blank answer`);
	});

	it('should return any errors in an array if any outcomes are not unique', () => {
		mockData = ['test', 'test2', 'test'];
		test = validator(mockData);
		out = ['Category must be unique', '', 'Category must be unique'];
		assert.deepEqual(test, out, `Didn't add error messages for identical outcomes`);
	});
});
