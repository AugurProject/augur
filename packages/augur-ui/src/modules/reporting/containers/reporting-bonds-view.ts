import { connect } from 'react-redux';
import { ReportingBondsView } from 'modules/reporting/common';

const mapStateToProps = state => {
  return {
    userAvailableRep: state.loginAccount.balances && state.loginAccount.balances.rep,
  };
};

const mapDispatchToProps = dispatch => ({
});

const ReportingBondsViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportingBondsView);

export default ReportingBondsViewContainer;
