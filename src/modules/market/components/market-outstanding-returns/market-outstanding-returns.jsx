import React from 'react'
import PropTypes from 'prop-types'

const OutstandingReturns = p => (
  <div>
      Outstanding Returns {p.unclaimedCreatorFees.full}
  </div>
)

OutstandingReturns.propTypes = {
  unclaimedCreatorFees: PropTypes.object.isRequired
}

export default OutstandingReturns
