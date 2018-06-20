import React from 'react'
import PropTypes from 'prop-types'
import Styles from 'modules/market/components/market-outcome-charts--midpoint/market-outcome-charts--midpoint.styles'

const Midpoint = (props) => {

  const {
    orderBookKeys,
    fixedPrecision,
  } = props

  return (
    <div className={Styles.MarketOutcomeMidpoint}>
      <div className={Styles.MarketOutcomeMidpointLine} />
      <div className={Styles.MarketOutcomeMidpointValue}>
        {`${orderBookKeys.mid.toFixed(fixedPrecision)} ETH`}
      </div>
    </div>
  )
}


Midpoint.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  chartWidths: PropTypes.object.isRequired,
  headerHeight: PropTypes.number.isRequired,
  orderBookKeys: PropTypes.object.isRequired,
  sharedChartMargins: PropTypes.object.isRequired,
  hasOrders: PropTypes.bool.isRequired,
  fixedPrecision: PropTypes.number.isRequired,
  hasPriceHistory: PropTypes.bool,
}

export default Midpoint
