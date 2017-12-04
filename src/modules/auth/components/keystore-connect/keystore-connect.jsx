import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import { Export } from 'modules/common/components/icons/icons'

import makePath from 'modules/routes/helpers/make-path'
import trimString from 'utils/trim-string'

import { DEFAULT_VIEW } from 'modules/routes/constants/views'

import Styles from 'modules/auth/components/keystore-connect/keystore-connect.styles'

export default class KeystoreConnect extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    importAccount: PropTypes.func.isRequired
  }

  constructor() {
    super()

    this.state = {
      error: null,
      password: '',
      keystore: null
    }

    this.handleRecoverError = this.handleRecoverError.bind(this)
  }

  componentDidMount() {
    // NOTE --  keythereum (as of implementation) simply throws when a private key
    //          is unable to be recovered, so this error is handled thusly
    window.addEventListener('error', this.handleRecoverError)
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleRecoverError)
  }

  handleRecoverError(err) {
    this.setState({
      error: 'Unable to recover account from file'
    })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <section className={Styles.Keystore}>
        <Helmet>
          <title>Keystore</title>
        </Helmet>
        <div className={Styles.Keystore__content}>
          <form
            className={Styles.Keystore__form}
            onSubmit={(e) => {
              e.preventDefault()

              if (s.keystore && s.password) {
                p.importAccount(s.password, s.keystore, (err) => {
                  if (err) {
                    return this.setState({
                      error: 'Account Import Failed'
                    })
                  }

                  p.history.push(makePath(DEFAULT_VIEW))
                })
              }
            }}
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
                        error: 'Incorrect file type',
                        password: '',
                        keystore: null
                      })
                    }
                    const fileReader = new FileReader()

                    fileReader.readAsText(e.target.files[0])

                    fileReader.onload = (e) => {
                      try {
                        const keystore = JSON.parse(e.target.result)
                        this.setState({
                          error: null,
                          keystore,
                        })
                      } catch (err) {
                        this.setState({
                          error: 'Malformed account file',
                          password: '',
                          keystore: null
                        })
                      }
                    }
                  } else {
                    this.setState({
                      error: null,
                      password: '',
                      keystore: null
                    })
                  }
                }}
              />
              <label
                htmlFor="keystore_connect_file"
              >
                <span>{Export}</span>
                {s.keystore === null ?
                  'Upload File' :
                  trimString(s.keystore.address)
                }
              </label>
            </div>
            <div
              className={Styles.Keystore__input}
            >
              <label
                htmlFor="keyword_create_passphrase"
              >
                Passphrase
                <input
                  id="keyword_create_passphrase"
                  type="password"
                  value={s.password}
                  placeholder="Passphrase"
                  onChange={e => this.setState({ password: e.target.value })}
                />
              </label>
            </div>
            <div className={Styles.Keystore__actions}>
              <button
                disabled={s.password === '' || s.keystore === null}
              >
                connect
              </button>
            </div>
          </form>
          <div className={Styles.Keystore__instruction}>
            {s.error !== null &&
              <div>
                <h3>Error:</h3>
                <span>{s.error}</span>
              </div>
            }
          </div>
        </div>
      </section>
    )
  }
}
