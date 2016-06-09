import * as authForm from './auth/selectors/auth-form-test';
import {
	INVALID_USERNAME_OR_PASSWORD,
	USERNAME_REQUIRED,
	PASSWORDS_DO_NOT_MATCH,
	PASSWORD_TOO_SHORT,
	USERNAME_TAKEN
} from '../src/modules/auth/constants/form-errors';
import authFormAssertion from '../node_modules/augur-ui-react-components/test/assertions/authForm';

describe(`authForm Tests workflow example`, () => {
	it(`should handle Authform states`, () => {
		authForm.default.state.auth = { err: null, selectedAuthType: 'register' };
		// console.log(authForm.default.authForm.default());
		authFormAssertion(authForm.default.authForm.default());
		authForm.default.state.auth = { err: null, selectedAuthType: 'login' };
		// console.log(authForm.default.authForm.default());
		authFormAssertion(authForm.default.authForm.default());
		authForm.default.state.auth = { err: null, selectedAuthType: 'fakeType' };
		// console.log(authForm.default.authForm.default());
		authFormAssertion(authForm.default.authForm.default());
		authForm.default.state.auth = { err: { code: INVALID_USERNAME_OR_PASSWORD }, selectedAuthType: 'login' };
		// console.log(authForm.default.authForm.default());
		authFormAssertion(authForm.default.authForm.default());
		authForm.default.state.auth = { err: { code: USERNAME_REQUIRED }, selectedAuthType: 'login' };
		// console.log(authForm.default.authForm.default());
		authFormAssertion(authForm.default.authForm.default());
		authForm.default.state.auth = { err: { code: PASSWORDS_DO_NOT_MATCH }, selectedAuthType: 'login' };
		// console.log(authForm.default.authForm.default());
		authFormAssertion(authForm.default.authForm.default());
		authForm.default.state.auth = { err: { code: PASSWORD_TOO_SHORT, message: 'password is too short.' }, selectedAuthType: 'login' };
		// console.log(authForm.default.authForm.default());
		authFormAssertion(authForm.default.authForm.default());
		authForm.default.state.auth = { err: { code: USERNAME_TAKEN }, selectedAuthType: 'login' };
		// console.log(authForm.default.authForm.default());
		authFormAssertion(authForm.default.authForm.default());
		authForm.default.state.auth = { err: { code: 'somecode', message: 'unrecognized error code.' }, selectedAuthType: 'login' };
		// console.log(authForm.default.authForm.default());
		authFormAssertion(authForm.default.authForm.default());
	});
});
