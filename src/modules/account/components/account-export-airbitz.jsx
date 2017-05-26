import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import zxcvbn from 'zxcvbn';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import encryptPrivateKeyWithPassword from 'modules/auth/helpers/encrypt-privatekey-with-password';
import generateDownloadAccountLink from 'modules/auth/helpers/generate-download-account-link';
import Input from 'modules/common/components/input';
import Spinner from 'modules/common/components/spinner';

import { REQUIRED_PASSWORD_STRENGTH } from 'modules/auth/constants/password-strength';

export default class AccountExportAirbitz extends Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      passwordConfirm: '',
      isStrongPass: false,
      isPasswordConfirmDisplayable: false,
      passwordSuggestions: [],
      isValid: false,
      formComplete: false,
      generatingKeyFile: false,
      keyFileGenerated: false,
      stringifiedKeystore: null,
      downloadAccountDataString: null,
      downloadAccountFileName: null,
      animationSpeed: 0
    };

    this.updateAnimationSpeedValue = this.updateAnimationSpeedValue.bind(this);
    this.generateEncryptedKeyFile = this.generateEncryptedKeyFile.bind(this);
    this.scorePassword = this.scorePassword.bind(this);
  }

  componentDidMount() {
    this.updateAnimationSpeedValue();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.passwordConfirm.length && !nextState.isStrongPass) this.setState({ passwordConfirm: '' });

    if (this.state.passwordConfirm !== nextState.passwordConfirm && nextState.passwordConfirm !== '') {
      if (nextState.password === nextState.passwordConfirm) {
        this.setState({ isValid: true });
      } else {
        this.setState({ isValid: false });
      }
    }

    if (this.state.isValid !== nextState.isValid && nextState.isValid) {
      console.log('here');
      this.setState({
        formComplete: true
      }, () => {
        setTimeout(() => {
          console.log('make call');
          this.generateEncryptedKeyFile();
        }, nextState.animationSpeed); // Allow for animations before calling blocking method
      });
    }
  }

  scorePassword = (password) => {
    const scoreResult = zxcvbn(password);
    const passwordSuggestions = scoreResult.feedback.suggestions;
    const currentScore = scoreResult.score;

    console.log('scoreResult -- ', scoreResult);

    this.setState({
      passwordSuggestions
    });

    if (passwordSuggestions.length && !this.state.isPasswordsSuggestionDisplayable) {
      this.setState({ isPasswordsSuggestionDisplayable: true });
    }

    if (currentScore >= REQUIRED_PASSWORD_STRENGTH) {
      this.setState({
        isStrongPass: true,
        isPasswordConfirmDisplayable: true
      });
    } else if (this.state.isStrongPass === true) {
      this.setState({
        isStrongPass: false,
        isPasswordConfirmDisplayable: false
      });
    }
  }

  generateEncryptedKeyFile() {
    console.log('handle it');
    this.setState({
      generatingKeyFile: true
    }, () => {
      encryptPrivateKeyWithPassword(
        this.state.password,
        (keystore) => {
          console.log('keystore -- ', keystore);

          this.setState({
            generatingKeyFile: false,
            keyFileGenerated: true,
            ...generateDownloadAccountLink(keystore.address, keystore)
          });
        }
      );
    });
  }

  updateAnimationSpeedValue() {
    this.setState({
      animationSpeed: parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-very-fast'), 10)
    });
  }

  render() {
    const s = this.state;

    return (
      <article className="account-export-airbitz">
        <CSSTransitionGroup
          component="div"
          transitionName="export-form"
          transitionEnter={false}
          transitionLeaveTimeout={s.animationSpeed}
        >
          {!s.formComplete &&
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log('submt');

                this.handleSubmitPassword();
              }}
            >
              <Input
                autoFocus
                canToggleVisibility
                className={classNames('account-export-password', { 'input-error': s.authError })}
                disabled={s.generatingKeyFile || s.keyFileGenerated}
                name="password"
                type="password"
                placeholder="Password"
                value={s.password}
                onChange={(password) => {
                  this.setState({ password });
                  this.scorePassword(password);
                }}
              />
              <div className="account-export-overlappers">
                <CSSTransitionGroup
                  component="div"
                  transitionName="password-suggestions"
                  transitionEnterTimeout={s.animationSpeed}
                  transitionLeaveTimeout={s.animationSpeed}
                >
                  <ul className="account-export-password-suggestions">
                    {s.passwordSuggestions.map((suggestion, i) => (
                      <li
                        key={suggestion}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </CSSTransitionGroup>
                <CSSTransitionGroup
                  component="div"
                  transitionName="password-confirm"
                  transitionEnterTimeout={s.animationSpeed}
                  transitionLeaveTimeout={s.animationSpeed}
                >
                  {s.isStrongPass &&
                    <Input
                      className={classNames('account-export-password-confirm', {
                        'input-error': s.authError,
                      })}
                      disabled={!s.isStrongPass || s.generatingKeyFile || s.keyFileGenerated}
                      shouldMatchValue
                      comparisonValue={s.password}
                      name="password-confirm"
                      type="password"
                      placeholder="Confirm Password"
                      value={s.passwordConfirm}
                      onChange={(passwordConfirm) => {
                        this.setState({ passwordConfirm });
                      }}
                    />
                  }
                </CSSTransitionGroup>
              </div>
            </form>
          }
        </CSSTransitionGroup>
        <CSSTransitionGroup
          container="div"
          transitionName="generating"
          transitionEnterTimeout={s.animationSpeed}
          transitionLeaveTimeout={s.animationSpeed}
        >
          {s.generatingKeyFile &&
            <div
              className={classNames('account-export-generating-key-file', {})}
            >
              <span>Generating Encrypted Key File</span>
              <Spinner />
            </div>
          }
        </CSSTransitionGroup>
        <CSSTransitionGroup
          container="div"
          transitionName="keyfile"
          transitionEnterTimeout={s.animationSpeed}
          transitionLeave={false}
        >
          {s.keyFileGenerated &&
            <span>Generated</span>
          }
        </CSSTransitionGroup>
      </article>
    );
  }
}

// <Input
//   type="password"
//   value={s.pass}
//   onChange={(pass) => {
//     if (pass.length) {
//       this.setState({
//         canSubmit: true
//       });
//     } else {
//       this.setState({
//         canSubmit: false
//       });
//     }
//
//     this.setState({
//       pass
//     });
//   }}
// />

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
