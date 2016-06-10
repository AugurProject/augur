import proxyquire from 'proxyquire';
import * as mockStore from '../../mockStore';
import {
	INVALID_USERNAME_OR_PASSWORD,
	USERNAME_REQUIRED,
	PASSWORDS_DO_NOT_MATCH,
	PASSWORD_TOO_SHORT,
	USERNAME_TAKEN
} from '../../../src/modules/auth/constants/form-errors';
import {
	assertions
} from 'augur-ui-react-components';

describe('authForm selectors test: ', () => {
	proxyquire.noPreserveCache().noCallThru();
	let {
		store,
		state
	} = mockStore.default;
	const authForm = proxyquire('../../../src/modules/auth/selectors/auth-form', {
		'../../../store': store
	});

	beforeEach(() => {
		store.clearActions();
	});
	afterEach(() => {
		store.clearActions();
	});

	it(`should handle a register form`, () => {
		state.auth = {
			err: null,
			selectedAuthType: 'register'
		};
		// console.log(authForm.default());
		assertions.authForm(authForm.default());
	});

	it(`should handle a login form`, () => {
		state.auth = {
			err: null,
			selectedAuthType: 'login'
		};
		// console.log(authForm.default());
		assertions.authForm(authForm.default());
	});

	it(`should handle a unrecognized authType`, () => {
		state.auth = {
			err: null,
			selectedAuthType: 'some incorrect value'
		};
		// console.log(authForm.default());
		assertions.authForm(authForm.default());
	});

	it(`should handle invalid user name or password`, () => {
		state.auth = {
			err: {
				code: INVALID_USERNAME_OR_PASSWORD
			},
			selectedAuthType: 'login'
		};
		// console.log(authForm.default());
		assertions.authForm(authForm.default());
	});

	it(`should handle username missing`, () => {
		state.auth = {
			err: {
				code: USERNAME_REQUIRED
			},
			selectedAuthType: 'login'
		};
		// console.log(authForm.default());
		assertions.authForm(authForm.default());
	});

	it(`should handle passwords not matching`, () => {
		state.auth = {
			err: {
				code: PASSWORDS_DO_NOT_MATCH
			},
			selectedAuthType: 'login'
		};
		// console.log(authForm.default());
		assertions.authForm(authForm.default());
	});

	it(`should handle passwords that are too short`, () => {
		state.auth = {
			err: {
				code: PASSWORD_TOO_SHORT,
				message: 'password is too short!'
			},
			selectedAuthType: 'login'
		};
		// console.log(authForm.default());
		assertions.authForm(authForm.default());
	});

	it(`should handle taken usernames`, () => {
		state.auth = {
			err: {
				code: USERNAME_TAKEN
			},
			selectedAuthType: 'login'
		};
		// console.log(authForm.default());
		assertions.authForm(authForm.default());
	});

	it(`should handle unrecognized errors gracefully`, () => {
		state.auth = {
			err: {
				code: 'unrecognized error',
				message: 'some error message'
			},
			selectedAuthType: 'login'
		};
		// console.log(authForm.default());
		assertions.authForm(authForm.default());
	});
});

