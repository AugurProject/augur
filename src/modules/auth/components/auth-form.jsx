import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';
import Link from '../../link/components/link';
import Checkbox from '../../common/components/checkbox';

export default class AuthForm extends Component {
	static propTypes = {
		className: PropTypes.string,
		title: PropTypes.string,
		loginID: PropTypes.string,
		type: PropTypes.string,
		rememberMe: PropTypes.bool,
		passwordPlaceholder: PropTypes.string,
		password2Placeholder: PropTypes.string,
		instruction: PropTypes.string,
		isVisibleName: PropTypes.bool,
		isVisiblePassword: PropTypes.bool,
		isVisiblePassword2: PropTypes.bool,
		isVisibleID: PropTypes.bool,
		isVisibleFileInput: PropTypes.bool,
		isVisibleRememberMe: PropTypes.bool,
		msg: PropTypes.string,
		msgClass: PropTypes.string,
		topLinkText: PropTypes.string,
		topLink: PropTypes.object,
		botttomLinkText: PropTypes.string,
		botttomLink: PropTypes.object,
		closeLink: PropTypes.object,
		submitButtonText: PropTypes.string,
		submitButtonClass: PropTypes.string,
		onSubmit: PropTypes.func
	};

	static defaultProps = {
		rememberMe: true
	};

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handlePasswordInput = this.handlePasswordInput.bind(this);
		this.loginIDCopy = this.loginIDCopy.bind(this);
		if (new FileReader()) {
			this.fileReader = new FileReader();
		}
		this.state = {
			msg: this.props.msg,
			loginID: undefined,
			rememberMe: this.props.rememberMe,
			disableInputs: false,
			loginAccount: {},
			submitDisabled: props.type === 'register'
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ msg: nextProps.msg });
	}

	handleSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const name = this.refs.accountName.value;
		const loginID = this.refs.loginID.value;
		const password = this.refs.password.value;
		const password2 = this.refs.password2.value;
		const rememberMe = this.state.rememberMe;
		const loginAccount = this.state.loginAccount;
		const file = (this.refs.form[1].files[0] !== undefined);

		if (this.props.type === 'import' && file && this.fileReader) {
			this.fileReader.readAsText(this.refs.form[1].files[0]);
			this.fileReader.onload = (e) => {
				const importAccount = JSON.parse(e.target.result);
				setTimeout(() => this.props.onSubmit(name, password, password2, loginID, rememberMe, importAccount, loginAccount, undefined), 300);
			};
		} else {
			setTimeout(() => this.props.onSubmit(name, password, password2, loginID, rememberMe, undefined, loginAccount, undefined), 300);
		}
		this.setState({ msg: '', loginID: undefined, disableInputs: false });
		return false;
	}

	handlePasswordInput = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const name = this.refs.accountName.value;
		const loginID = this.refs.loginID.value;
		const password = this.refs.password.value;
		const password2 = this.refs.password2.value;
		const rememberMe = this.state.rememberMe;

		if (password !== '' && password2 !== '' && password.length === password2.length) {
			setTimeout(() => this.props.onSubmit(name, password, password2, loginID, rememberMe, undefined, undefined, (loginAccount) => {
				this.setState({ loginID: loginAccount.loginID, disableInputs: true, loginAccount, submitDisabled: false });
			}), 300);
		}
	}

	loginIDCopy = (e) => {
		const loginIDDisplay = this.refs.loginIDDisplay;

		try {
			loginIDDisplay.select();
			document.execCommand('copy');
		} catch (err) {
			console.log(err);
		}
	}

	render() {
		const p = this.props;
		const s = this.state;

		return (
			<form ref="form" className={p.className} onSubmit={this.handleSubmit} encType="multipart/form-data" autoComplete>
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
				{p.instruction && <p className={classnames('instruction')}>{p.instruction}</p>}
				{s.msg &&
					<span className={classnames('msg', p.msgClass)}>
						{s.msg}
					</span>
				}
				<input
					ref="accountName"
					className={classnames('auth-input', { displayNone: !p.isVisibleName })}
					type="text"
					placeholder="account name"
					maxLength="30"
					autoFocus="autofocus"
					disabled={s.disableInputs}
				/>
				<input
					name="importAccount"
					className={classnames('auth-input', { displayNone: !p.isVisibleFileInput })}
					type="file"
					placeholder="Import Account"
					autoFocus="autofocus"
				/>
				{p.loginID &&
					<textarea ref="loginIDDisplay" className={classnames('loginID-generated')} readOnly value={p.loginID} onClick={this.loginIDCopy} />
				}
				{p.loginID &&
					<button type="button" className={classnames('button submit-button')} onClick={this.loginIDCopy}>Copy Login ID</button>
				}
				<input
					name="username"
					id="username"
					ref="loginID"
					className={classnames('auth-input', { displayNone: !p.isVisibleID })}
					type="text"
					placeholder="Login ID"
					autoFocus="autofocus"
					autoComplete
					onChange={loginID => this.setState({ loginID })}
					required={p.isVisibleID}
				/>
				<input
					name="password"
					id="password"
					ref="password"
					className={classnames('auth-input', { displayNone: !p.isVisiblePassword })}
					type="password"
					defaultValue={p.password}
					placeholder={p.passwordPlaceholder || 'password (must be at least 6 characters in length)'}
					maxLength="256"
					required={p.isVisiblePassword}
					autoComplete
					disabled={s.disableInputs}
					onChange={this.handlePasswordInput}
				/>
				<input
					ref="password2"
					className={classnames('auth-input', { displayNone: !p.isVisiblePassword2 })}
					type="password"
					placeholder={p.password2Placeholder || 'confirm password'}
					maxLength="256"
					required={p.isVisiblePassword2}
					disabled={s.disableInputs}
					onChange={this.handlePasswordInput}
				/>
				<div className={classnames('instruction', { displayNone: !p.isVisibleRememberMe })}>
					Select &ldquo;remember me&rdquo; to save your account and login automatically next time. (this will only remember your account on this device.)
				</div>
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
						data-tip data-for="remember-me-tooltip"
						text="Remember Me"
						isChecked={s.rememberMe}
						onClick={() => this.setState({ rememberMe: !s.rememberMe })}
					/>
				</div>
				<input
					className={classnames('button', 'submit-button', p.submitButtonClass)}
					type="submit"
					value={p.submitButtonText}
					disabled={s.submitDisabled}
				/>
				<Link
					className={classnames('airbitz-button airbitz-button-bottom')}
					onClick={p.airbitzLink.onClick}
				>
					{p.airbitzLinkText}
				</Link>
				<Link
					type="button"
					className="button x-button unstyled"
					data-tip data-for="close-link-tooltip"
					href={p.closeLink.href}
					onClick={p.closeLink.onClick}
				>
					<i></i>
				</Link>
				<ReactTooltip id="remember-me-tooltip" type="light" effect="solid" place="top">
					<span className="tooltip-text">Click here to save your account information in your browser&#39;s local storage.</span>
				</ReactTooltip>
				<ReactTooltip id="close-link-tooltip" type="light" effect="solid" place="top">
					<span className="tooltip-text">Back to Markets Page</span>
				</ReactTooltip>
			</form>
		);
	}
}
