import memoizerific from 'memoizerific';
import { REGISTER, LOGIN, IMPORT } from '../../auth/constants/auth-types';
import {
	INVALID_USERNAME_OR_PASSWORD,
	USERNAME_REQUIRED,
	PASSWORDS_DO_NOT_MATCH,
	PASSWORD_TOO_SHORT,
	USERNAME_TAKEN,
	PASSWORD_NEEDS_LOWERCASE,
	PASSWORD_NEEDS_UPPERCASE,
	PASSWORD_NEEDS_NUMBER
} from '../../auth/constants/form-errors';
import store from '../../../store';
import { register } from '../../auth/actions/register';
import { importAccount } from '../../auth/actions/import-account';
import { login } from '../../auth/actions/login';
import { selectAuthLink, selectAirbitzLink } from '../../link/selectors/links';

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
	case PASSWORD_NEEDS_LOWERCASE:
		return err.message;
	case PASSWORD_NEEDS_UPPERCASE:
		return err.message;
	case PASSWORD_NEEDS_NUMBER:
		return err.message;
	case USERNAME_TAKEN:
		return 'username already registered';
	default:
		return err.message;
	}
};

export const selectRegister = (auth, loginAccount, dispatch) => {
	let errMsg = selectErrMsg(auth.err);
	let newAccountMessage = undefined;
	if (loginAccount.loginID) {
		newAccountMessage = 'Success! Your account has been generated locally. We do not retain a copy. *It is critical that you save this information in a safe place.* Your Login ID has been generated below. Please click on the box to automatically copy the Login ID or click on the "Copy Login ID" button. Click on the Login ID input field and hit ctrl + v (cmd + v on mac) to paste your Login ID. Hit "Sign Up" to complete registration.';
		errMsg = null;
	}
	const isVisibleID = typeof newAccountMessage === 'string';
	return {
		title: 'Sign Up',
		type: auth.selectedAuthType,

		isVisibleName: false,
		isVisibleID,
		isVisiblePassword: true,
		isVisiblePassword2: true,
		isVisibleRememberMe: isVisibleID,
		isVisibleFileInput: false,

		instruction: 'Please enter your password, then enter it again to generate an account. When your account is successfully generated, you will see a loginID appear on this page. Copy and paste it into the Login ID input that appears and click the "Sign Up" button to begin.',

		topLinkText: 'Login',
		topLink: selectAuthLink(LOGIN, false, dispatch),

		bottomLinkText: 'Import Account',
		bottomLink: selectAuthLink(IMPORT, false, dispatch),

		loginID: loginAccount.loginID,
		msg: errMsg || newAccountMessage,
		msgClass: errMsg ? 'error' : 'success',

		submitButtonText: 'Sign Up',
		submitButtonClass: 'register-button',

		airbitzLinkText: 'Sign Up With Airbitz',
		airbitzLink: selectAirbitzLink(REGISTER, dispatch),
		onSubmit: (name, password, password2, loginID, rememberMe, keystore, account, cb) => dispatch(register(name, password, password2, loginID, rememberMe, account, cb))
	};
};

export const selectLogin = (auth, dispatch) => {
	const errMsg = selectErrMsg(auth.err);
	return {
		title: 'Login',
		type: auth.selectedAuthType,

		isVisibleName: false,
		isVisibleID: true,
		isVisiblePassword: true,
		isVisiblePassword2: false,
		isVisibleRememberMe: true,
		isVisibleFileInput: false,

		instruction: 'Please enter your Login ID and password below.',

		topLinkText: 'Sign Up',
		topLink: selectAuthLink(REGISTER, false, dispatch),

		bottomLinkText: 'Import Account',
		bottomLink: selectAuthLink(IMPORT, false, dispatch),

		msg: errMsg,
		msgClass: errMsg ? 'error' : 'success',

		submitButtonText: 'Login',
		submitButtonClass: 'login-button',

		airbitzLinkText: 'Login With Airbitz',
		airbitzLink: selectAirbitzLink(LOGIN, dispatch),

		onSubmit: (name, password, password2, loginID, rememberMe, keystore, account, cb) =>	dispatch(login(loginID, password, rememberMe))
	};
};

export const selectImportAccount = (auth, dispatch) => {
	const errMsg = selectErrMsg(auth.err);
	return {
		title: 'Import Account',
		type: auth.selectedAuthType,

		isVisibleName: false,
		isVisibleID: false,
		isVisiblePassword: true,
		isVisiblePassword2: false,
		isVisibleRememberMe: true,
		isVisibleFileInput: true,

		instruction: 'Please upload your account file and enter the password to unlock the uploaded account.',

		topLinkText: 'Login',
		topLink: selectAuthLink(LOGIN, false, dispatch),

		bottomLinkText: 'Sign Up',
		bottomLink: selectAuthLink(REGISTER, false, dispatch),

		msg: errMsg,
		msgClass: errMsg ? 'error' : 'success',

		submitButtonText: 'Import Account',
		submitButtonClass: 'register-button',

		airbitzLinkText: 'Sign Up With Airbitz',
		airbitzLink: selectAirbitzLink(REGISTER, dispatch),
		onSubmit: (name, password, password2, loginID, rememberMe, keystore, account, cb) => dispatch(importAccount(name, password, rememberMe, keystore, cb))
	};
};

export const selectAuthType = (auth, loginAccount, dispatch) => {
	switch (auth.selectedAuthType) {
	case REGISTER:
		return selectRegister(auth, loginAccount, dispatch);
	case LOGIN:
		return selectLogin(auth, dispatch);
	case IMPORT:
		return selectImportAccount(auth, dispatch);
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
