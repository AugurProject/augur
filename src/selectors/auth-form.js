import loginAccount from './login-account';
import links from './links';

const Shared = {
	msg: null,
	isVisiblePassword: true,
	bottomLinkText: 'Import Account',
	bottomLink: { href: '/import', onClick: () => require('../selectors').update({ authForm: importAccount }) },
	msgClass: 'success',
	closeLink: { href: '/', onClick: () => require('../selectors').update({ activePage: 'markets' }) }
};

const loginParts = {
	submitButtonClass: 'login-button',
	submitButtonText: 'Login',
	title: 'Login',
	isVisibleName: false,
	isVisibleID: true,
	isVisiblePassword2: false,
	isVisibleRememberMe: true,
	topLinkText: 'Sign Up',
	instruction: 'Please enter your Login ID and password below.'
};

const signUp = {
	...Shared,
	submitButtonClass: 'register-button',
	submitButtonText: 'Sign In',
	title: 'Sign Up',
	isVisibleName: false,
	isVisibleID: false,
	isVisiblePassword2: true,
	isVisibleRememberMe: false,
	instruction: 'Please enter your password, then enter it again to generate an account. Once your account has been generated you can hit the Sign Up button to start using Augur. Don\'t forget to copy down your Login ID.',
	topLinkText: 'login',
	onSubmit: SignUpOnSubmit,
	topLink: {
		href: '/login',
		onClick: () => {
			require('../selectors').update({ authForm: {
				...Shared,
				...loginParts,
				topLink: {
					href: '/register',
					onClick: () => {
						require('../selectors').update({ authForm: { ...signUp, clearName: true, clearPassword: true } });
					}
				},
				onSubmit: (secureLoginID, password) => {
					require('../selectors').update({ authForm: { ...signUp, clearPassword: true, clearName: true } });
				}
			}
			});
		}
	}
};

// const logIn = {
// 	...Shared,
// 	...loginParts,
// 	topLink: {
// 		href: '/register',
// 		onClick: () => {
// 			require('../selectors').update({ authForm: { ...signUp, clearPassword: true, clearName: true } });
// 		}
// 	},
// 	onSubmit: (name, password, password2, secureLoginID, rememberMe) => {
// 		require('../selectors').update({ authForm: { ...signUp, clearName: true,
// 		clearPassword: true } });
// 		loginAccount.signIn();
// 		require('../selectors').update({ activePage: 'account' });
// 	}
// };

const importAccount = {
	...signUp,
	isVisiblePassword2: false,
	isVisibleFileInput: true,
	title: 'Import Account',
	bottomLinkText: 'Sign Up',
	submitButtonClass: 'login-button',
	submitButtonText: 'Import Account',
	instruction: 'Please upload your account file and enter the password to unlock the uploaded account.',
	bottomLink: {
		href: '/register',
		onClick: () => {
			require('../selectors').update({ authForm: { ...signUp, clearPassword: true, clearName: true } });
		}
	},
	onSubmit: (name, password, password2, secureLoginID, rememberMe, importAccount) => {
		require('../selectors').update({ authForm: { ...signUp, clearName: true,
		clearPassword: true } });
		loginAccount.signIn();
		return () => { require('../selectors').update({ activePage: 'account' }); };
	}
};

const accountCreated = {
	...signUp,
	isVisibleID: true,
	msg: 'Success! Your account has been generated locally. We do not retain a copy. *It is critical that you save this information in a safe place.* Your Login ID has been generated below. Please click on the box to automatically copy the Login ID or click on the "Copy Login ID" button. Click on the Login ID input field and hit ctrl + v (cmd + v on mac) to paste your Login ID. Hit "Sign Up" to complete registration.',
	loginID: 'testID123ASDW3N193NF7V123ADW25579130239SE1235189ADJWKRUY8123AOUELOREMIPSUMDOLORSITAMETCONSECTETURADIPISICINGELITSEDDOEIUSMODTEMPORINCIDIDUNTUTLABOREETDOLOREMAGNAALIQUAUTENIMADMINIMVENIAMQUISNOSTRUDEXERCITATIONULLAMCOLABORISNISIUTALIQUIPEXEACOMMODOCONSEQUATDUISAUTEIRUREDOLORINREPREHENDERITINVOLUPTATEVELITESSECILLUMDOLOREEUFUGIATNULLAPARIATUREXCEPTEURSINTOCCAECATCUPIDATATNONPROIDENTSUNTINCULPAQUIOFFICIADESERUNTMOLLITANIMIDESTLABORUM',
};


function SignUpOnSubmit(name, password, password2, secureLoginID, rememberMe, importedAccount, account, cb) {
	if (password !== password2) {
		return false;
	}
	require('../selectors').update({
		authForm: {
			...accountCreated,
		}
	});

	if (typeof cb !== 'function') {
		require('../selectors').update({
			authForm: {
				...signUp,
			}
		});
		links.marketsLink.onClick('/');
	} else {
		cb(require('../selectors').loginAccount);
	}
	return false;
}

const AuthForm = {
	...signUp
};

export default AuthForm;
