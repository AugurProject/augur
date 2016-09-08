import loginAccount from './login-account';

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
	airbitzLinkText: 'Login With Airbitz',
	airbitzLink: { onClick: () => { console.log('Airbitz Login') } },
	title: 'Login',
	isVisibleName: false,
	isVisibleID: true,
	isVisiblePassword2: false,
	isVisibleRememberMe: true,
	topLinkText: 'Sign Up',
};

const signUp = {
	...Shared,
	submitButtonClass: 'register-button',
	submitButtonText: 'Generate Account',
	airbitzLinkText: 'Register With Airbitz',
	airbitzLink: { onClick: () => { console.log('Airbitz Register') } },
	title: 'Sign Up',
	isVisibleName: true,
	isVisibleID: false,
	isVisiblePassword2: true,
	isVisibleRememberMe: false,
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

const logIn = {
	...Shared,
	...loginParts,
	topLink: {
		href: '/register',
		onClick: () => {
			require('../selectors').update({ authForm: { ...signUp, clearPassword: true, clearName: true } });
		}
	},
	onSubmit: (name, password, password2, secureLoginID, rememberMe) => {
		require('../selectors').update({ authForm: { ...signUp, clearName: true,
		clearPassword: true } });
		loginAccount.signIn();
		require('../selectors').update({ activePage: 'account' });
	}
};

const importAccount = {
	...signUp,
	isVisiblePassword2: false,
	isVisibleFileInput: true,
	title: 'Import Account',
	bottomLinkText: 'Sign Up',
	submitButtonClass: 'login-button',
	submitButtonText: 'Import Account',
	airbitzLinkText: 'Register With Airbitz',
	airbitzLink: { onClick: () => { console.log('Airbitz Register') } },
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
		require('../selectors').update({ activePage: 'account' });
	}
};

const accountCreated = {
	...logIn,
	msg: 'Success! Your account has been generated locally. We do not retain a copy. *It is critical that you save this information in a safe place.*',
	secureLoginID: 'testID123ASDW3N193NF7V123ADW25579130239SE1235189ADJWKRUY8123AOUELOREMIPSUMDOLORSITAMETCONSECTETURADIPISICINGELITSEDDOEIUSMODTEMPORINCIDIDUNTUTLABOREETDOLOREMAGNAALIQUAUTENIMADMINIMVENIAMQUISNOSTRUDEXERCITATIONULLAMCOLABORISNISIUTALIQUIPEXEACOMMODOCONSEQUATDUISAUTEIRUREDOLORINREPREHENDERITINVOLUPTATEVELITESSECILLUMDOLOREEUFUGIATNULLAPARIATUREXCEPTEURSINTOCCAECATCUPIDATATNONPROIDENTSUNTINCULPAQUIOFFICIADESERUNTMOLLITANIMIDESTLABORUM',
};


function SignUpOnSubmit(name, password, password2) {
	require('../selectors').update({
		authForm: {
			...accountCreated,
		}
	});
}

const AuthForm = {
	...signUp
};

export default AuthForm;
