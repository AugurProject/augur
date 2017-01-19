import React, { Component, PropTypes } from 'react';

import AuthLogin from 'modules/auth/compoenents/auth-login';
import AuthSignup from 'modules/auth/components/auth-signup';
import ComponentNav from 'modules/common/components/component-nav';

import { AUTH_SIGNUP, AUTH_LOGIN } from 'modules/app/constants/views';

class AuthPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNav: AUTH_SIGNUP
    };
  }

  componentDidMount() {
    this.props.authForm.airbitzOnLoad.onLoad();
  }

  updateSelectedNav(selectedNav) {
    this.setState({ selectedNav });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <section id="auth_view">
        <ComponentNav
          navItems={p.authNavItems}
          selectedNav={s.selectedNav}
          updateSelectedNav={this.updateSelectedNav}
        />
        <AuthForm
          className="auth-form"
          {...p.authForm}
        />
      </section>
    );
  }
}

AuthPage.propTypes = {
  className: PropTypes.string,
  authForm: PropTypes.object
};

export default AuthPage;
