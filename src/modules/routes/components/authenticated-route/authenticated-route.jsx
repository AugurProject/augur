import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

import makePath from 'modules/routes/helpers/make-path'

import getValue from 'utils/get-value'

import { AUTHENTICATION } from 'modules/routes/constants/views'

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
