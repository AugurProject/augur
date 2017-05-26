import React, { Component, PropTypes } from 'react';

import encryptPrivateKeyWithPassword from 'modules/auth/helpers/encrypt-privatekey-with-password';
import generateDownloadAccountLink from 'modules/auth/helpers/generate-download-account-link';
import Input from 'modules/common/components/input';

export default class AccountExportAirbitz extends Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);

    this.state = {
      pass: '',
      canSubmit: false,
      stringifiedKeystore: null,
      downloadAccountDataString: null,
      downloadAccountFileName: null
    };

    this.handleSubmitPassword = this.handleSubmitPassword.bind(this);
  }

  handleSubmitPassword(e) {
    e.preventDefault();
    encryptPrivateKeyWithPassword(
      this.state.passwordInput,
      keystore => this.setState({
        ...generateDownloadAccountLink(keystore.address, keystore)
      })
    );
  }

  render() {
    const s = this.state;

    return (
      <article className="account-export">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input
            type="password"
            value={s.pass}
            onChange={(pass) => {
              if (pass.length >= 10) {
                this.setState({
                  canSubmit: true
                });
              } else {
                this.setState({
                  canSubmit: false
                });
              }

              this.setState({
                pass
              });
            }}
          />
        </form>
      </article>
    );
  }
}

// 10 characters min

// <form onSubmit={this.handleSubmitPasswordInput}>
//   <h3>Please enter your password:</h3>
//   <input
//     type="password"
//     placeholder="Password"
//     value={this.state.passwordInput}
//     onChange={e => this.setState({ passwordInput: e.target.value })}
//   />
//   {!this.state.isReadyToDownload &&
//     <input type="submit" value="Generate Key File" />
//   }
//   {this.state.isReadyToDownload &&
//     <a
//       className="button"
//       href={this.state.downloadAccountDataString}
//       download={this.state.downloadAccountFileName}
//     >
//       Download Key File
//     </a>
//   }
// </form>
