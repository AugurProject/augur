import { connect } from 'react-redux'
import MarketReportingPayouts from 'modules/reporting/components/reporting-payouts/reporting-payouts'

const mapStateToProps = state => ({
  isMobile: state.isMobile,
  isMobileSmall: state.isMobileSmall,
})

export default connect(mapStateToProps)(MarketReportingPayouts)
