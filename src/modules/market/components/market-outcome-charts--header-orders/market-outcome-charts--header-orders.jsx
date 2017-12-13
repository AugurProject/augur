import React from 'react'
import PropTypes from 'prop-types'

const MarketOutcomeChartsHeaderOrders = p => (
  <span>orders</span>
)

export default MarketOutcomeChartsHeaderOrders

MarketOutcomeChartsHeaderOrders.propTypes = {
  fixedPrecision: PropTypes.number.isRequired
}
