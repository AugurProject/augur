import { describe, it } from 'mocha';
import { assert } from 'chai';
import validator from 'modules/create-market/validators/validate-scalar-big-num';

describe(`modules/market/validators/validate-scalar-big-num.js`, () => {
	let test;
	let out;

	it(`should make sure the user has provided a maximum number`, () => {
		test = validator(100, null);
		out = 'Please provide a maximum value';
		assert.equal(test, out, `Didn't send an error message for not defining a max number`);
	});

	it(`should make sure that the max scalar number is a number`, () => {
		test = validator(100, 'hello world');
		out = 'Maximum value must be a number';
		assert.equal(test, out, `Didn't send an error message for not using a valid number for max number`);
	});

	it(`should confirm that max scalar is above min scalar`, () => {
		test = validator(100, 20);
		out = 'Maximum must be greater than minimum';
		assert.equal(test, out, `Didn't send an error message for max scalar < min scalar`);
	});

	it(`should return null if everything is valid`, () => {
		test = validator(100, 1200);
		assert.equal(test, null, `Returned an error message when it shouldn't have.`);
	});

});
