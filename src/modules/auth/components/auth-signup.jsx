import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import zxcvbn from 'zxcvbn';

import { REQUIRED_PASSWORD_STRENGTH } from 'modules/auth/constants/password-strength';

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
      currentScore: 0,
      passwordSuggestions: [],
      isStrongPass: false,
      isGeneratingLoginID: false,
      rememberMe: true,
      loginAccount: null
    };
  }

  componentWillUpdate(nextProps, nextState) {

    // loginAccount
    if (
      nextState.isStrongPass &&
      this.state.password !== this.state.passwordConfirm &&
      nextState.password === nextState.passwordConfirm
    ) {
      this.setState({ isGeneratingLoginID: true });

      this.props.getLoginID(this.state.password, null, this.state.rememberMe, (loginAccount) => {
        this.setState({
          loginAccount,
          isGeneratingLoginID: false
        });
      });
    } else if (
      nextState.password !== nextState.passwordConfirm &&
      this.state.loginAccount
    ) { // if a login account exists, clear it
      this.setState({
        loginAccount: null,
        isGeneratingLoginID: false
      });
    }

    // passwordConfirm
    if (this.state.passwordConfirm && !nextState.isStrongPass) {
      this.setState({ passwordConfirm: '' });
    }
  }

  scorePassword = (password) => {
    const scoreResult = zxcvbn(password);
    const passwordSuggestions = scoreResult.feedback.suggestions;
    const currentScore = scoreResult.score;

    this.setState({
      currentScore,
      passwordSuggestions
    });

    if (currentScore >= REQUIRED_PASSWORD_STRENGTH) {
      this.setState({ isStrongPass: true });
    } else if (this.state.isStrongPass === true) {
      this.setState({ isStrongPass: false });
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
          p.registerAccount(s.password, loginID, s.rememberMe, s.loginAccount);
        }}
      >
        <span>Sign up with a Login ID</span>
        <input
          className="auth-signup-password"
          name="password"
          type="password"
          autoFocus
          placeholder="Password"
          value={s.password}
          onChange={(e) => {
            this.setState({ password: e.target.value });
            this.scorePassword(e.target.value);
          }}
        />
        <input
          className={classNames('password-confirm', { isVisible: s.isStrongPass, isHidden: !s.isStrongPass })}
          name="password-confirm"
          type="password"
          placeholder="Confirm Password"
          value={s.passwordConfirm}
          onChange={(e) => {
            this.setState({ passwordConfirm: e.target.value });
          }}
        />
        {
          <ul className={classNames('password-suggestions', { isVisible: !s.isStrongPass && s.passwordSuggestions.length, isHidden: !s.passwordSuggestions.length })}>
            {s.passwordSuggestions.map(suggestion => (
              <li>{suggestion}</li>
            ))}
          </ul>
        }
        <input
          className="username"
          name="username"
          type="text"
          value={loginID}
          disabled
        />
        <textarea
          className={classNames('login-id', { isVisible: s.loginAccount, isHidden: !s.loginAccount })}
          readOnly
          value={loginID}
        />
        <label // eslint-disable-line jsx-a11y/no-static-element-interactions
          className={classNames('remember-me', { isVisible: s.loginAccount, isHidden: !s.loginAccount })}
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
        <input
          className={classNames('submit', { isVisible: s.loginAccount, isHidden: !s.loginAccount })}
          value="Sign Up"
          type="submit"
        />
      </form>
    );
  }
}
