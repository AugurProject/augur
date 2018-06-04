import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { selectCategories } from 'modules/categories/selectors/categories'
import { submitNewMarket } from 'modules/create-market/actions/submit-new-market'
import {
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket,
  clearNewMarket,
} from 'modules/create-market/actions/update-new-market'
import CreateMarketView from 'modules/create-market/components/create-market-view/create-market-view'
import { selectCurrentTimestamp } from 'src/select-state'
import { estimateSubmitNewMarket } from 'modules/create-market/actions/estimate-submit-new-market'

import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  universe: state.universe,
  availableEth: getValue(state, 'loginAccount.eth') || '0',
  availableRep: getValue(state, 'loginAccount.rep') || '0',
  meta: getValue(state, 'loginAccount.meta'),
  newMarket: state.newMarket,
  footerHeight: state.footerHeight,
  categories: selectCategories(state),
  isMobileSmall: state.isMobileSmall,
  isBugBounty: state.env['bug-bounty'],
  currentTimestamp: selectCurrentTimestamp(state),
})

const mapDispatchToProps = dispatch => ({
  addOrderToNewMarket: data => dispatch(addOrderToNewMarket(data)),
  removeOrderFromNewMarket: data => dispatch(removeOrderFromNewMarket(data)),
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
  submitNewMarket: (data, history) => dispatch(submitNewMarket(data, history)),
  estimateSubmitNewMarket: (data, callback) => dispatch(estimateSubmitNewMarket(data, callback)),
})

const CreateMarket = withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateMarketView))

export default CreateMarket
