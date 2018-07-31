import React from 'react'
import PropTypes from 'prop-types'
import { Route, withRouter } from 'react-router-dom'

import parseQuery from 'modules/routes/helpers/parse-query'

// NOTE -- To Use:
//  Pass in an object, keyed by param name
//  This will see if _all_ params are present + have matched values
const ParamsRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const currentParams = parseQuery(props.location.search)
      const shouldRender = Object.keys(rest.params).every(paramName => currentParams[paramName] != null && currentParams[paramName] === rest.params[paramName])

      return shouldRender ?
        <Component {...props} /> :
        null
    }}
  />
)

ParamsRoute.propTypes = {
  location: PropTypes.object.isRequired,
  component: PropTypes.any,
}

export default withRouter(ParamsRoute)
