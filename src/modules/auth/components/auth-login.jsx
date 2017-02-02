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
      // These prevent a flash on component mount
      isPasswordDisplayable: false,
      isLoginActionsDisplayable: false
    };
  }

  render() {
    const p = this.props;
    const s = this.state;

    // console.log('p -- ', p);

    return (
      <form
        className="auth-login-form"
        onSubmit={(e) => {
          e.preventDefault();

          if (s.loginID && s.password) {
            p.submitLogin(s.loginID, s.password, s.rememberMe);
          }
        }}
      >
        <span>Login with a Login ID</span>
        <Input
          className="auth-login-login-id"
          name="login-id"
          type="text"
          placeholder="Login ID"
          autoFocus
          onChange={(loginID) => {
            this.setState({ loginID });

            if (loginID && !this.state.isPasswordDisplayable) {
              this.setState({ isPasswordDisplayable: true });
            }
          }}
        />
        <Input
          className={classNames('auth-login-password', {
            animateIn: s.loginID,
            animateOut: !s.loginID && s.isPasswordDisplayable
          })}
          name="password"
          type="password"
          placeholder="Password"
          canToggleVisibility
          onChange={(password) => {
            this.setState({ password });

            if (this.state.loginID && this.state.password && !this.state.isLoginActionsDisplayable) {
              this.setState({ isLoginActionsDisplayable: true });
            }
          }}
        />
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
