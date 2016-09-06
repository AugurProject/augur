import {
PASSWORD_TOO_SHORT,
PASSWORD_NEEDS_LOWERCASE,
PASSWORD_NEEDS_UPPERCASE,
PASSWORD_NEEDS_NUMBER,
PASSWORD_TOO_SHORT_MSG,
PASSWORD_NEEDS_LOWERCASE_MSG,
PASSWORD_NEEDS_UPPERCASE_MSG,
PASSWORD_NEEDS_NUMBER_MSG,
} from '../../auth/constants/form-errors';

export function validatePassword(password) {
	const result = { valid: true };

	if (password.length < 6) {
		result.valid = false;
		result.code = PASSWORD_TOO_SHORT;
		result.message = PASSWORD_TOO_SHORT_MSG;
		return result;
	}

	if (!hasLowercase(password)) {
		result.valid = false;
		result.code = PASSWORD_NEEDS_LOWERCASE;
		result.message = PASSWORD_NEEDS_LOWERCASE_MSG;
		return result;
	}

	if (!hasUppercase(password)) {
		result.valid = false;
		result.code = PASSWORD_NEEDS_UPPERCASE;
		result.message = PASSWORD_NEEDS_UPPERCASE_MSG;
		return result;
	}

	if (!hasNumber(password)) {
		result.valid = false;
		result.code = PASSWORD_NEEDS_NUMBER;
		result.message = PASSWORD_NEEDS_NUMBER_MSG;
		return result;
	}

	return result;
}

function hasLowercase(str) {
	return (/[a-z]/.test(str));
}

function hasUppercase(str) {
	return (/[A-Z]/.test(str));
}

function hasNumber(str) {
	return (/[0-9]/.test(str));
}
