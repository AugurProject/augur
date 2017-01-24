import React, { Component } from 'react';

export default class AuthLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMethod: null
    };

    this.updateSelectedMethod = this.updateSelectedMethod.bind(this);
  }

  updateSelectedMethod(selectedMethod) {
    this.setState({ selectedMethod });
  }

  render() {
    // const s = this.state;

    return (
      <article className="auth-login-form">
        <span>Login</span>
      </article>
    );
  }
}
