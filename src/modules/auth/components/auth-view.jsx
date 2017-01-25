import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import AuthLogin from 'modules/auth/components/auth-login';
import AuthSignup from 'modules/auth/components/auth-signup';
import AuthImport from 'modules/auth/components/auth-import';
import AirbitzLogoIcon from 'modules/common/components/airbitz-logo-icon';

import ComponentNav from 'modules/common/components/component-nav';

import { AUTH_SIGNUP, AUTH_LOGIN, AUTH_IMPORT } from 'modules/app/constants/views';
import { AUTH_TYPE_AIRBITZ, AUTH_TYPE_LOGIN_ID, AUTH_TYPE_LOGIN_WITH_LOGIN_ID, AUTH_TYPE_SIGN_UP_WITH_LOGIN_ID, AUTH_TYPE_IMPORT } from 'modules/auth/constants/auth-types';

export default class AuthView extends Component {
  static propTypes = {
    authForm: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedNav: AUTH_SIGNUP,
      selectedAuthMethod: null,
      selectedLoginIDMethod: null
    };

    this.updateSelectedNav = this.updateSelectedNav.bind(this);
    this.updateSelectedAuthMethod = this.updateSelectedAuthMethod.bind(this);
    this.updateSelectedLoginIDMethod = this.updateSelectedLoginIDMethod.bind(this);
  }

  updateSelectedNav(selectedNav) {
    this.setState({ selectedNav });
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

  render() {
    const p = this.props;
    const s = this.state;

    // console.log('p -- ', p);

    return (
      <section id="auth_view">
        <article className="auth-methods">
          <ComponentNav
            fullWidth
            navItems={p.authNavItems}
            selectedNav={s.selectedNav}
            updateSelectedNav={this.updateSelectedNav}
          />
          <button
            className={classNames('auth-airbitz unstyled', { selected: s.selectedAuthMethod === AUTH_TYPE_AIRBITZ })}
            onClick={() => {
              this.updateSelectedAuthMethod(AUTH_TYPE_AIRBITZ);

              if (s.selectedAuthMethod !== AUTH_TYPE_AIRBITZ) {
                p.authAirbitz.airbitzLoginLink.onClick();
              }
            }}
          >
            <AirbitzLogoIcon /> <span>{s.selectedNav === AUTH_SIGNUP ? 'Signup' : 'Login'} with Airbitz</span>
          </button>
          <h4>or</h4>
          {s.selectedNav === AUTH_SIGNUP &&
            <AuthSignup {...p.authSignup} />
          }
          {s.selectedNav === AUTH_LOGIN &&
            <AuthLogin {...p.authLogin} />
          }
          {s.selectedNav === AUTH_IMPORT &&
            <AuthImport {...p.authImport} />
          }
        </article>
      </section>
    );
  }
}


// <button
//   className={classNames('auth-login-id unstyled', { selected: s.selectedAuthMethod === AUTH_TYPE_LOGIN_ID })}
//   onClick={() => {
//     this.updateSelectedAuthMethod(AUTH_TYPE_LOGIN_ID);
//   }}
// >
//   <span className="auth-button-title">Login ID</span>
//   {s.selectedAuthMethod === AUTH_TYPE_LOGIN_ID &&
//     <div className="auth-login-id-method-selection">
//       <button
//         className={classNames('unstyled', { selected: s.selectedLoginIDMethod === AUTH_TYPE_SIGN_UP_WITH_LOGIN_ID })}
//         onClick={(e) => {
//           e.stopPropagation();
//           this.updateSelectedLoginIDMethod(AUTH_TYPE_SIGN_UP_WITH_LOGIN_ID);
//         }}
//       >
//         Sign Up
//       </button>
//       <button
//         className={classNames('unstyled', { selected: s.selectedLoginIDMethod === AUTH_TYPE_LOGIN_WITH_LOGIN_ID })}
//         onClick={(e) => {
//           e.stopPropagation();
//           this.updateSelectedLoginIDMethod(AUTH_TYPE_LOGIN_WITH_LOGIN_ID);
//         }}
//       >
//         Login
//       </button>
//     </div>
//   }
//   {s.selectedAuthMethod === AUTH_TYPE_LOGIN_ID && s.selectedLoginIDMethod === AUTH_TYPE_LOGIN_WITH_LOGIN_ID &&
//     <AuthLogin {...p.authLogin} />
//   }
//   {s.selectedAuthMethod === AUTH_TYPE_LOGIN_ID && s.selectedLoginIDMethod === AUTH_TYPE_SIGN_UP_WITH_LOGIN_ID &&
//     <AuthSignup {...p.authSignup} />
//   }
// </button>
// <button
//   className={classNames('auth-import unstyled', { selected: s.selectedAuthMethod === AUTH_TYPE_IMPORT })}
//   onClick={() => {
//     this.updateSelectedAuthMethod(AUTH_TYPE_IMPORT);
//   }}
// >
//   <span className="auth-button-title">Account File</span>
//   {s.selectedAuthMethod === AUTH_TYPE_IMPORT &&
//     <AuthImport {...p.authImport} />
//   }
// </button>
