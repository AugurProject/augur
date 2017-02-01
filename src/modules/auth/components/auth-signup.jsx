import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import zxcvbn from 'zxcvbn';
import Input from 'modules/common/components/input';

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
      console.log('clear passwordConfirm');
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
        <Input
          autoFocus
          canToggleVisibility
          className="auth-signup-password"
          name="password"
          type="password"
          placeholder="Password"
          value={s.password}
          onChange={(password) => {
            this.setState({ password });
            this.scorePassword(password);
          }}
        />
        <Input
          className={classNames('password-confirm', { isVisible: s.isStrongPass, isHidden: !s.isStrongPass })}
          name="password-confirm"
          type="password"
          placeholder="Confirm Password"
          value={s.passwordConfirm}
          onChange={(passwordConfirm) => {
            this.setState({ passwordConfirm });
          }}
        />
        {
          <ul className={classNames('password-suggestions', { isVisible: !s.isStrongPass && s.passwordSuggestions.length, isHidden: !s.passwordSuggestions.length })}>
            {s.passwordSuggestions.map(suggestion => (
              <li>{suggestion}</li>
            ))}
          </ul>
        }

        <div className={classNames('login-id-messaging', { isVisible: s.loginAccount, isHidden: !s.loginAccount })}>
          <span>Below is your Login ID</span>
          <span className="important">SAVE THIS IN A SAFE PLACE</span>
          <span className="important">The Login ID CANNOT be recovered if lost or stolen!</span>
        </div>
        <textarea
          className={classNames('login-id', { isVisible: s.loginAccount, isHidden: !s.loginAccount })}
          value={loginID}
          readOnly
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
