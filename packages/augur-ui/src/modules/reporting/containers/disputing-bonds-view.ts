import { connect } from 'react-redux';
import { DisputingBondsView } from 'modules/reporting/common';
import getValue from 'utils/get-value';

const mapStateToProps = state => {
  return {
    userAvailableRep: state.loginAccount.balances && state.loginAccount.balances.rep,
    Gnosis_ENABLED: getValue(state, 'appStatus.gnosisEnabled'),
  };
};

const mapDispatchToProps = dispatch => ({
});

const DisputingBondsViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DisputingBondsView);

export default DisputingBondsViewContainer;
