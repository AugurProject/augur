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
      // These prevent a flash on component mount
      isPasswordDisplayable: false,
      isImportActionsDisplayable: false
    };
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <form
        className="auth-import-form"
        onSubmit={(e) => {
          e.preventDefault();

          console.log('submit! -- ', s.loginAccount);

          if (p.loginAccount && p.password) {
            p.importAccountFromFile(s.password, s.rememberMe, s.loginAccount);
          }
        }}
      >
        <span>Import account from file</span>
        <input
          className="auth-import-file"
          name="file"
          type="file"
          onChange={(e) => {
            console.log('e -- ', e.target.files);
            if (e.target.files.length) {
              const fileReader = new FileReader();

              fileReader.readAsText(e.target.files[0]);

              fileReader.onload = (e) => {
                this.setState({ loginAccount: JSON.parse(e.target.result) });
              };

              if (!this.state.isPasswordDisplayable) {
                this.setState({ isPasswordDisplayable: true });
              }
            } else if (this.state.loginAccount) {
              this.setState({ loginAccount: null });
            }
          }}
        />
        <Input
          className={classNames('auth-import-password', {
            animateIn: s.loginAccount,
            animateOut: !s.loginAccount && s.isPasswordDisplayable
          })}
          name="password"
          type="password"
          placeholder="Password"
          canToggleVisibility
          onChange={(password) => {
            this.setState({ password });

            if (!this.state.isImportActionsDisplayable) {
              this.setState({ isImportActionsDisplayable: true });
            }
          }}
        />
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
