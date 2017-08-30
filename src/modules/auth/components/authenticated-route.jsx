import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

import { AUTHENTICATION } from 'modules/app/constants/views'

import makePath from 'modules/app/helpers/make-path'

import getValue from 'utils/get-value'

const AuthenticatedRoute = ({ component: Component, isLogged, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isLogged ?
        <Component {...props} /> :
        <Redirect to={makePath(AUTHENTICATION)} />
    )}
  />
)

AuthenticatedRoute.propTypes = {
  component: PropTypes.any, // TODO
  isLogged: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  isLogged: !!getValue(state, 'loginAccount.address')
})

export default connect(mapStateToProps)(AuthenticatedRoute)
