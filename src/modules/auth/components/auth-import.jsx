import React, { Component } from 'react';
import classNames from 'classnames';

import Input from 'modules/common/components/input';

export default class AuthImport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      loginAccount: null,
      rememberMe: true,
      authError: false,
      errorMessage: null,
      // These prevent a flash on component mount
      isPasswordDisplayable: false,
      isAuthErrorDisplayable: false,
      isImportActionsDisplayable: false
    };

    this.handleRecoverError = this.handleRecoverError.bind(this);
  }

  componentDidMount() {
    // NOTE --  keythereum (as of implementation) simply throws when a file is
    //          unable to be recovered, so err is handled thusly
    window.addEventListener('error', this.handleRecoverError);
  }

  handleRecoverError(err) {
    this.setState({
      authError: true,
      errorMessage: 'Unable to recover account from file',
      isAuthErrorDisplayable: true
    });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <form
        className="auth-import-form"
        onSubmit={(e) => {
          e.preventDefault();

          if (s.loginAccount && s.password) {
            p.importAccountFromFile(s.password, s.rememberMe, s.loginAccount);
          }
        }}
      >
        <span className="soft-header">Import account from file</span>
        <input
          className={classNames('auth-import-file', {
            'input-error': s.authError
          })}
          name="file"
          type="file"
          onChange={(e) => {
            if (e.target.files.length) {
              if (e.target.files[0].type !== '') {
                this.setState({
                  authError: true,
                  errorMessage: 'Incorrect file type',
                  isAuthErrorDisplayable: true,
                  password: '',
                  loginAccount: null
                });
              }
              const fileReader = new FileReader();

              fileReader.readAsText(e.target.files[0]);

              fileReader.onload = (e) => {
                try {
                  const loginAccount = JSON.parse(e.target.result);
                  this.setState({
                    loginAccount,
                    password: '',
                    authError: false
                  });

                  if (!this.state.isPasswordDisplayable) {
                    this.setState({ isPasswordDisplayable: true });
                  }
                } catch (err) {
                  this.setState({
                    authError: true,
                    errorMessage: 'Malformed account file',
                    isAuthErrorDisplayable: true,
                    password: '',
                    loginAccount: null
                  });
                }
              };
            } else if (this.state.loginAccount) {
              this.setState({ loginAccount: null });
            }
          }}
        />
        <Input
          className={classNames('auth-import-password', {
            'input-error': s.authError,
            animateIn: s.loginAccount,
            animateOut: !s.loginAccount && s.isPasswordDisplayable
          })}
          name="password"
          type="password"
          placeholder="Password"
          value={s.password}
          canToggleVisibility
          onChange={(password) => {
            this.setState({
              password,
              authError: false
            });

            if (!this.state.isImportActionsDisplayable) {
              this.setState({ isImportActionsDisplayable: true });
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
          className={classNames('auth-import-actions', {
            animateInPartial: s.loginAccount && s.password,
            animateOutPartial: (!s.loginAccount || !s.password) && s.isImportActionsDisplayable
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
            Import
          </button>
        </div>
      </form>
    );
  }
}
