import { describe, it } from 'mocha';
import { assert } from 'chai';
import validator from '../../../src/modules/create-market/validators/validate-scalar-small-num';

describe(`modules/market/validators/validate-scalar-small-num.js`, () => {
	let test;
	let out;

	it(`should make sure the user has provided a minimum number`, () => {
		test = validator(null, 100);
		out = 'Please provide a minimum value';
		assert.equal(test, out, `Didn't send an error message for not defining a min number`);
	});

	it(`should make sure that the min scalar number is a number`, () => {
		test = validator('hello world', 100);
		out = 'Minimum value must be a number';
		assert.equal(test, out, `Didn't send an error message for not using a valid number for min number`);
	});

	it(`should confirm that min scalar is below max scalar`, () => {
		test = validator(1000, 20);
		out = 'Minimum must be less than maximum';
		assert.equal(test, out, `Didn't send an error message for min scalar > max scalar`);
	});

	it(`should return null if everything is valid`, () => {
		test = validator(100, 1200);
		assert.equal(test, null, `Returned an error message when it shouldn't have.`);
	});

});
