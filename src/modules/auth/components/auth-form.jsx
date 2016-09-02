import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Link from '../../link/components/link';
import Checkbox from '../../common/components/checkbox';

export default class AuthForm extends Component {
	static propTypes = {
		className: PropTypes.string,
		title: PropTypes.string,
		loginID: PropTypes.string,
		rememberMe: PropTypes.bool,
		passwordPlaceholder: PropTypes.string,
		password2Placeholder: PropTypes.string,
		isVisibleName: PropTypes.bool,
		isVisiblePassword: PropTypes.bool,
		isVisiblePassword2: PropTypes.bool,
		isVisibleID: PropTypes.bool,
		isVisibleFileInput: PropTypes.bool,
		isVisibleRememberMe: PropTypes.bool,
		clearName: PropTypes.bool,
		clearPassword: PropTypes.bool,
		clearCode: PropTypes.bool,
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
			loginAccount: {}
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ msg: nextProps.msg });
	}

	componentDidUpdate() {
		if (this.props.clearName) {
			this.refs.name.value = '';
		}
		if (this.props.clearPassword) {
			this.refs.password.value = '';
			this.refs.password2.value = '';
		}
		if (this.props.clearCode) {
			this.refs.code.value = '';
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const name = this.refs.accountName.value;
		// const loginID = this.state.loginID;
		const loginID = this.refs.loginID.value;
		const password = this.refs.password.value;
		const password2 = this.refs.password2.value;
		const rememberMe = this.state.rememberMe;
		const loginAccount = this.state.loginAccount;
		const file = (this.refs.form[1].files[0] !== undefined);

		if (file && this.fileReader) {
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
// ref={(ref) => { if (ref && ref.state.value !== s.loginID) { this.setState({ loginID: ref.state.value }); } }}
	handlePasswordInput = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const name = this.refs.accountName.value;
		// const loginID = this.state.loginID;
		const loginID = this.refs.loginID.value;
		const password = this.refs.password.value;
		const password2 = this.refs.password2.value;
		const rememberMe = this.state.rememberMe;

		if (password !== '' && password2 !== '') {
			setTimeout(() => this.props.onSubmit(name, password, password2, loginID, rememberMe, undefined, undefined, (loginAccount) => {
				this.setState({ loginID: loginAccount.loginID, disableInputs: true, loginAccount });
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
					onChange={(loginID) => this.setState({ loginID })}
					required={p.isVisibleID}
				/>
				<input
					name="password"
					id="password"
					ref="password"
					className={classnames('auth-input', { displayNone: !p.isVisiblePassword })}
					type="password"
					defaultValue={p.password}
					placeholder={p.passwordPlaceholder || 'password'}
					maxLength="256"
					onChange={this.handlePasswordInput}
					required={p.isVisiblePassword}
					autoComplete
				/>
				<input
					ref="password2"
					className={classnames('auth-input', { displayNone: !p.isVisiblePassword2 })}
					type="password"
					placeholder={p.password2Placeholder || 'confirm password'}
					maxLength="256"
					onChange={this.handlePasswordInput}
					required={p.isVisiblePassword2}
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
					&#xf057;
				</Link>
				<p className={classnames('instruction')}>Passwords must be at least 6 characters in length. Passwords should contain at least one number, one lowercase letter, and one uppercase letter.</p>
			</form>
		);
	}
}
