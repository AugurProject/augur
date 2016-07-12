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

export default function () {
	const { auth, loginAccount } = store.getState();
	const { links } = require('../../../selectors');
	return selectAuthForm(auth, loginAccount, links, store.dispatch);
}

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

		isVisibleName: true,
		isVisibleID: false,
		isVisiblePassword: true,
		isVisiblePassword2: true,

		topLinkText: 'Login',
		topLink: selectAuthLink(LOGIN, false, dispatch),

		msg: errMsg,
		msgClass: errMsg ? 'error' : 'success',

		submitButtonText: 'Sign Up',
		submitButtonClass: 'register-button',

		onSubmit: (name, password, password2, secureLoginID) => dispatch(register(name, password, password2))
	};
};

export const selectLogin = (auth, loginAccount, dispatch) => {
	const errMsg = selectErrMsg(auth.err);
	let newAccountMessage = null;
	if (errMsg === null && loginAccount.secureLoginID) {
		newAccountMessage = 'Success! Your account has been generated locally. We do not retain a copy. *It is critical that you save this information in a safe place.*';
	}
	return {
		title: 'Login',

		isVisibleName: false,
		isVisibleID: true,
		isVisiblePassword: true,
		isVisiblePassword2: false,

		topLinkText: 'Sign Up',
		topLink: selectAuthLink(REGISTER, false, dispatch),

		secureID: loginAccount.secureLoginID,
		msg: errMsg || newAccountMessage,
		msgClass: errMsg ? 'error' : 'success',

		submitButtonText: 'Login',
		submitButtonClass: 'login-button',

		onSubmit: (name, password, password2, secureLoginID) =>	dispatch(login(secureLoginID, password))
	};
};

export const selectNewRegister = (auth, loginAccount, dispatch) => {
	const errMsg = selectErrMsg(auth.err);
	return {
		title: 'Login',

		isVisibleName: false,
		isVisibleID: true,
		isVisiblePassword: true,
		isVisiblePassword2: false,

		topLinkText: 'Sign Up',
		topLink: selectAuthLink(REGISTER, false, dispatch),

		msg: errMsg || 'Success! Your account has been generated locally. We do not retain a copy. *It is critical that you save this information in a safe place.*',
		secureID: loginAccount.secureLoginID,

		msgClass: errMsg ? 'error' : 'success',

		submitButtonText: 'Login',
		submitButtonClass: 'login-button',

		onSubmit: (name, password, password2, secureLoginID) =>		dispatch(login(secureLoginID, password))
	};
};

export const selectAuthType = (auth, loginAccount, dispatch) => {
	switch (auth.selectedAuthType) {
	case REGISTER:
		return selectRegister(auth, dispatch);
	case LOGIN:
		return selectLogin(auth, loginAccount, dispatch);
	default:
		return;
	}
};

export const selectAuthForm = memoizerific(1)((auth, loginAccount, link, dispatch) => {
	const obj = {
		...selectAuthType(auth, loginAccount, dispatch),
		closeLink: link.previousLink
	};
	return obj;
});