// export default { authForm, state };
// describe(`modules/auth/selectors/auth-form.js`, () => {
// 	proxyquire.noPreserveCache().noCallThru();
// 	// const middlewares = [thunk];
// 	// const mockStore = configureMockStore(middlewares);
// 	let selector, expected, actual;
// 	// let state = Object.assign({}, testState);
// 	// store = mockStore(state);
//
//
// 	selector = proxyquire('../../../src/modules/auth/selectors/auth-form', {
// 		'../../../store': store
// 	});
//
// 	authForm = selector.default;
//
// 	beforeEach(() => {
// 		store.clearActions();
// 	});
//
// 	afterEach(() => {
// 		store.clearActions();
// 	});
//
// 	it(`should select the correct auth form`, () => {
// 		expected = {
// 			title: 'Sign Up',
// 			isVisibleUsername: true,
// 			isVisiblePassword: true,
// 			isVisiblePassword2: true,
// 			topLinkText: 'Login',
// 			topLink: {
// 				href: '/login',
// 				onClick: () => {}
// 			},
// 			msg: null,
// 			msgClass: 'success',
// 			submitButtonText: 'Sign Up',
// 			submitButtonClass: 'register-button',
// 			onSubmit: () => {},
// 			closeLink: {
// 				href: '/',
// 				onClick: (href) => {}
// 			}
// 		};
//
// 		actual = selector.default();
// 		authFormAssertion(actual);
// 		// the above assertion needs to be improved on the augur-ui side.
// 		assert.equal(actual.title, expected.title, `Title didn't return the expected value for register`);
// 		assert.equal(actual.isVisibleUsername, expected.isVisibleUsername, `isVisibleUsername didn't return the expected value for register`);
// 		assert.equal(actual.isVisiblePassword, expected.isVisiblePassword, `isVisiblePassword didn't return the expected value for register`);
// 		assert.equal(actual.isVisiblePassword2, expected.isVisiblePassword2, `isVisiblePassword2 didn't return the expected value for register`);
// 		assert.equal(actual.topLinkText, expected.topLinkText, `topLinkText didn't return the expected value for register`);
// 		assert.equal(actual.msg, expected.msg, `msg didn't return the expected value for register`);
// 		assert.equal(actual.msgClass, expected.msgClass, `msgClass didn't return the expected value for register`);
// 		assert.equal(actual.submitButtonText, expected.submitButtonText, `submitButtonText didn't return the expected value for register`);
// 		assert.equal(actual.submitButtonClass, expected.submitButtonClass, `submitButtonClass didn't return the expected value for register`);
// 		assert.equal(actual.topLink.href, expected.topLink.href, `topLink.href didn't return the expected value for register`);
// 		assert.equal(actual.closeLink.href, expected.closeLink.href, `closeLink.href didn't return the expected value for register`);
//
// 		state.auth.selectedAuthType = 'login';
//
// 		expected = Object.assign(expected, {
// 			title: 'Login',
// 			isVisiblePassword2: false,
// 			topLinkText: 'Sign Up',
// 			topLink: {
// 				href: '/register'
// 			},
// 			submitButtonText: 'Login',
// 			submitButtonClass: 'login-button'
// 		});
//
// 		actual = selector.default();
//
// 		assert.equal(actual.title, expected.title, `Title didn't return the expected value for login`);
// 		assert.equal(actual.isVisibleUsername, expected.isVisibleUsername, `isVisibleUsername didn't return the expected value for login`);
// 		assert.equal(actual.isVisiblePassword, expected.isVisiblePassword, `isVisiblePassword didn't return the expected value for login`);
// 		assert.equal(actual.isVisiblePassword2, expected.isVisiblePassword2, `isVisiblePassword2 didn't return the expected value for login`);
// 		assert.equal(actual.topLinkText, expected.topLinkText, `topLinkText didn't return the expected value for login`);
// 		assert.equal(actual.msg, expected.msg, `msg didn't return the expected value for login`);
// 		assert.equal(actual.msgClass, expected.msgClass, `msgClass didn't return the expected value for login`);
// 		assert.equal(actual.submitButtonText, expected.submitButtonText, `submitButtonText didn't return the expected value for login`);
// 		assert.equal(actual.submitButtonClass, expected.submitButtonClass, `submitButtonClass didn't return the expected value for login`);
// 		assert.equal(actual.topLink.href, expected.topLink.href, `topLink.href didn't return the expected value for login`);
// 		assert.equal(actual.closeLink.href, expected.closeLink.href, `closeLink.href didn't return the expected value for login`);
// 	});
//
// 	it(`should handle possible basic auth errors`, () => {
// 		let err = 'error';
//
// 		state.auth.err = {
// 			code: INVALID_USERNAME_OR_PASSWORD,
// 			message: 'something bad happened!'
// 		};
//
// 		actual = selector.default();
// 		expected = 'invalid username or password';
//
// 		assert.equal(actual.msg, expected, `Didn't give correct error text from an '${INVALID_USERNAME_OR_PASSWORD}' error code`);
// 		assert.equal(actual.msgClass, err, `Didn't give correct error class from an '${INVALID_USERNAME_OR_PASSWORD}' error code`);
//
// 		state.auth.err.code = USERNAME_REQUIRED;
//
// 		actual = selector.default();
// 		expected = 'username is required';
//
// 		assert.equal(actual.msg, expected, `Didn't give correct error text from an '${USERNAME_REQUIRED}' error code`);
// 		assert.equal(actual.msgClass, err, `Didn't give correct error class from an '${USERNAME_REQUIRED}' error code`);
//
// 		state.auth.err.code = PASSWORDS_DO_NOT_MATCH;
//
// 		actual = selector.default();
// 		expected = 'passwords do not match';
//
// 		assert.equal(actual.msg, expected, `Didn't give correct error text from an '${PASSWORDS_DO_NOT_MATCH}' error code`);
// 		assert.equal(actual.msgClass, err, `Didn't give correct error class from an '${PASSWORDS_DO_NOT_MATCH}' error code`);
//
// 		state.auth.err.code = PASSWORD_TOO_SHORT;
//
// 		actual = selector.default();
// 		expected = state.auth.err.message;
//
// 		assert.equal(actual.msg, expected, `Didn't give correct error text from an '${PASSWORD_TOO_SHORT}' error code`);
// 		assert.equal(actual.msgClass, err, `Didn't give correct error class from an '${PASSWORD_TOO_SHORT}' error code`);
//
// 		state.auth.err.code = USERNAME_TAKEN;
//
// 		actual = selector.default();
// 		expected = 'username already registered';
//
// 		assert.equal(actual.msg, expected, `Didn't give correct error text from an '${USERNAME_TAKEN}' error code`);
// 		assert.equal(actual.msgClass, err, `Didn't give correct error class from an '${USERNAME_TAKEN}' error code`);
// 	});
//
// });
