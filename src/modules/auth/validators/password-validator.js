import {
PASSWORD_TOO_SHORT,
PASSWORD_NEEDS_LOWERCASE,
PASSWORD_NEEDS_UPPERCASE,
PASSWORD_NEEDS_NUMBER,
} from '../../auth/constants/form-errors';

export function validatePassword(password) {
	let result = { valid: true };

	if (password.length < 6) {
		result.valid = false;
		result.code = PASSWORD_TOO_SHORT;
		return result;
	}

	if (!hasLowercase(password)) {
		result.valid = false;
		result.code = PASSWORD_NEEDS_LOWERCASE;
		return result;
	}

	if (!hasUppercase(password)) {
		result.valid = false;
		result.code = PASSWORD_NEEDS_UPPERCASE;
		return result;
	}

	if (!hasNumber(password)) {
		result.valid = false;
		result.code = PASSWORD_NEEDS_NUMBER;
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
