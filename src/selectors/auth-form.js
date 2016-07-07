import loginAccount from './login-account';

const Shared = {
	msg: null,
	isVisiblePassword: true,
	// isVisibleAccountInfo: false,
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
	// clearName: true,
	// clearPassword: true,
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
					AuthForm.update({ authForm: { ...signUp, clearPassword: true, clearName: true } });
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
		AuthForm.update({ authForm: { ...signUp, clearName: true,
		clearPassword: true } });
		loginAccount.signIn();
		AuthForm.update({ activePage: 'account' });
	}
};

const accountCreated = {
	...logIn,
	msg: 'Success! Your account has been generated locally. We do not retain a copy. *It is critical that you save this information in a safe place.*',
	secureID: 'testID123ASDW3N193NF7V123ADW25579130239SE1235189ADJWKRUY8123AOUELOREMIPSUMDOLORSITAMETCONSECTETURADIPISICINGELITSEDDOEIUSMODTEMPORINCIDIDUNTUTLABOREETDOLOREMAGNAALIQUAUTENIMADMINIMVENIAMQUISNOSTRUDEXERCITATIONULLAMCOLABORISNISIUTALIQUIPEXEACOMMODOCONSEQUATDUISAUTEIRUREDOLORINREPREHENDERITINVOLUPTATEVELITESSECILLUMDOLOREEUFUGIATNULLAPARIATUREXCEPTEURSINTOCCAECATCUPIDATATNONPROIDENTSUNTINCULPAQUIOFFICIADESERUNTMOLLITANIMIDESTLABORUM',
};


function SignUpOnSubmit(name, password, password2) {
	AuthForm.update({
		authForm: {
			...accountCreated,
			// password
			clearPassword: true
		}
	});
}

// signUp.onSubmit = SignUpOnSubmit;

const AuthForm = {
	...signUp
};

export default AuthForm;
