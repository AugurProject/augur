import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import zxcvbn from 'zxcvbn'
import Clipboard from 'clipboard'
import classNames from 'classnames'

import generateDownloadAccountLink from 'modules/auth/helpers/generate-download-account-link'

import Styles from 'modules/auth/components/keystore-create/keystore-create.styles'

export default class Keystore extends Component {
  propTypes = {
    register: PropTypes.func.isRequired
  }

  constructor() {
    super()

    this.state = {
      password: '',
      passwordConfirm: '',
      currentScore: 0,
      passwordSuggestions: [],
      keystoreCreationError: null,
      passwordsMatch: false,
      keystore: null,
      isStrongPass: null,
      copiedText: false,
      downloadAccountDataString: '',
      downloadAccountFileName: ''
    }

    this.scorePassword = this.scorePassword.bind(this)
  }

  componentDidMount() {
    const clipboard = new Clipboard('#copy_keystore') // eslint-disable-line

    clipboard.on('success', () => this.setState({ copiedText: true }, () => {
      this.timeout = setTimeout(() => {
        this.setState({ copiedText: false })
        this.timeout = null
      }, 2000)
    }))
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.passwordsMatch !== nextState.passwordsMatch &&
      nextState.passwordsMatch
    ) {
      nextProps.register(nextState.password, (err, account) => {
        this.setState({
          keystoreCreationError: err === null ? null : err.message,
          keystore: err === null ? JSON.stringify(account.keystore) : null
        })

        if (err === null) {
          const { downloadAccountDataString, downloadAccountFileName } = generateDownloadAccountLink(account.address, account.keystore, account.privateKey)

          this.setState({
            downloadAccountDataString,
            downloadAccountFileName
          })
        }
      })
    }

    if (
      nextState.keystore !== null &&
      !nextState.passwordsMatch
    ) {
      this.setState({
        keystore: null
      })
    }
  }

  componentWillUnmount() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }

  scorePassword = (password) => {
    const scoreResult = zxcvbn(password)
    const passwordSuggestions = scoreResult.feedback.suggestions
    const currentScore = scoreResult.score

    this.setState({
      currentScore,
      passwordSuggestions
    })

    if (passwordSuggestions.length && !this.state.isPasswordsSuggestionDisplayable) {
      this.setState({ isPasswordsSuggestionDisplayable: true })
    }

    //  per zxcvbn docs --
    //  3: safely unguessable: moderate protection from offline slow-hash scenario. (guesses < 10^10)
    if (currentScore >= 3 && password !== '') {
      this.setState({
        isStrongPass: true
      })
    } else if (this.state.isStrongPass === true) {
      this.setState({ isStrongPass: false })
    }
  }

  render() {
    const s = this.state

    return (
      <section className={Styles.Keystore}>
        <Helmet>
          <title>Keystore</title>
        </Helmet>
        <div className={Styles.Keystore__content}>
          <form
            className={Styles.Keystore__form}
            onSubmit={e => e.preventDefault()}
          >
            <h3>We will generate a keystore that is only accessible with your passphrase.</h3>
            <div
              className={Styles.Keystore__input}
            >
              <label
                htmlFor="keyword_create_passphrase"
              >
                Passphrase
              </label>
              <input
                id="keyword_create_passphrase"
                type="password"
                value={s.password}
                onChange={(e) => {
                  const password = e.target.value
                  this.setState({
                    password,
                    passwordConfirm: '',
                    passwordsMatch: false
                  })
                  this.scorePassword(password)
                }}
              />
            </div>
            <div
              className={Styles.Keystore__input}
            >
              <label
                htmlFor="keyword_create_passphrase-confirm"
              >
                Confirm
              </label>
              <input
                id="keyword_create_passphrase_confirm"
                type="password"
                value={s.passwordConfirm}
                disabled={!s.isStrongPass}
                onChange={(e) => {
                  const passwordConfirm = e.target.value
                  this.setState({
                    passwordConfirm,
                    passwordsMatch: s.password === passwordConfirm
                  })
                }}
              />
            </div>
            <div className={Styles.Keystore__actions}>
              { document.queryCommandSupported('copy') &&
                <button
                  id="copy_keystore"
                  className={
                    classNames(
                      Styles[`button--purple`],
                      {
                        [Styles[`button--disabled`]]: s.keystore === null
                      }
                    )
                  }
                  disabled={s.keystore === null}
                  data-clipboard-text={s.keystore}
                >
                  { s.copiedText ? 'copied' : 'copy' }
                </button>
              }
              <a
                className={
                  classNames(Styles[`button--purple`],
                    {
                      [Styles[`button--disabled`]]: s.keystore === null
                    }
                  )
                }
                href={s.downloadAccountDataString}
                download={s.downloadAccountFileName}
              >
                download
              </a>
            </div>
          </form>
          <div className={Styles.Keystore__instruction}>
            {!!s.password.length && !!s.passwordSuggestions.length &&
              <div className={Styles.Keystore__suggestions}>
                <h3>Suggestions:</h3>
                <ul>
                  {s.passwordSuggestions.map(suggestion => (
                    <li
                      key={suggestion}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            }
            {s.keystoreCreationError !== null &&
              <span>{s.keystoreCreationError}</span>
            }
          </div>
        </div>
      </section>
    )
  }
}
