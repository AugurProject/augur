import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import zxcvbn from 'zxcvbn'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import QRCode from 'qrcode.react'

import encryptPrivateKeyWithPassword from 'modules/auth/helpers/encrypt-privatekey-with-password'
import generateDownloadAccountLink from 'modules/auth/helpers/generate-download-account-link'
import Input from 'modules/common/components/input'
import Spinner from 'modules/common/components/spinner'

import { REQUIRED_PASSWORD_STRENGTH } from 'modules/auth/constants/password-strength'

export default class AccountExportAirbitz extends Component {
  static propTypes = {
    qrSize: PropTypes.number.isRequired,
    privateKey: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props)

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
    }

    this.updateAnimationSpeedValue = this.updateAnimationSpeedValue.bind(this)
    this.generateEncryptedKeyFile = this.generateEncryptedKeyFile.bind(this)
    this.scorePassword = this.scorePassword.bind(this)
  }

  componentDidMount() {
    this.updateAnimationSpeedValue()
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.passwordConfirm.length && !nextState.isStrongPass) this.setState({ passwordConfirm: '' })

    if (this.state.passwordConfirm !== nextState.passwordConfirm && nextState.passwordConfirm !== '') {
      if (nextState.password === nextState.passwordConfirm) {
        this.setState({ isValid: true })
      } else {
        this.setState({ isValid: false })
      }
    }

    if (this.state.isValid !== nextState.isValid && nextState.isValid) {
      this.setState({
        generatingKeyFile: true,
        formComplete: true
      }, () => {
        setTimeout(() => {
          this.generateEncryptedKeyFile()
        }, nextState.animationSpeed * 2) // Allow for animations before calling blocking method
      })
    }
  }

  scorePassword = (password) => {
    const scoreResult = zxcvbn(password)
    const passwordSuggestions = scoreResult.feedback.suggestions
    const currentScore = scoreResult.score

    this.setState({
      passwordSuggestions
    })

    if (passwordSuggestions.length && !this.state.isPasswordsSuggestionDisplayable) {
      this.setState({ isPasswordsSuggestionDisplayable: true })
    }

    if (currentScore >= REQUIRED_PASSWORD_STRENGTH) {
      this.setState({
        isStrongPass: true,
        isPasswordConfirmDisplayable: true
      })
    } else if (this.state.isStrongPass === true) {
      this.setState({
        isStrongPass: false,
        isPasswordConfirmDisplayable: false
      })
    }
  }

  generateEncryptedKeyFile() {
    encryptPrivateKeyWithPassword(
      this.state.password,
      this.props.privateKey,
      (keystore) => {
        this.setState({
          generatingKeyFile: false,
          keyFileGenerated: true,
          ...generateDownloadAccountLink(keystore.address, keystore, this.props.privateKey)
        })
      }
    )
  }

  updateAnimationSpeedValue() {
    this.setState({
      animationSpeed: parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-very-fast'), 10)
    })
  }

  render() {
    const p = this.props
    const s = this.state

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
                e.preventDefault()
                // NOTE -- submits automatically on password match
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
                  this.setState({ password })
                  this.scorePassword(password)
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
                        this.setState({ passwordConfirm })
                      }}
                    />
                  }
                </CSSTransitionGroup>
              </div>
            </form>
          }
        </CSSTransitionGroup>
        <CSSTransitionGroup
          component="div"
          transitionName="generating"
          transitionEnterTimeout={s.animationSpeed}
          transitionLeaveTimeout={s.animationSpeed}
        >
          {s.generatingKeyFile &&
            <div className="account-export-generating-keyfile">
              <span>Generating Encrypted Key File</span>
              <Spinner />
            </div>
          }
        </CSSTransitionGroup>
        <CSSTransitionGroup
          component="div"
          transitionName="keyfile"
          transitionEnterTimeout={s.animationSpeed}
          transitionLeave={false}
        >
          {s.keyFileGenerated &&
            <div className="account-export-account account-export-airbitz-keyfile">
              <QRCode
                value={p.privateKey}
                size={p.qrSize}
              />
              <h4>or</h4>
              <a
                className="button"
                href={s.downloadAccountDataString}
                download={s.downloadAccountFileName}
              >
                Download Key File
              </a>
            </div>
          }
        </CSSTransitionGroup>
      </article>
    )
  }
}
