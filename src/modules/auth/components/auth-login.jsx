import React, { Component } from 'react';
import classNames from 'classnames';

import Input from 'modules/common/components/input';

export default class AuthLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginID: '',
      password: '',
      rememberMe: true,
      loginError: false,
      errorMessage: null,
      // These prevent a flash on component mount
      isPasswordDisplayable: false,
      isAuthErrorDisplayable: false,
      isLoginActionsDisplayable: false
    };
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <form
        className="auth-login-form"
        onSubmit={(e) => {
          e.preventDefault();

          if (s.loginID && s.password) {
            p.submitLogin(s.loginID, s.password, s.rememberMe, (err) => {
              if (err) {
                this.setState({
                  loginError: true,
                  errorMessage: err.message,
                  isAuthErrorDisplayable: true
                });
              }
            });
          }
        }}
      >
        <span className="soft-header">Login with a Login ID</span>
        <Input
          className={classNames('auth-login-login-id', { 'input-error': s.loginError })}
          name="login-id"
          type="text"
          placeholder="Login ID"
          autoFocus
          onChange={(loginID) => {
            this.setState({ loginID });

            if (!loginID) {
              this.setState({ password: '' });
            }

            if (!this.state.isPasswordDisplayable) {
              this.setState({ isPasswordDisplayable: true });
            }

            if (this.state.loginError) {
              this.setState({ loginError: false });
            }
          }}
        />
        <Input
          className={classNames('auth-login-password', {
            'input-error': s.loginError,
            animateIn: s.loginID,
            animateOut: !s.loginID && s.isPasswordDisplayable
          })}
          name="password"
          type="password"
          placeholder="Password"
          canToggleVisibility
          value={s.password}
          onChange={(password) => {
            this.setState({ password });

            if (this.state.loginID && this.state.password && !this.state.isLoginActionsDisplayable) {
              this.setState({ isLoginActionsDisplayable: true });
            }

            if (this.state.loginError) {
              this.setState({ loginError: false });
            }
          }}
        />
        <div
          className={classNames('auth-login-error', {
            animateIn: s.loginError,
            animateOut: !s.loginError && s.isAuthErrorDisplayable
          })}
        >
          <span>
            {s.errorMessage}
          </span>
        </div>
        <div
          className={classNames('auth-login-actions', {
            animateInPartial: s.loginID && s.password,
            animateOutPartial: (!s.loginID || !s.password) && s.isLoginActionsDisplayable
          })}
        >
          <label // eslint-disable-line jsx-a11y/no-static-element-interactions
            className="auth-signup-remember-me"
            htmlFor="remember_me_input"
          >
            Remember Me:
            <input
              id="remember_me_input"
              type="checkbox"
              checked={s.rememberMe}
              onChange={(e) => {
                this.setState({ rememberMe: e.target.checked });
              }}
            />
          </label>
          <button
            className="submit"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    );
  }
}
