import React, { Component } from 'react';
import classNames from 'classnames';

import Input from 'modules/common/components/input';

export default class AuthLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginID: '',
      password: '',
      authError: false,
      errorMessage: null,
      // These prevent a flash on component mount
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
          e.persist();

          if (s.loginID && s.password) {
            p.submitLogin(s.loginID, s.password, (err) => {
              if (err) {
                this.setState({
                  authError: true,
                  errorMessage: err.message,
                  isAuthErrorDisplayable: true
                });
              } else {
                e.target.style.display = 'none';

                history.replaceState(null, null, 'Force Chrome to Prompt For Password Storage');
              }
            });
          }
        }}
      >
        <span className="soft-header">Login with a Login ID</span>
        <Input
          className={classNames('auth-login-login-id', { 'input-error': s.authError })}
          name="username"
          type="text"
          placeholder="Login ID"
          autoFocus
          onChange={(loginID) => {
            this.setState({ loginID });

            if (!loginID) {
              this.setState({ password: '' });
            }

            if (this.state.authError) {
              this.setState({ authError: false });
            }
          }}
        />
        <Input
          className={classNames('auth-login-password', { 'input-error': s.authError })}
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

            if (this.state.authError) {
              this.setState({ authError: false });
            }
          }}
        />
        <div
          className={classNames('auth-error', {
            animateIn: s.authError,
            animateOut: !s.authError && s.isAuthErrorDisplayable
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
          <button
            className="submit"
            disabled={!s.loginID || !s.password}
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    );
  }
}
