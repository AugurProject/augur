import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import getAllMarkets from 'modules/markets/selectors/markets-all'

import FilterSearch from 'modules/filter-sort/components/filter-search/filter-search'
import { updateMarketsFilteredSorted, clearMarketsFilteredSorted } from 'modules/markets/actions/update-markets-filtered-sorted'

const mapStateToProps = state => ({
  items: getAllMarkets(),
})

const mapDispatchToProps = dispatch => ({
  updateIndices: (p) => {
    if (p.indices) {
      dispatch(clearMarketsFilteredSorted())
      dispatch(updateMarketsFilteredSorted(p.indices))
    }
  },
})

const FilterSearchContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterSearch))

export default FilterSearchContainer
