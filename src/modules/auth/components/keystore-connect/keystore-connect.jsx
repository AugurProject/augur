import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import classNames from 'classnames'

import { Export } from 'modules/common/components/icons/icons'

import generateDownloadAccountLink from 'modules/auth/helpers/generate-download-account-link'

import makePath from 'modules/routes/helpers/make-path'

import { MARKETS } from 'modules/routes/constants/views'

import Styles from 'modules/auth/components/keystore-connect/keystore-connect.styles'

export default class KeystoreConnect extends Component {
  propTypes = {
    history: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired
  }

  constructor() {
    super()

    this.state = {
      password: '',
      fileContents: null,
      keystoreConnectionError: null
    }
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
        keystore: null,
        downloadAccountDataString: null,
        downloadAccountFileName: null
      })
    }

    if (
      this.state.assertedCompetence !== nextState.assertedCompetence &&
      nextState.assertedCompetence
    ) {
      nextProps.login(JSON.parse(nextState.keystore), nextState.password, (err) => {
        if (err === null) {
          nextProps.history.push(makePath(MARKETS))
        }
      })
    }
  }

  componentWillUnmount() {
    if (this.copiedTextTimeout !== null || this.downloadedTimeout !== null) {
      clearTimeout(this.copiedTextTimeout)
      this.copiedTextTimeout = null

      clearTimeout(this.downloadedTimeout)
      this.downloadedTimeout = null
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
            <div
              className={Styles.Keystore__input}
            >
              <input
                id="keystore_connect_file"
                className={Styles.Keystore__file}
                type="file"
                onChange={(e) => {
                  if (e.target.files.length) {
                    if (e.target.files[0].type !== '') {
                      this.setState({
                        authError: true,
                        errorMessage: 'Incorrect file type',
                        isAuthErrorDisplayable: true,
                        password: '',
                        loginAccount: null
                      })
                    }
                    const fileReader = new FileReader()

                    fileReader.readAsText(e.target.files[0])

                    fileReader.onload = (e) => {
                      try {
                        const loginAccount = JSON.parse(e.target.result)
                        this.setState({
                          loginAccount,
                          password: '',
                          authError: false
                        })

                        if (!this.state.isPasswordDisplayable) {
                          this.setState({ isPasswordDisplayable: true })
                        }
                      } catch (err) {
                        this.setState({
                          authError: true,
                          errorMessage: 'Malformed account file',
                          isAuthErrorDisplayable: true,
                          password: '',
                          loginAccount: null
                        })
                      }
                    }
                  } else {
                    this.setState({
                      loginAccount: null,
                      password: '',
                      authError: false
                    })
                  }
                }}
              />
              <label
                htmlFor="keystore_connect_file"
              >
                <span>{Export}</span>
                Upload File
              </label>
            </div>
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
                placeholder="Passphrase"
                onChange={e => this.setState({ password: e.target.value })}
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
                  connect
                </button>
              }
            </div>
          </form>
          <div className={Styles.Keystore__instruction}>
            {s.keystoreConnectionError !== null &&
              <span>{s.keystoreConnectionError}</span>
            }
          </div>
        </div>
      </section>
    )
  }
}
