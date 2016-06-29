const Shared = {
	msg: null,
	isVisiblePassword: true,
	isVisibleAccountInfo: false,
	msgClass: 'success',
	closeLink: { href: '/', onClick: () => AuthForm.update({ activePage: 'markets' }) }
};

const loginParts = {
	submitButtonClass: 'login-button',
	submitButtonText: 'Login',
	title: 'Login',
	isVisibleName: false,
	isVisibleID: true,
	isVisiblePassword2: false,
	clearName: true,
	clearPassword: true,
	topLinkText: 'Sign Up',
};

const signUp = {
	...Shared,
	submitButtonClass: 'register-button',
	submitButtonText: 'Generate Account',
	title: 'Sign Up',
	isVisibleName: true,
	isVisibleID: false,
	isVisiblePassword2: true,
	topLinkText: 'login',
	onSubmit: SignUpOnSubmit,
	topLink: {
		href: '/login',
		onClick: () => {
			AuthForm.update({ authForm: {
				...Shared,
				...loginParts,
				topLink: {
					href: '/register',
					onClick: () => {
						AuthForm.update({ authForm: { ...signUp, clearName: true, clearPassword: true } });
					}
				},
				onSubmit: (secureID, password) => {
					console.log('***** user would now be logged in assuming password and secure id are correct. ******');
					AuthForm.update({ authForm: { ...signUp } });
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
			AuthForm.update({ authForm: { ...signUp, clearPassword: true, clearName: true } });
		}
	},
	onSubmit: (secureID, password) => {
		console.log('***** user would now be logged in assuming password and secure id are correct. ******');
		AuthForm.update({ authForm: { ...signUp } });
	}
};

const accountCreated = {
	msg: 'Success! Your account has been generated locally. We do not retain a copy. *It is critical that you save this information in a safe place.*',
	isVisibleID: false,
	isVisibleName: false,
	isVisiblePassword: false,
	isVisiblePassword2: false,
	isVisibleAccountInfo: true,
	secureID: 'testID123ASDW3N193NF7V123ADW25579130239SE1235189ADJWKRUY8123AOUE',
	title: 'Account Generated',
	topLinkText: '',
	topLink: { href: '', onClick: () => {} },
	onSubmit: () => {
		AuthForm.update({ authForm: {
			...logIn,
			clearName: true,
			clearPassword: true
		}
		});
	}
};

function SignUpOnSubmit(name, password, password2) {
	AuthForm.update({
		authForm: {
			...logIn,
			...accountCreated,
			password
		}
	});
}

// signUp.onSubmit = SignUpOnSubmit;

const AuthForm = {
	...signUp
};

export default AuthForm;
