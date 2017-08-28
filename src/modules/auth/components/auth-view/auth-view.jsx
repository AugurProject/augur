import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import AuthLogin from 'modules/auth/components/auth-login/auth-login';
import AuthSignup from 'modules/auth/components/auth-signup';
import AuthImport from 'modules/auth/components/auth-import';
import AirbitzLogoIcon from 'modules/common/components/airbitz-logo-icon';

import ComponentNav from 'modules/common/components/component-nav';

import { SIGNUP, LOGIN, IMPORT } from 'modules/app/constants/views';

import Styles from 'modules/auth/components/auth-view/auth-view.styles';

export default class AuthView extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    authNavItems: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    setupAndFundNewAccount: PropTypes.func.isRequired,
    submitLogin: PropTypes.func.isRequired,
    importAccount: PropTypes.func.isRequired,
    airbitzLoginLink: PropTypes.func.isRequired,
    airbitzOnLoad: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedNav: SIGNUP,
      selectedAuthMethod: null,
      selectedLoginIDMethod: null
    };

    this.updateSelectedNav = this.updateSelectedNav.bind(this);
    this.updateSelectedAuthMethod = this.updateSelectedAuthMethod.bind(this);
    this.updateSelectedLoginIDMethod = this.updateSelectedLoginIDMethod.bind(this);
  }

  componentDidMount() {
    this.props.airbitzOnLoad(this.props.history);
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
      <section className={Styles.AuthView}>
        <Helmet>
          <title>Authentication</title>
        </Helmet>
        <article className={Styles.AuthView__methods}>
          <ComponentNav
            fullWidth
            navItems={p.authNavItems}
            selectedNav={s.selectedNav}
            updateSelectedNav={this.updateSelectedNav}
          />
          {s.selectedNav !== IMPORT &&
            <div className={Styles.AuthView__default}>
              <button
                className={Styles.AuthView__airbitz}
                onClick={p.airbitzLoginLink}
              >
                <div>
                  <AirbitzLogoIcon />
                  <span>
                    {s.selectedNav === SIGNUP ? 'Signup' : 'Login'} with Airbitz
                  </span>
                </div>
              </button>
              <h4>or</h4>
            </div>
          }
          {s.selectedNav === SIGNUP &&
            <AuthSignup
              history={p.history}
              register={p.register}
              setupAndFundNewAccount={p.setupAndFundNewAccount}
            />
          }
          {s.selectedNav === LOGIN &&
            <AuthLogin
              history={p.history}
              submitLogin={p.submitLogin}
            />
          }
          {s.selectedNav === IMPORT &&
            <AuthImport
              history={p.history}
              importAccount={p.importAccount}
            />
          }
        </article>
      </section>
    );
  }
}
