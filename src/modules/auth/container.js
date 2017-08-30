import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AuthView from 'modules/auth/components/auth-view/auth-view'

import { register, setupAndFundNewAccount } from 'modules/auth/actions/register'
import { login } from 'modules/auth/actions/login'
import { importAccount } from 'modules/auth/actions/import-account'

import { loginWithAirbitz } from 'modules/auth/actions/login-with-airbitz'
import selectABCUIContext from 'modules/auth/helpers/abc'

import { AUTH_NAV_ITEMS } from 'modules/auth/constants/auth-nav-items'

const mapStateToProps = state => ({
  authNavItems: AUTH_NAV_ITEMS
})

const mapDispatchToProps = dispatch => ({
  register: (pass, cb) => dispatch(register(pass, cb)),
  setupAndFundNewAccount: (pass, id, remember, cb) => dispatch(setupAndFundNewAccount(pass, id, remember, cb)),
  submitLogin: (id, pass, remember, cb) => dispatch(login(id, pass, remember, cb)),
  importAccount: (pass, remember, keystore) => dispatch(importAccount(pass, remember, keystore)),
  airbitzLoginLink: history => selectABCUIContext().openLoginWindow((result, airbitzAccount) => {
    if (airbitzAccount) {
      dispatch(loginWithAirbitz(airbitzAccount, history))
    } else {
      console.log('error registering in: ' + result)
    }
  }),
  airbitzOnLoad: (history) => {
    const abcContext = selectABCUIContext().abcContext
    const usernames = abcContext.listUsernames()
    if (usernames.length > 0) {
      selectABCUIContext().openLoginWindow((result, airbitzAccount) => {
        if (airbitzAccount) {
          dispatch(loginWithAirbitz(airbitzAccount, history))
        } else {
          console.log('error registering in: ' + result)
        }
      })
    }
  }
})

const Auth = withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthView))

export default Auth
