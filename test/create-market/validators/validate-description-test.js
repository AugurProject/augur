import { describe, it } from 'mocha';
import { assert } from 'chai';
import {
	DESCRIPTION_MIN_LENGTH,
	DESCRIPTION_MAX_LENGTH
} from 'modules/create-market/constants/market-values-constraints';
import validator from 'modules/create-market/validators/validate-description';

describe(`modules/market/validators/validate-description.js`, () => {
	let test;
	let out;

	it(`should make sure description is populated`, () => {
		test = validator('');
		out = 'Please enter your question';
		assert.equal(test, out, `Didn't throw the correct error if no description is provided`);
	});

	it(`should make sure description is not too short`, () => {
		test = validator('1');
		// Because the current minimum description is 1 character long
		// we can't effectively test this yet, a blank description gives us
		// the previous error we tested in the above test.
		out = null;
		// delete above line and uncomment the below line when MIN LENGTH is > 1
		// out = 'Text must be a minimum length of ' + DESCRIPTION_MIN_LENGTH;
		assert.equal(test, out, `Didn't throw the correct error if description was too short. min length: ${DESCRIPTION_MIN_LENGTH}`);
	});

	it(`should make sure description is not too long`, () => {
		test = validator('this is a test description that should be well over the maximum length because it has sooooooooo many characters that it wont be able to fit into the UI in a nice way and the question would clearly be a run on sentence much like this one is here. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
		out = 'Text exceeds the maximum length of ' + DESCRIPTION_MAX_LENGTH;
		assert.equal(test, out, `Didn't throw the correct error if description was too long. max length: ${DESCRIPTION_MAX_LENGTH}`);
	});

});
