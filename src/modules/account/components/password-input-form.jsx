import React, { Component, PropTypes } from 'react';
import encryptPrivateKeyWithPassword from 'modules/auth/actions/encrypt-privatekey-with-password';
import generateDownloadAccountLink from 'modules/auth/actions/generate-download-account-link';

export default class PasswordInputForm extends Component {

  static propTypes = {
    privateKey: PropTypes.array
  }

  constructor(props) {
    super(props);
    this.state = {
      isReadyToDownload: false,
      downloadAccountDataString: undefined,
      downloadAccountFileName: undefined,
      passwordInput: '',
      privateKey: props.privateKey
    };
    this.handleSubmitPasswordInput = this.handleSubmitPasswordInput.bind(this);
  }

  handleSubmitPasswordInput(e) {
    e.preventDefault();
    encryptPrivateKeyWithPassword(
      this.state.passwordInput,
      this.state.privateKey,
      keystore => this.setState({
        ...generateDownloadAccountLink(keystore.address, keystore),
        isReadyToDownload: true
      })
    );
  }

  render() {
    return (
      <form onSubmit={this.handleSubmitPasswordInput}>
        <h3>Please enter your password:</h3>
        <input
          type="password"
          placeholder="Password"
          value={this.state.passwordInput}
          onChange={e => this.setState({ passwordInput: e.target.value })}
        />
        {!this.state.isReadyToDownload &&
          <input type="submit" value="Generate Key File" />
        }
        {this.state.isReadyToDownload &&
          <a
            className="button"
            href={this.state.downloadAccountDataString}
            download={this.state.downloadAccountFileName}
          >
            Download Key File
          </a>
        }
      </form>
    );
  }
}
