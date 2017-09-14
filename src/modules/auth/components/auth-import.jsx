import React, { Component } from 'react'
import classNames from 'classnames'

import Input from 'modules/common/components/input/input'

import makePath from 'modules/routes/helpers/make-path'
import { DEFAULT_VIEW } from 'modules/routes/constants/views'

export default class AuthImport extends Component {
  constructor(props) {
    super(props)

    this.state = {
      password: '',
      loginAccount: null,
      authError: false,
      errorMessage: null,
      // These prevent a flash on component mount
      isPasswordDisplayable: false,
      isAuthErrorDisplayable: false,
      isImportActionsDisplayable: false
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
      authError: true,
      errorMessage: 'Unable to recover account from file',
      isAuthErrorDisplayable: true
    })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <form
        className="auth-import-form"
        onSubmit={(e) => {
          e.preventDefault()

          if (s.loginAccount && s.password) {
            p.importAccount(s.password, s.loginAccount, (err) => {
              if (err) {
                return this.setState({
                  authError: true,
                  errorMessage: 'Account Import Failed',
                  isAuthErrorDisplayable: true
                })
              }

              p.history.push(makePath(DEFAULT_VIEW))
            })
          }
        }}
      >
        <span className="soft-header">Import account from file</span>
        <input
          className={classNames('auth-import-file', {
            'input-error': s.authError
          })}
          name="file"
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
        <Input
          className={classNames('auth-import-password', {
            'input-error': s.authError,
            animateIn: s.loginAccount,
            animateOut: !s.loginAccount && s.isPasswordDisplayable
          })}
          disabled={!s.loginAccount}
          name="password"
          type="password"
          placeholder="Password"
          value={s.password}
          canToggleVisibility
          onChange={(password) => {
            this.setState({
              password,
              authError: false
            })

            if (!this.state.isImportActionsDisplayable) {
              this.setState({ isImportActionsDisplayable: true })
            }
          }}
        />
        <div
          className={classNames('auth-error', {
            animateIn: s.authError,
            animateOut: !s.authError && s.isAuthErrorDisplayable
          })}
        >
          <span>
            {s.errorMessage}
          </span>
        </div>
        <div
          className={classNames('auth-import-actions', {
            animateInPartial: s.loginAccount && s.password,
            animateOutPartial: (!s.loginAccount || !s.password) && s.isImportActionsDisplayable
          })}
        >
          <button
            className="submit"
            disabled={!s.loginAccount || !s.password}
            type="submit"
          >
            Import
          </button>
        </div>
      </form>
    )
  }
}
