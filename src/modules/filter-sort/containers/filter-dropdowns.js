import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import FilterDropDowns from 'modules/filter-sort/components/filter-dropdowns/filter-dropdowns'
import { getSelectedTagsAndCategoriesFromLocation } from 'src/modules/markets/helpers/get-selected-tags-and-categories-from-location'

const mapStateToProps = (state, { location }) => {
  const {
    category,
    tags,
    keywords,
  } = getSelectedTagsAndCategoriesFromLocation(location)

  return {
    category,
    tags,
    keywords,
  }
}

const mapDispatchToProps = dispatch => ({})

const FilterSearchContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterDropDowns))

export default FilterSearchContainer
