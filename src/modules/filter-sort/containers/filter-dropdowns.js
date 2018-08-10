import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import FilterDropdown from 'modules/filter-sort/components/filter-dropdowns/filter-dropdowns'
import { updateFilterOption } from 'modules/filter-sort/actions/update-filter-option'
import { updateSortOption } from 'modules/filter-sort/actions/update-sort-option'


const mapStateToProps = state => ({
  defaultFilter: state.filterOption,
  defaultSort: state.sortOption,
})

const mapDispatchToProps = dispatch => ({
  updateFilterOption: filterOption => dispatch(updateFilterOption(filterOption)),
  updateSortOption: sortOption => dispatch(updateSortOption(sortOption)),
})

const FilterDropdownsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterDropdown))

export default FilterDropdownsContainer
