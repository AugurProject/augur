import loginAccount from 'selectors/login-account';
import links from 'selectors/links';

const Shared = {
	msg: null,
	isVisiblePassword: true,
	bottomLinkText: 'Import Existing Account',
	bottomLink: { href: '/import', onClick: () => require('../selectors').update({ authForm: importAccount }) },
	msgClass: 'success',
	closeLink: { href: '/', onClick: () => require('../selectors').update({ activeView: 'markets' }) }
};

const loginParts = {
	submitButtonClass: 'login-button',
	submitButtonText: 'Login',
	airbitzLinkText: 'Login With Airbitz',
	airbitzLink: { onClick: () => { console.log('Airbitz Login'); } },
	title: 'Login',
	type: 'login',
	isVisibleName: false,
	isVisibleID: true,
	isVisiblePassword2: false,
	isVisibleRememberMe: true,
	instruction: 'Please enter your Login ID and password below.',
	topLinkText: 'Sign Up',
};

const signUp = {
	...Shared,
	type: 'register',
	submitButtonClass: 'register-button',
	airbitzLinkText: 'Register With Airbitz',
	airbitzLink: { onClick: () => { console.log('Airbitz Register'); } },
	submitButtonText: 'Sign Up',
	title: 'Sign Up',
	isVisibleName: false,
	isVisibleID: false,
	isVisiblePassword2: true,
	isVisibleRememberMe: false,
	instruction: 'Please enter your password (at least 6 characters), then enter it again to confirm your password. Once your passwords match, your account will automatically begin being generated. Once generated, you will see a Login ID appear on this page. Copy and paste it into the Login ID input that appears and click the "Sign Up" button to begin.',
	topLinkText: 'Already have an account? Login here',
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
				onSubmit: (loginID, password) => {
					require('../selectors').update({ authForm: { ...signUp, clearPassword: true, clearName: true } });
				}
			}
			});
		}
	}
};

const importAccount = {
	...signUp,
	type: 'import',
	isVisiblePassword2: false,
	isVisibleFileInput: true,
	instruction: 'Please upload your account file and enter the password to unlock the uploaded account.',
	title: 'Import Account',
	bottomLinkText: 'Sign Up',
	submitButtonClass: 'login-button',
	submitButtonText: 'Import Account',
	airbitzLinkText: 'Register With Airbitz',
	airbitzLink: { onClick: () => { console.log('Airbitz Register'); } },
	bottomLink: {
		href: '/register',
		onClick: () => {
			require('../selectors').update({ authForm: { ...signUp, clearPassword: true, clearName: true } });
		}
	},
	onSubmit: (name, password, password2, loginID, rememberMe, importAccount) => {
		require('../selectors').update({
			authForm: {
				...signUp,
				clearName: true,
				clearPassword: true
			}
		});

		loginAccount.signIn();
		require('../selectors').update({ activeView: 'account' });
	}
};

const accountCreated = {
	...signUp,
	isVisibleName: false,
	isVisibleID: true,
	submitButtonText: 'Sign In',
	isVisibleRememberMe: true,
	msg: 'Success! Your account has been generated locally. We do not retain a copy. *It is critical that you save this information in a safe place.* Your Login ID has been generated below. Please click on the box to automatically copy the Login ID or click on the "Copy Login ID" button. It is critical to save this Login ID somewhere safe as it will allow you to login to your Augur Account from any device however it cannot be recovered if lost or forgotten. Paste your Login ID (crtl + v on windows, cmd + v on mac) into the Login ID field and click "Sign Up" to complete registration.',
	loginID: 'testID123ASDW3N193NF7V123ADW25579130239SE1235189ADJWKRUY8123AOUELOREMIPSUMDOLORSITAMETCONSECTETURADIPISICINGELITSEDDOEIUSMODTEMPORINCIDIDUNTUTLABOREETDOLOREMAGNAALIQUAUTENIMADMINIMVENIAMQUISNOSTRUDEXERCITATIONULLAMCOLABORISNISIUTALIQUIPEXEACOMMODOCONSEQUATDUISAUTEIRUREDOLORINREPREHENDERITINVOLUPTATEVELITESSECILLUMDOLOREEUFUGIATNULLAPARIATUREXCEPTEURSINTOCCAECATCUPIDATATNONPROIDENTSUNTINCULPAQUIOFFICIADESERUNTMOLLITANIMIDESTLABORUM',
};


function SignUpOnSubmit(name, password, password2, loginID, rememberMe, importedAccount, account, cb) {
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
		cb(loginAccount);
	}
	return false;
}

const AuthForm = {
	...signUp
};

export default AuthForm;
