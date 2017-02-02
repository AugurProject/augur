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
      loginAccount: null,
      // These prevent a flash on component mount
      isPasswordConfirmDisplayable: false,
      isPasswordsSuggestionDisplayable: false,
      isSignUpActionsDisplayable: false
    };
  }

  componentWillUpdate(nextProps, nextState) {

    // loginAccount
    if (
      nextState.password &&
      nextState.isStrongPass &&
      this.state.password !== this.state.passwordConfirm &&
      nextState.password === nextState.passwordConfirm
    ) {
      this.setState({ isGeneratingLoginID: true });

      this.props.getLoginID(this.state.password, null, this.state.rememberMe, (loginAccount) => {
        this.setState({
          loginAccount,
          isGeneratingLoginID: false,
          isAuthActionsDisplayable: true
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

    if (passwordSuggestions.lenght && !this.state.isPasswordsSuggestionDisplayable) {
      this.setState({ isPasswordsSuggestionDisplayable: true });
    }

    if (currentScore >= REQUIRED_PASSWORD_STRENGTH) {
      this.setState({
        isStrongPass: true,
        isPasswordConfirmDisplayable: true
      });
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
          e.preventDefault();

          if (s.password && s.loginAccount && loginID) {
            p.registerAccount(s.password, loginID, s.rememberMe, s.loginAccount);
          }
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
            this.setState({
              password,
              hasInteracted: true
            });
            this.scorePassword(password);
          }}
        />
        <Input
          className={classNames('auth-signup-password-confirm', {
            animateIn: s.isStrongPass,
            animateOut: !s.isStrongPass && s.isPasswordConfirmDisplayable
          })}
          shouldMatchValue
          comparisonValue={s.password}
          name="password-confirm"
          type="password"
          placeholder="Confirm Password"
          value={s.passwordConfirm}
          onChange={(passwordConfirm) => {
            this.setState({ passwordConfirm });
          }}
        />
        <ul
          className={classNames('auth-signup-password-suggestions', {
            animateIn: !s.isStrongPass && s.passwordSuggestions.length,
            animateOut: !s.passwordSuggestions.length && s.hasInteracted
          })}
        >
          {s.passwordSuggestions.map((suggestion, i) => (
            <li key={`password-suggestion-${i}`}>{suggestion}</li>
          ))}
        </ul>
        <div
          className={classNames('auth-signup-actions', {
            animateInPartial: s.loginAccount,
            animateOutPartial: !s.loginAccount && s.isSignUpActionsDisplayable
          })}
          ref={(authSignupActions) => { this.authSignupActions = authSignupActions; }}
        >
          <div className="login-id-messaging">
            <span>Below is your Login ID</span>
            <span className="important">SAVE THE LOGIN ID IN A SAFE PLACE</span>
            <span className="important">This CANNOT be recovered if lost or stolen!</span>
          </div>
          <textarea
            className="login-id"
            value={loginID}
            readOnly
          />
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
            Sign Up
          </button>
        </div>
      </form>
    );
  }
}
