import React, { Component, PropTypes } from 'react';

import getValue from 'utils/get-value';

export default class AuthSignup extends Component {
  static propTypes = {
    getLoginID: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      passwordConfirm: '',
      isGeneratingLoginID: false,
      rememberMe: true,
      loginAccount: null
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.password !== this.state.passwordConfirm && nextState.password === nextState.passwordConfirm) {
      this.setState({ isGeneratingLoginID: true });

      this.props.getLoginID(this.state.password, null, this.state.rememberMe, (loginAccount) => {
        console.log('loginAccount -- ', loginAccount);

        this.setState({
          loginAccount,
          isGeneratingLoginID: false
        });
      });
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    const loginID = getValue(s, 'loginAccount.loginID') || '';

    return (
      <form
        className="auth-signup-form"
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();

          console.log('submitted registration form');

          p.registerAccount(s.password, loginID, s.rememberMe, s.loginAccount);
        }}
      >
        <input
          name="password"
          type="password"
          autoFocus
          placeholder="Password"
          value={s.password}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            this.setState({ password: e.target.value });
          }}
        />
        <input
          name="password-confirm"
          type="password"
          placeholder="Confirm Password"
          value={s.passwordConfirm}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            this.setState({ passwordConfirm: e.target.value });
          }}
        />
        <input
          name="username"
          type="text"
          value={loginID}
          disabled
        />
        <textarea
          readOnly
          value={loginID}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <label // eslint-disable-line jsx-a11y/no-static-element-interactions
          htmlFor="remember_me_input"
          onClick={(e) => {
            e.stopPropagation();
          }}
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
        <input
          value="Sign Up"
          type="submit"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </form>
    );
  }
}
