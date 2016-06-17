import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Link from '../../link/components/link';

export default class AuthForm extends Component {
	static propTypes = {
		className: PropTypes.string,
		title: PropTypes.string,
		passwordPlaceholder: PropTypes.string,
		password2Placeholder: PropTypes.string,
		isVisibleUsername: PropTypes.bool,
		isVisiblePassword: PropTypes.bool,
		isVisiblePassword2: PropTypes.bool,
		clearUsername: PropTypes.bool,
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

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = { msg: this.props.msg };
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ msg: nextProps.msg });
	}

	componentDidUpdate() {
		if (this.props.clearUsername) {
			this.refs.username.value = '';
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
		this.setState({ msg: undefined });
		setTimeout(() =>
			this.props.onSubmit(
				this.refs.username && this.refs.username.value,
				this.refs.password && this.refs.password.value,
				this.refs.password2 && this.refs.password2.value
			), 100);
	}

	render() {
		const p = this.props;

		return (
			<form className={p.className} onSubmit={this.handleSubmit}>
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
				{this.state.msg &&
					<span className={classnames('msg', p.msgClass)}>
						{this.state.msg}
					</span>
				}
				<input
					ref="username"
					className={classnames('auth-input', { displayNone: !p.isVisibleUsername })}
					type="text"
					placeholder="name"
					maxLength="30"
					autoFocus="autofocus"
				/>
				<input
					ref="password"
					className={classnames('auth-input', { displayNone: !p.isVisiblePassword })}
					type="password"
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
				{p.bottomLinkText &&
					<Link
						className="bottom-link"
						href={p.bottomLinkHref}
						onClick={p.onClickBottomLink}
					>
						{p.bottomLinkText}
					</Link>
				}
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
