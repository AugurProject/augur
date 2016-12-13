import { describe, it } from 'mocha';
import { assert } from 'chai';
import validator from 'modules/create-market/validators/validate-end-date';

describe(`modules/market/validators/validate-end-date.js`, () => {
	it(`should make sure that end date is populated`, () => {
		let test = validator(null);
		const out = 'Please choose an end date';
		assert.equal(test, out, `Didn't return an error message when no endDate was provided.`);

		test = validator('1/1/3000');
		assert.equal(test, null, `Didn't return null when there was an endDate provided.`);
	});
});
