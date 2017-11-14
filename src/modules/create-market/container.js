import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { selectTopics } from 'modules/topics/selectors/topics'
import { submitNewMarket } from 'modules/create-market/actions/submit-new-market'
import {
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket,
  clearNewMarket
} from 'modules/create-market/actions/update-new-market'
import CreateMarketView from 'modules/create-market/components/create-market-view/create-market-view'

import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  universe: state.universe,
  availableEth: getValue(state, 'loginAccount.eth'),
  newMarket: state.newMarket,
  footerHeight: state.footerHeight,
  categories: selectTopics(state),
  isMobileSmall: state.isMobileSmall,
})

const mapDispatchToProps = dispatch => ({
  addOrderToNewMarket: data => dispatch(addOrderToNewMarket(data)),
  removeOrderFromNewMarket: data => dispatch(removeOrderFromNewMarket(data)),
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
  submitNewMarket: (data, history) => dispatch(submitNewMarket(data, history))
})

const CreateMarket = withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateMarketView))

export default CreateMarket
