import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import FilterSortView from 'modules/filter-sort/components/filter-sort-view'

import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  currentReportingPeriod: getValue(state, 'branch.currentReportingWindowAddress')
})

const FilterSort = withRouter(connect(mapStateToProps)(FilterSortView))

export default FilterSort
