import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import classNames from 'classnames'

import { Export } from 'modules/common/components/icons/icons'

import generateDownloadAccountLink from 'modules/auth/helpers/generate-download-account-link'

import makePath from 'modules/routes/helpers/make-path'
import trimString from 'utils/trim-string'

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
      error: null,
      password: '',
      keystore: null
    }
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('nextState -- ', nextState)
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
                          password: '',
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
              </label>
              <input
                id="keyword_create_passphrase"
                type="password"
                value={s.password}
                placeholder="Passphrase"
                disabled={s.keystore === null}
                onChange={e => this.setState({ password: e.target.value })}
              />
            </div>
            <div className={Styles.Keystore__actions}>
              <button
                className={
                  classNames(
                    Styles[`button--purple`],
                    {
                      [Styles[`button--disabled`]]: s.password !== '' || s.keystore === null
                    }
                  )
                }
                disabled={s.password || s.keystore === null}
              >
                connect
              </button>
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
