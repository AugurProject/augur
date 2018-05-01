import { connect } from 'react-redux'
import MarketReportingPayouts from 'modules/reporting/components/reporting-payouts/reporting-payouts'

const mapStateToProps = state => ({
  isMobile: state.isMobile,
  isMobileSmall: state.isMobileSmall,
})

const mergeProps = (sP, dP, oP) => ({
  ...oP,
  ...sP,
  ...dP,
})

export default connect(mapStateToProps, mergeProps)(MarketReportingPayouts)
