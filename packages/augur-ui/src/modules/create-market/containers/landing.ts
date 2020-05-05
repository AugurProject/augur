import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  updateNewMarket,
  clearNewMarket,
} from 'modules/markets/actions/update-new-market';
import Landing from 'modules/create-market/landing';
import { marketCreationStarted } from 'services/analytics/helpers';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = state => {
  const {
    loginAccount: { address },
    blockchain: { currentAugurTimestamp: currentTimestamp },
  } = AppStatus.get();
  return {
    newMarket: state.newMarket,
    currentTimestamp,
    address,
  };
};

const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
  marketCreationStarted: (templateName, isTemplate) =>
    dispatch(marketCreationStarted(templateName, isTemplate)),
});

const LandingContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Landing)
);

export default LandingContainer;
