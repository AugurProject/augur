import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import FilterSortController from 'modules/filter-sort/components/filter-sort-controller/filter-sort-controller'

import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  currentReportingPeriod: getValue(state, 'universe.currentReportingWindowAddress'),
})

const FilterSort = withRouter(connect(mapStateToProps)(FilterSortController))

export default FilterSort
