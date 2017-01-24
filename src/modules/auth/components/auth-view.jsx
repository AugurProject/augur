import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import AuthLogin from 'modules/auth/components/auth-login';
import AuthSignup from 'modules/auth/components/auth-signup';
import AirbitzLogo from 'modules/common/components/airbitz-logo';

import AuthForm from 'modules/auth/components/auth-form'; // TODO -- remove before PR

import { AUTH_TYPE_AIRBITZ, AUTH_TYPE_LOGIN_ID, AUTH_TYPE_LOGIN_WITH_LOGIN_ID, AUTH_TYPE_SIGN_UP_WITH_LOGIN_ID, AUTH_TYPE_IMPORT } from 'modules/auth/constants/auth-types';

export default class AuthView extends Component {
  static propTypes = {
    authForm: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedAuthMethod: null,
      selectedLoginIDMethod: null,
      toggledOld: false // TODO -- remove before PR
    };

    this.updateSelectedAuthMethod = this.updateSelectedAuthMethod.bind(this);
    this.updateSelectedLoginIDMethod = this.updateSelectedLoginIDMethod.bind(this);
  }

  componentDidMount() {
    this.props.authForm.airbitzOnLoad.onLoad();
  }

  updateSelectedAuthMethod(selectedAuthMethod) {
    this.setState({ selectedLoginIDMethod: null });

    if (this.state.selectedAuthMethod !== null && this.state.selectedAuthMethod === selectedAuthMethod) {
      this.setState({ selectedAuthMethod: null });
    } else {
      this.setState({ selectedAuthMethod });
    }
  }

  updateSelectedLoginIDMethod(selectedLoginIDMethod) {
    if (this.state.selectedLoginIDMethod !== null && this.state.selectedLoginIDMethod === selectedLoginIDMethod) {
      this.setState({ selectedLoginIDMethod: null });
    } else {
      this.setState({ selectedLoginIDMethod });
    }
  }

  toggleToOld() {
    this.setState({ toggledOld: !this.state.toggledOld });
  }

  render() {
    const p = this.props;
    const s = this.state;

    // console.log('p -- ', p);

    return (
      <section id={s.toggledOld ? 'auth_view_old' : 'auth_view'}>
        <button onClick={() => this.toggleToOld()}>Toggle Form</button>
        {s.toggledOld &&
          <AuthForm {...p.authForm} />
        }
        {!s.toggledOld &&
          <article className="auth-methods">
            <h3>Sign Up / Login</h3>
            <button
              className={classNames('auth-airbitz unstyled', { selected: s.selectedAuthMethod === AUTH_TYPE_AIRBITZ })}
              onClick={() => {
                this.updateSelectedAuthMethod(AUTH_TYPE_AIRBITZ);
              }}
            >
              <span className="auth-button-title">Airbitz</span>
              {s.selectedAuthMethod === AUTH_TYPE_AIRBITZ &&
                <span>Opened in Modal</span>
              }
            </button>
            <button
              className={classNames('auth-login-id unstyled', { selected: s.selectedAuthMethod === AUTH_TYPE_LOGIN_ID })}
              onClick={() => {
                this.updateSelectedAuthMethod(AUTH_TYPE_LOGIN_ID);
              }}
            >
              <span className="auth-button-title">Login ID</span>
              {s.selectedAuthMethod === AUTH_TYPE_LOGIN_ID &&
                <div className="auth-login-id-method-selection">
                  <button
                    className={classNames('unstyled', { selected: s.selectedLoginIDMethod === AUTH_TYPE_SIGN_UP_WITH_LOGIN_ID })}
                    onClick={(e) => {
                      e.stopPropagation();
                      this.updateSelectedLoginIDMethod(AUTH_TYPE_SIGN_UP_WITH_LOGIN_ID);
                    }}
                  >
                    Sign Up
                  </button>
                  <button
                    className={classNames('unstyled', { selected: s.selectedLoginIDMethod === AUTH_TYPE_LOGIN_WITH_LOGIN_ID })}
                    onClick={(e) => {
                      e.stopPropagation();
                      this.updateSelectedLoginIDMethod(AUTH_TYPE_LOGIN_WITH_LOGIN_ID);
                    }}
                  >
                    Login
                  </button>
                </div>
              }
              {s.selectedAuthMethod === AUTH_TYPE_LOGIN_ID && s.selectedLoginIDMethod === AUTH_TYPE_LOGIN_WITH_LOGIN_ID &&
                <AuthLogin {...p.login} />
              }
              {s.selectedAuthMethod === AUTH_TYPE_LOGIN_ID && s.selectedLoginIDMethod === AUTH_TYPE_SIGN_UP_WITH_LOGIN_ID &&
                <AuthSignup />
              }
            </button>
            <button
              className={classNames('auth-import unstyled', { selected: s.selectedAuthMethod === AUTH_TYPE_IMPORT })}
              onClick={() => {
                this.updateSelectedAuthMethod(AUTH_TYPE_IMPORT);
              }}
            >
              <span className="auth-button-title">Account File</span>
              {s.selectedAuthMethod === AUTH_TYPE_IMPORT &&
                <span>import component</span>
              }
            </button>
          </article>
        }
      </section>
    );
  }
}
