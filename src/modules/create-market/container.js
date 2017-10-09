import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { selectTopics } from 'modules/topics/selectors/topics'
import { submitNewMarket } from 'modules/create-market/actions/submit-new-market'
import {
  addValidationToNewMarket,
  removeValidationFromNewMarket,
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket,
  clearNewMarket
} from 'modules/create-market/actions/update-new-market'
import CreateMarketView from 'modules/create-market/components/create-market-view/create-market-view'

import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  branch: state.branch,
  availableEth: getValue(state, 'loginAccount.ethTokens'),
  newMarket: state.newMarket,
  footerHeight: state.footerHeight,
  categories: selectTopics(state),
  isMobileSmall: state.isMobileSmall,
})

const mapDispatchToProps = dispatch => ({
  addValidationToNewMarket: data => dispatch(addValidationToNewMarket(data)),
  removeValidationFromNewMarket: data => dispatch(removeValidationFromNewMarket(data)),
  addOrderToNewMarket: data => dispatch(addOrderToNewMarket(data)),
  removeOrderFromNewMarket: data => dispatch(removeOrderFromNewMarket(data)),
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
  submitNewMarket: (data, history) => dispatch(submitNewMarket(data, history))
})

const CreateMarket = withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateMarketView))

export default CreateMarket
