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

		this.state = {
			loginID: '',
			accountName: '',
			password: '',
			password2: '',
			rememberMe: this.props.rememberMe || false,
			disableInputs: false,
			loginAccount: {},
			msg: this.props.msg,
			file: null
		};

		if (new FileReader()) {
			this.fileReader = new FileReader();
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handlePasswordInput = this.handlePasswordInput.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ msg: nextProps.msg });
	}

	handleSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const name = this.state.accountName;
		const loginID = this.state.loginID;
		const password = this.state.password;
		const password2 = this.state.password2;
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

		const newState = {};
		const target = e.target;
		newState[target.name] = target.value;

		this.setState(newState, () => {
			const password = this.state.password;
			const password2 = this.state.password2;

			if (password !== '' && password2 !== '') {
				const name = this.state.accountName;
				const loginID = this.state.loginID;
				const rememberMe = this.state.rememberMe;

				setTimeout(() => this.props.onSubmit(name, password, password2, loginID, rememberMe, undefined, undefined, (loginAccount) => {
					console.log('loginAccount -- ', loginAccount);

					this.setState({
						disableInputs: true,
						loginID: loginAccount.loginID,
						loginAccount
					});
				}), 300);
			}
		});
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
				{p.isVisibleName &&
					<input
						className="auth-input"
						type="text"
						placeholder="account name"
						maxLength="30"
						autoFocus="autofocus"
						disabled={s.disableInputs}
						value={s.accountName}
						onChange={(e) => { this.setState({ accountName: e.target.value }); }}
					/>
				}
				{p.isVisibleFileInput &&
					<input
						name="importAccount"
						className="auth-input"
						type="file"
						placeholder="Import Account"
						autoFocus="autofocus"
						onChange={file => this.setState({ file })}
					/>
				}
				{p.isVisibleID &&
					<input
						autoComplete
						name="username"
						id="username"
						className="auth-input"
						type="text"
						placeholder="Login ID"
						autoFocus="autofocus"
						value={s.loginID}
						onChange={loginID => this.setState({ loginID })}
						required={p.isVisibleID}
					/>
				}
				{p.isVisiblePassword &&
					<input
						autoComplete
						name="password"
						id="password"
						className="auth-input"
						type="password"
						defaultValue={p.password}
						placeholder={p.passwordPlaceholder || 'password'}
						maxLength="256"
						value={s.password}
						onChange={this.handlePasswordInput}
						required={p.isVisiblePassword}
						disabled={s.disableInputs}
					/>
				}
				{p.isVisiblePassword2 &&
					<input
						className="auth-input"
						type="password"
						name="password2"
						placeholder={p.password2Placeholder || 'confirm password'}
						maxLength="256"
						value={s.password2}
						onChange={this.handlePasswordInput}
						required={p.isVisiblePassword2}
						disabled={s.disableInputs}
					/>
				}
				<div className={classnames('bottom-container')}>
					{p.bottomLink &&
						<Link
							className="bottom-link"
							href={p.bottomLink.href}
							onClick={p.bottomLink.onClick}
						>
							{p.bottomLinkText}
						</Link>
					}
					{p.isVisibleRememberMe &&
						<Checkbox
							className={classnames({ displayNone: !p.isVisibleRememberMe })}
							title="Click Here to remember your account information locally."
							text="Remember Me"
							isChecked={s.rememberMe}
							onClick={() => this.setState({ rememberMe: !s.rememberMe })}
						/>
					}
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
