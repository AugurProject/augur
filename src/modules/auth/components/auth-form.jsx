import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Link from '../../link/components/link';
import Input from '../../common/components/input';
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
		if (new FileReader()) {
			this.fileReader = new FileReader();
		}
		this.state = {
			msg: this.props.msg,
			loginID: this.props.loginID,
			rememberMe: this.props.rememberMe,
			disableInputs: false
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ msg: nextProps.msg, showID: nextProps.isVisibleID });
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
		const name = this.refs.name.value;
		const loginID = this.state.loginID;
		const password = this.refs.password.value;
		const password2 = this.refs.password2.value;
		const rememberMe = this.state.rememberMe;
		const file = (this.refs.form[1].files[0] !== undefined);
		this.setState({ msg: '', disableInputs: false });
		if (file && this.fileReader) {
			this.fileReader.readAsText(this.refs.form[1].files[0]);
			this.fileReader.onload = (e) => {
				const importAccount = JSON.parse(e.target.result);
				setTimeout(() => this.props.onSubmit(name, password, password2, loginID, rememberMe, importAccount, undefined), 300);
			};
		} else {
			setTimeout(() => this.props.onSubmit(name, password, password2, loginID, rememberMe, undefined, undefined), 300);
		}
		return false;
	}

	handlePasswordInput = (e) => {
		e.preventDefault();
		const name = this.refs.name.value;
		const loginID = this.state.loginID;
		const password = this.refs.password.value;
		const password2 = this.refs.password2.value;
		const rememberMe = this.state.rememberMe;

		if (password === password2 && password.length >= 6) {
			setTimeout(() => this.props.onSubmit(name, password, password2, loginID, rememberMe, undefined, (loginAccount) => {
				this.setState({ loginID: loginAccount.loginID, disableInputs: true });
			}), 300);
		}
	}

	render() {
		const p = this.props;
		const s = this.state;

		return (
			<form ref="form" className={p.className} onSubmit={this.handleSubmit} encType="multipart/form-data">
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
				{s.msg &&
					<span className={classnames('msg', p.msgClass)}>
						{s.msg}
					</span>
				}
				<input
					ref="name"
					className={classnames('auth-input', { displayNone: !p.isVisibleName })}
					type="text"
					placeholder="name"
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
					disabled={s.disableInputs}
				/>
				<Input
					name="loginID"
					ref={(ref) => { if (ref && ref.state.value !== s.loginID) { this.setState({ loginID: ref.state.value }); } }}
					className={classnames('login-id-input', { displayNone: !p.isVisibleID })}
					type="text"
					value={s.loginID}
					placeholder="Login ID"
					autoFocus="autofocus"
					onChange={(loginID) => this.setState({ loginID })}
					disabled={s.disableInputs}
				/>
				<input
					ref="password"
					className={classnames('auth-input', { displayNone: !p.isVisiblePassword })}
					type="password"
					defaultValue={p.password}
					placeholder={p.passwordPlaceholder || 'password'}
					maxLength="256"
					onChange={this.handlePasswordInput}
					disabled={s.disableInputs}
				/>
				<input
					ref="password2"
					className={classnames('auth-input', { displayNone: !p.isVisiblePassword2 })}
					type="password"
					placeholder={p.password2Placeholder || 'confirm password'}
					maxLength="256"
					onChange={this.handlePasswordInput}
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
					title="Close"
					href={p.closeLink.href}
					onClick={p.closeLink.onClick}
				>
					&#xf057;
				</Link>
			</form>
		);
	}
}
