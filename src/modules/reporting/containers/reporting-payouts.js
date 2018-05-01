import { connect } from 'react-redux'
import MarketReportingPayouts from 'modules/reporting/components/reporting-payouts/reporting-payouts'

const mapStateToProps = state => ({
  isMobile: state.isMobile,
  isMobileSmall: state.isMobileSmall,
})

function mergeProps(stateProps, dispatchProps, ownProps) {

  console.log(ownProps)
  console.log(stateProps)

  //return R.mergeAll([stateProps, dispatchProps, ownProps]);
}
console.log('hi2')

export default connect(mapStateToProps, mergeProps)(MarketReportingPayouts)
