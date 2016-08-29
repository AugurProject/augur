import {
	assert
} from 'chai';
import { validatePassword } from '../../../src/modules/auth/validators/password-validator';

describe('src/modules/auth/validators/password-validator.js', () => {
	const shortPass = 'pass';
	const noCapPass = 'passw0rd';
	const noNumPass = 'Password';
	const noLowPass = 'PASSW0RD';
	const goodPass = 'Passw0rd';

	it('should fail on short passwords.', () => {
		assert(!validatePassword(shortPass).valid, `Passed checks when the password was too short.`);
	});

	it('should fail on passwords without a captial letter.', () => {
		assert(!validatePassword(noCapPass).valid, `Passed checks when the password was missing a capital letter.`);
	});

	it('should fail on passwords without a number.', () => {
		assert(!validatePassword(noNumPass).valid, `Passed checks when the password was missing a number.`);
	});

	it('should fail on passwords without a lowercase letter.', () => {
		assert(!validatePassword(noLowPass).valid, `Passed checks when the password was missing a lowercase letter.`);
	});

	it('should pass on good passwords that are long enough with atleast 1 number, lowercase letter, and uppercase letter.', () => {
		assert(validatePassword(goodPass).valid, `Didn't pass checks for what should be a valid password.`);
	});
});
