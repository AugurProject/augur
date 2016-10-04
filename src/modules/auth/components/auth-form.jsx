import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Link from '../../link/components/link';
import Checkbox from '../../common/components/checkbox';

export default class AuthForm extends Component {
	// TODO -- Prop Validations
	static propTypes = {
	// 	className: PropTypes.string,
	// 	title: PropTypes.string,
	// 	loginID: PropTypes.string,
		type: PropTypes.string,
		rememberMe: PropTypes.bool,
	// 	passwordPlaceholder: PropTypes.string,
	// 	password2Placeholder: PropTypes.string,
	// 	instruction: PropTypes.string,
	// 	isVisibleName: PropTypes.bool,
	// 	isVisiblePassword: PropTypes.bool,
	// 	isVisiblePassword2: PropTypes.bool,
	// 	isVisibleID: PropTypes.bool,
	// 	isVisibleFileInput: PropTypes.bool,
	// 	isVisibleRememberMe: PropTypes.bool,
		msg: PropTypes.string,
	// 	msgClass: PropTypes.string,
	// 	topLinkText: PropTypes.string,
	// 	topLink: PropTypes.object,
	// 	botttomLinkText: PropTypes.string,
	// 	botttomLink: PropTypes.object,
	// 	closeLink: PropTypes.object,
	// 	submitButtonText: PropTypes.string,
	// 	submitButtonClass: PropTypes.string,
		onSubmit: PropTypes.func
	};

	static defaultProps = {
		rememberMe: true
	};

	constructor(props) {
		super(props);

		this.INITIAL_STATE = {
			loginID: null,
			accountName: null,
			password: null,
			password2: null,
			rememberMe: this.props.rememberMe,
			disableInputs: false,
			loginAccount: {},
			msg: this.props.msg,
			file: null
		};
		this.state = this.INITIAL_STATE;

		if (new FileReader()) {
			this.fileReader = new FileReader();
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handlePasswordInput = this.handlePasswordInput.bind(this);
		this.loginIDCopy = this.loginIDCopy.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ msg: nextProps.msg });
	}

	handleSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const name = this.state.accountName.value;
		const loginID = this.state.loginID.value;
		const password = this.state.password.value;
		const password2 = this.state.password2.value;
		const rememberMe = this.state.rememberMe;
		const loginAccount = this.state.loginAccount;
		const file = this.state.file;

		if (this.props.type === 'import' && file && this.fileReader) {
			this.fileReader.readAsText(file);
			this.fileReader.onload = (e) => {
				const importAccount = JSON.parse(e.target.result);
				setTimeout(() => this.props.onSubmit(name, password, password2, loginID, rememberMe, importAccount, loginAccount, undefined), 300);
			};
		} else {
			setTimeout(() => this.props.onSubmit(name, password, password2, loginID, rememberMe, undefined, loginAccount, undefined), 300);
		}

		this.setState(this.INITIAL_STATE);

		return false;
	};

	handlePasswordInput = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const name = this.state.accountName.value;
		const loginID = this.state.loginID.value;
		const password = this.state.password.value;
		const password2 = this.state.password2.value;
		const rememberMe = this.state.rememberMe;

		if (password !== '' && password2 !== '') {
			setTimeout(() => this.props.onSubmit(name, password, password2, loginID, rememberMe, undefined, undefined, (loginAccount) => {
				this.setState({ loginID: loginAccount.loginID, disableInputs: true, loginAccount });
			}), 300);
		}
	};

	loginIDCopy = (event) => {
		try {
			event.target.select(); // TODO -- need to double check this in the UI
			document.execCommand('copy');
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		const p = this.props;
		const s = this.state;

		return (
			<form
				autoComplete
				className={p.className}
				onSubmit={this.handleSubmit}
				encType="multipart/form-data"
			>
				<h1 className="title">
					{p.title}
					{p.topLinkText &&
						<Link
							className="top-link"
							href={p.topLink.href}
							onClick={p.topLink.onClick}
						>
							{p.topLinkText}
						</Link>
					}
				</h1>
				{p.instruction &&
					<p className="instruction">
						{p.instruction}
					</p>
				}
				{s.msg &&
					<span className={classnames('msg', p.msgClass)}>
						{s.msg}
					</span>
				}
				<input
					className={classnames('auth-input', { displayNone: !p.isVisibleName })}
					type="text"
					placeholder="account name"
					maxLength="30"
					autoFocus="autofocus"
					disabled={s.disableInputs}
					value={this.state.accountName}
					onChange={accountName => this.setState({ accountName })}
				/>
				<input
					name="importAccount"
					className={classnames('auth-input', { displayNone: !p.isVisibleFileInput })}
					type="file"
					placeholder="Import Account"
					autoFocus="autofocus"
					onChange={file => this.setState({ file })}
				/>
				{p.loginID &&
					<textarea
						readOnly
						className="loginID-generated"
						value={this.state.loginID}
						onClick={this.loginIDCopy}
					/>
				}
				{p.loginID &&
					<button type="button" className={classnames('button submit-button')} onClick={this.loginIDCopy}>Copy Login ID</button>
				}
				<input
					autoComplete
					name="username"
					id="username"
					className={classnames('auth-input', { displayNone: !p.isVisibleID })}
					type="text"
					placeholder="Login ID"
					autoFocus="autofocus"
					value={this.state.loginID}
					onChange={loginID => this.setState({ loginID })}
					required={p.isVisibleID}
				/>
				<input
					autoComplete
					name="password"
					id="password"
					className={classnames('auth-input', { displayNone: !p.isVisiblePassword })}
					type="password"
					defaultValue={p.password}
					placeholder={p.passwordPlaceholder || 'password'}
					maxLength="256"
					value={this.state.password}
					onChange={(password) => {
						this.setState({ password });
						this.handlePasswordInput();
					}}
					required={p.isVisiblePassword}
					disabled={s.disableInputs}
				/>
				<input
					className={classnames('auth-input', { displayNone: !p.isVisiblePassword2 })}
					type="password"
					placeholder={p.password2Placeholder || 'confirm password'}
					maxLength="256"
					value={this.state.password2}
					onChange={(password2) => {
						this.setState({ password2 });
						this.handlePasswordInput();
					}}
					required={p.isVisiblePassword2}
					disabled={s.disableInputs}
				/>
				<div className={classnames('bottom-container')}>
					<Link
						className={classnames('bottom-link', { displayNone: !p.bottomLink })}
						href={p.bottomLink.href}
						onClick={p.bottomLink.onClick}
					>
						{p.bottomLinkText}
					</Link>
					<Checkbox
						className={classnames({ displayNone: !p.isVisibleRememberMe })}
						title="Click Here to remember your account information locally."
						text="Remember Me"
						isChecked={s.rememberMe}
						onClick={() => this.setState({ rememberMe: !s.rememberMe })}
					/>
				</div>
				<input
					className={classnames('button', 'submit-button', p.submitButtonClass)}
					type="submit"
					value={p.submitButtonText}
				/>
				<Link
					type="button"
					className="button x-button"
					title="Back to Markets Page"
					href={p.closeLink.href}
					onClick={p.closeLink.onClick}
				>
					<i></i>
				</Link>
				<p className={classnames('instruction')}>Passwords must be at least 6 characters in length.</p>
			</form>
		);
	}
}
