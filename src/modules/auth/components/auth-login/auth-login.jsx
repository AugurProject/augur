import React, { Component } from 'react';
import classNames from 'classnames';

import Input from 'modules/common/components/input';

import makePath from 'modules/app/helpers/make-path';
import { DEFAULT_VIEW } from 'modules/app/constants/views';

import Styles from 'modules/auth/components/auth-login/auth-login.styles';

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
        className="AuthLogin"
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

                p.history.push(makePath(DEFAULT_VIEW));
              }
            });
          }
        }}
      >
        <span className="soft-header">Login with a Login ID</span>
        <Input
          className={classNames(Styles.AuthLogin__id, { 'input-error': s.authError })}
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
          className={classNames(Styles.AuthLogin__password, { 'input-error': s.authError })}
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
          className={classNames(Styles.AuthLogin__actions, {
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
