import { connect } from 'react-redux';
import { DisputingBondsView } from 'modules/reporting/common';

const mapStateToProps = state => {
  return {
    userAvailableRep: state.loginAccount.balances && state.loginAccount.balances.rep,
  };
};

const mapDispatchToProps = dispatch => ({
});

const DisputingBondsViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DisputingBondsView);

export default DisputingBondsViewContainer;
