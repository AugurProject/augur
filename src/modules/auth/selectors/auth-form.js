import memoizerific from 'memoizerific';

import { REGISTER, LOGIN, LOGOUT } from '../../auth/constants/auth-types';
import { INVALID_USERNAME_OR_PASSWORD, USERNAME_REQUIRED, PASSWORDS_DO_NOT_MATCH, PASSWORD_TOO_SHORT, USERNAME_TAKEN } from '../../auth/constants/form-errors';
import { FAILED } from '../../transactions/constants/statuses';

import store from '../../../store';

import * as AuthActions from '../../auth/actions/auth-actions';

import { selectAuthLink } from '../../link/selectors/links';

export default function() {
	var { auth } = store.getState(),
		{ links } = require('../../../selectors');
	return selectAuthForm(auth, links, store.dispatch);
}

export const selectAuthForm = memoizerific(1)(function(auth, links, dispatch) {
	return {
		...selectAuthType(auth, dispatch),
		closeLink: links.previousLink
	};
});

export const selectAuthType = function(auth, dispatch) {
	switch(auth.selectedAuthType) {
		case REGISTER:
			return selectRegister(auth, dispatch);
		case LOGIN:
		case LOGOUT:
			return selectLogin(auth, dispatch);
	}
};

export const selectRegister = function(auth, dispatch) {
	var errMsg = selectErrMsg(auth.err);
	return {
		title: 'Sign Up',

		isVisibleUsername: true,
		isVisiblePassword: true,
		isVisiblePassword2: true,

		topLinkText: 'Login',
		topLink: selectAuthLink(LOGIN, dispatch),

		msg: errMsg,
		msgClass: errMsg ? 'error' : 'success',

		submitButtonText: 'Sign Up',
		submitButtonClass: 'register-button',

		onSubmit: (username, password, password2) => dispatch(AuthActions.register(username, password, password2))
	};
};

export const selectLogin = function(auth, dispatch) {
	var errMsg = selectErrMsg(auth.err);
	return {
		title: 'Login',

		isVisibleUsername: true,
		isVisiblePassword: true,
		isVisiblePassword2: false,

		topLinkText: 'Sign Up',
		topLink: selectAuthLink(REGISTER, dispatch),

		msg: errMsg,
		msgClass: errMsg ? 'error' : 'success',

		submitButtonText: 'Login',
		submitButtonClass: 'login-button',

		onSubmit: (username, password) => dispatch(AuthActions.login(username, password))
	};
};

export const selectErrMsg = function(err) {
	if (!err) {
		return null;
	}

	switch(err.code) {
		case INVALID_USERNAME_OR_PASSWORD:
			return 'invalid username or password';
		case USERNAME_REQUIRED:
			return 'username is required';
		case PASSWORDS_DO_NOT_MATCH:
			return 'passwords do not match';
		case PASSWORD_TOO_SHORT:
			return err.message; // use message so we dont have to update length requiremenets here
		case USERNAME_TAKEN:
			return 'username already registered';
		default:
			return err.message;
	}
};