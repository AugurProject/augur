import React from 'react';
import classnames from 'classnames';
import Link from '../../link/components/link';

module.exports = React.createClass({
	propTypes: {
		className: React.PropTypes.string,

		title: React.PropTypes.string,
		passwordPlaceholder: React.PropTypes.string,
		password2Placeholder: React.PropTypes.string,

		isVisibleUsername: React.PropTypes.bool,
		isVisiblePassword: React.PropTypes.bool,
		isVisiblePassword2: React.PropTypes.bool,

		clearUsername: React.PropTypes.bool,
		clearPassword: React.PropTypes.bool,
		clearCode: React.PropTypes.bool,

		msg: React.PropTypes.string,
		msgClass: React.PropTypes.string,

		topLinkText: React.PropTypes.string,
		topLink: React.PropTypes.object,

		botttomLinkText: React.PropTypes.string,
		botttomLink: React.PropTypes.object,

		closeLink: React.PropTypes.object,

		submitButtonText: React.PropTypes.string,
        submitButtonClass: React.PropTypes.string,
		onSubmit: React.PropTypes.func
	},

	getInitialState: function() {
		return { msg: this.props.msg };
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({ msg: nextProps.msg });
	},

	componentDidUpdate: function() {
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
	},

	render: function() {
		var p =this.props;

		return (
			<form className={ p.className } onSubmit={ this.handleSubmit }>
				<h1 className="title">
					{ p.title }

					{ p.topLinkText &&
	                    <Link
	                    	className="top-link"
	                    	href={ p.topLink.href }
	                    	onClick={ p.topLink.onClick }>{ p.topLinkText }</Link>
					}
				</h1>

				{ this.state.msg &&
					<span className={ classnames('msg', p.msgClass) }>{ this.state.msg }</span>
				}

				<input
					ref="username"
					className={ classnames('auth-input', { 'displayNone': !p.isVisibleUsername }) }
					type="text"
					placeholder="name"
					maxLength="30"
					autoFocus="autofocus" />

				<input
					ref="password"
					className={ classnames('auth-input', { 'displayNone': !p.isVisiblePassword }) }
					type="password"
					placeholder={ p.passwordPlaceholder || 'password' }
					maxLength="256" />

				<input
					ref="password2"
					className={ classnames('auth-input', { 'displayNone': !p.isVisiblePassword2 }) }
					type="password"
					placeholder={ p.password2Placeholder || 'confirm password' }
					maxLength="256" />

				{ p.bottomLinkText &&
                    <Link
                    	className="bottom-link"
                    	href={ p.bottomLinkHref }
                    	onClick={ p.onClickBottomLink }>{ p.bottomLinkText }</Link>
				}

				<input
					className={ classnames('button', 'submit-button', p.submitButtonClass) }
					type="submit"
					value={ p.submitButtonText } />

				<Link
					type="button"
					className="button x-button"
					title="Close"
					href={ p.closeLink.href }
					onClick={ p.closeLink.onClick }>&#xf057;</Link>
			</form>
		);
	},

	handleSubmit: function(e) {
	    e.preventDefault();
	    this.setState({ msg: undefined });
	    setTimeout(() =>
		    this.props.onSubmit(
		    	this.refs.username && this.refs.username.value,
		    	this.refs.password && this.refs.password.value,
		    	this.refs.password2 && this.refs.password2.value
		    ), 100);
	}
});