import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Link from '../../link/components/link';
import Input from '../../common/components/input';
import Checkbox from '../../common/components/checkbox';

export default class AuthForm extends Component {
	static propTypes = {
		className: PropTypes.string,
		title: PropTypes.string,
		secureLoginID: PropTypes.string,
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
		rememberMe: false
	};

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		if (new FileReader()) {
			this.fileReader = new FileReader();
		}
		this.state = {
			msg: this.props.msg,
			secureLoginID: this.props.secureLoginID,
			rememberMe: this.props.rememberMe || true
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ msg: nextProps.msg, secureLoginID: nextProps.secureLoginID });
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
		const secureLoginID = this.state.secureLoginID;
		const password = this.refs.password.value;
		const password2 = this.refs.password2.value;
		const rememberMe = this.state.rememberMe;
		const file = (this.refs.form[1].files[0] !== undefined);
		console.log(file);
		if (file && this.fileReader) {
			this.fileReader.readAsText(this.refs.form[1].files[0]);
			this.fileReader.onload = (e) => {
				const importAccount = JSON.parse(e.target.result);
				setTimeout(() => this.props.onSubmit(name, password, password2, secureLoginID, rememberMe, importAccount), 100);
			};
		} else {
			setTimeout(() => this.props.onSubmit(name, password, password2, secureLoginID, rememberMe, undefined), 100);
		}

		this.setState({ msg: '' });
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
				/>
				<input
					name="importAccount"
					className={classnames('auth-input', { displayNone: !p.isVisibleFileInput })}
					type="file"
					placeholder="Import Account"
					autoFocus="autofocus"
				/>
				<Input
					name="secureLoginID"
					ref={(ref) => { if (ref && ref.state.value !== s.secureLoginID) { this.setState({ secureLoginID: ref.state.value }); } }}
					className={classnames('secure-login-id-input', { displayNone: !p.isVisibleID })}
					type="text"
					value={s.secureLoginID}
					placeholder="secure login ID"
					autoFocus="autofocus"
					onChange={(secureLoginID) => this.setState({ secureLoginID })}
				/>
				<input
					ref="password"
					className={classnames('auth-input', { displayNone: !p.isVisiblePassword })}
					type="password"
					defaultValue={p.password}
					placeholder={p.passwordPlaceholder || 'password'}
					maxLength="256"
				/>
				<input
					ref="password2"
					className={classnames('auth-input', { displayNone: !p.isVisiblePassword2 })}
					type="password"
					placeholder={p.password2Placeholder || 'confirm password'}
					maxLength="256"
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
					className={classnames('airbitz-button airbitz-button-bottom')}
					onClick={p.airbitzLink.onClick}
				>
					{p.airbitzLinkText}
				</Link>
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
