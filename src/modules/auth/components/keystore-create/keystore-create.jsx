import React, { Component } from 'react'
import Helmet from 'react-helmet'
import zxcvbn from 'zxcvbn'

import Styles from 'modules/auth/components/keystore-create/keystore-create.styles'

export default class Keystore extends Component {
  constructor() {
    super()

    this.state = {
      password: '',
      passwordConfirm: '',
      currentScore: null,
      passwordSuggestions: [],
      keystore: null,
      isStrongPass: null
    }

    this.scorePassword = this.scorePassword.bind(this)
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

    console.log('s -- ', s)

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

              console.log('e --- ', e)
            }}
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
                  this.setState({ password })
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
                disabled={!s.isStrongPass}
                onChange={(e) => {
                  const passwordConfirm = e.target.value
                  this.setState({ passwordConfirm })
                }}
              />
            </div>
            <div className={Styles.Keystore__actions}>
              { document.queryCommandSupported('copy') &&
                <button
                  className={Styles[`button--purple`]}
                  disabled={s.keystore === null}
                >
                  copy
                </button>
              }
              <button
                className={Styles[`button--purple`]}
                disabled={s.keystore === null}
              >
                download
              </button>
            </div>
          </form>
          <div className={Styles.Keystore__instruction}>
            {!!s.password.length && !!s.passwordSuggestions.length &&
              <div className={Styles.Keystore__suggestions}>
                <h3>Suggestions:</h3>
                <ul>
                  {s.passwordSuggestions.map(suggestion => (
                    <li>{suggestion}</li>
                  ))}
                </ul>
              </div>
            }
          </div>
        </div>
      </section>
    )
  }
}
