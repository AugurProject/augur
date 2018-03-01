import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import FilterMarketState from 'modules/filter-sort/components/filter-market-state/filter-market-state'

import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  currentReportingPeriod: getValue(state, 'universe.reportPeriod'),
})

export default withRouter(connect(mapStateToProps)(FilterMarketState))
