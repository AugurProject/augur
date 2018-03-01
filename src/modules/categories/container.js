import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CategoriesView from 'modules/categories/components/categories-view/categories-view'

import { selectLoginAccount } from 'modules/auth/selectors/login-account'
import { selectCategories } from 'modules/categories/selectors/categories'

const mapStateToProps = state => ({
  universe: state.universe,
  isMobile: state.isMobile,
  categories: selectCategories(state),
  loginAccount: selectLoginAccount(state),
  isLogged: state.isLogged,
})

const Categories = withRouter(connect(mapStateToProps)(CategoriesView))

export default Categories
