import memoizerific from 'memoizerific';
import { REGISTER, LOGIN } from '../../auth/constants/auth-types';
import {
	INVALID_USERNAME_OR_PASSWORD,
	USERNAME_REQUIRED,
	PASSWORDS_DO_NOT_MATCH,
	PASSWORD_TOO_SHORT,
	USERNAME_TAKEN
} from '../../auth/constants/form-errors';
import store from '../../../store';
import { register } from '../../auth/actions/register';
import { login } from '../../auth/actions/login';
import { selectAuthLink } from '../../link/selectors/links';

export const selectErrMsg = (err) => {
	if (!err) {
		return null;
	}

	switch (err.code) {
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

export const selectRegister = (auth, dispatch) => {
	const errMsg = selectErrMsg(auth.err);
	return {
		title: 'Sign Up',

		isVisibleUsername: true,
		isVisiblePassword: true,
		isVisiblePassword2: true,

		topLinkText: 'Login',
		topLink: selectAuthLink(LOGIN, false, dispatch),

		msg: errMsg,
		msgClass: errMsg ? 'error' : 'success',

		submitButtonText: 'Sign Up',
		submitButtonClass: 'register-button',

		onSubmit: (username, password, password2) => dispatch(register(username, password, password2))
	};
};

export const selectLogin = (auth, dispatch) => {
	const errMsg = selectErrMsg(auth.err);
	return {
		title: 'Login',

		isVisibleUsername: true,
		isVisiblePassword: true,
		isVisiblePassword2: false,

		topLinkText: 'Sign Up',
		topLink: selectAuthLink(REGISTER, false, dispatch),

		msg: errMsg,
		msgClass: errMsg ? 'error' : 'success',

		submitButtonText: 'Login',
		submitButtonClass: 'login-button',

		onSubmit: (username, password) => dispatch(login(username, password))
	};
};

export const selectAuthType = (auth, dispatch) => {
	switch (auth.selectedAuthType) {
	case REGISTER:
		return selectRegister(auth, dispatch);
	case LOGIN:
		return selectLogin(auth, dispatch);
	default:
		return;
	}
};

export const selectAuthForm = memoizerific(1)((auth, link, dispatch) => {
	const obj = {
		...selectAuthType(auth, dispatch),
		closeLink: link.previousLink
	};
	return obj;
});

export default function () {
	const { auth } = store.getState();
	const { links } = require('../../../selectors');
	return selectAuthForm(auth, links, store.dispatch);
}
