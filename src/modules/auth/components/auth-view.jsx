import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AuthLogin from 'modules/auth/components/auth-login';
import AuthSignup from 'modules/auth/components/auth-signup';
import AuthImport from 'modules/auth/components/auth-import';
import AirbitzLogoIcon from 'modules/common/components/airbitz-logo-icon';

import ComponentNav from 'modules/common/components/component-nav';

import { AUTH_SIGNUP, AUTH_LOGIN, AUTH_IMPORT } from 'modules/app/constants/views';

export default class AuthView extends Component {
  static propTypes = {
    authNavItems: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    setupAndFundNewAccount: PropTypes.func.isRequired,
    submitLogin: PropTypes.func.isRequired,
    importAccount: PropTypes.func.isRequired,
    airbitzLoginLink: PropTypes.object.isRequired,
    airbitzOnLoad: PropTypes.object.isRequired
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

  componentDidMount() {
    this.props.airbitzOnLoad.onLoad();
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

    return (
      <section id="auth_view">
        <article className="auth-methods">
          <ComponentNav
            fullWidth
            navItems={p.authNavItems}
            selectedNav={s.selectedNav}
            updateSelectedNav={this.updateSelectedNav}
          />
          {s.selectedNav !== AUTH_IMPORT &&
            <div className="default-auth">
              <button
                className="auth-airbitz unstyled"
                onClick={p.airbitzLoginLink.onClick}
              >
                <div>
                  <AirbitzLogoIcon />
                  <span>
                    {s.selectedNav === AUTH_SIGNUP ? 'Signup' : 'Login'} with Airbitz
                  </span>
                </div>
              </button>
              <h4>or</h4>
            </div>
          }
          {s.selectedNav === AUTH_SIGNUP &&
            <AuthSignup
              register={p.register}
              setupAndFundNewAccount={p.setupAndFundNewAccount}
            />
          }
          {s.selectedNav === AUTH_LOGIN &&
            <AuthLogin
              submitLogin={p.submitLogin}
              airbitzLogin={p.airbitzLogin}
            />
          }
          {s.selectedNav === AUTH_IMPORT &&
            <AuthImport
              importAccountFromFile={p.importAccountFromFile}
            />
          }
        </article>
      </section>
    );
  }
}
