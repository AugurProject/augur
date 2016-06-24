import {
	assert
} from 'chai';
import validator from '../../../src/modules/create-market/validators/validate-categorical-outcomes';


describe(`modules/market/validators/validate-categorical-outcomes.js`, () => {
	it(`should return any errors in an array if an answer is blank.`, () => {
		let mockData = ['test', '', 'test2', ''];
		let test = validator(mockData);
		let out = ['', 'Answer cannot be blank', '', 'Answer cannot be blank'];
		assert.deepEqual(test, out, `Didn't add error message for blank answer`);
	});
});
