import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  updateNewMarket,
  clearNewMarket
} from 'modules/markets/actions/update-new-market';
import Landing from 'modules/create-market/landing';
import getValue from 'utils/get-value';

const mapStateToProps = state => ({
  universeId: state.universe.id,
  newMarket: state.newMarket,
  currentTimestamp: getValue(state, 'blockchain.currentAugurTimestamp'),
  address: getValue(state, 'loginAccount.address'),
});

const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
});

const LandingContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Landing)
);

export default LandingContainer;
