import React, { Component } from 'react';

export default class AuthLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      augurID: '',
      password: '',
      rememberMe: true // Defaults to true
    };
  }

  render() {
    const p = this.props;
    const s = this.state;

    // console.log('p -- ', p);

    return (
      <form
        className="auth-login-form"
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          console.log('submit! -- ', s.augurID, s.password, s.rememberMe);
          console.log('p -- ', p);

          p.submitLogin(s.augurID, s.password, s.rememberMe);
        }}
      >
        <input
          name="augur-id"
          type="text"
          placeholder="Augur ID"
          autoFocus
          value={s.augurID}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            this.setState({ augurID: e.target.value });
          }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={s.password}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            this.setState({ password: e.target.value });
          }}
        />
        <label // eslint-disable-line jsx-a11y/no-static-element-interactions
          htmlFor="remember_me_input"
          onClick={(e) => {
            e.stopPropagation();
          }}
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
          type="submit"
          value="Login"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </form>
    );
  }
}
