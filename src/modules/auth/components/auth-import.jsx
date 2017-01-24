import React, { Component } from 'react';

export default class AuthImport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      loginAccount: null,
      rememberMe: true
    };
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <form
        className="auth-import-form"
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();

          console.log('submit! -- ', s.loginAccount);

          p.importAccountFromFile(s.password, s.rememberMe, s.loginAccount);
        }}
      >
        <input
          name="file"
          type="file"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            console.log('e.target -- ', e.target.files[0]);

            const fileReader = new FileReader();

            fileReader.readAsText(e.target.files[0]);
            fileReader.onload = (e) => {
              this.setState({ loginAccount: JSON.parse(e.target.result) });
            };
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
          value="Import"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </form>
    );
  }
}
