import React, { Component, PropTypes } from 'react';

import AuthLogin from 'modules/auth/components/auth-login';
import AuthSignup from 'modules/auth/components/auth-signup';
import ComponentNav from 'modules/common/components/component-nav';

import { AUTH_SIGNUP, AUTH_LOGIN } from 'modules/app/constants/views';

export default class AuthView extends Component {
  static propTypes = {
    authForm: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedNav: AUTH_SIGNUP
    };

    this.updateSelectedNav = this.updateSelectedNav.bind(this);
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
        {s.selectedNav === AUTH_SIGNUP &&
          <AuthSignup />
        }
        {s.selectedNav === AUTH_LOGIN &&
          <AuthLogin />
        }
      </section>
    );
  }
}
