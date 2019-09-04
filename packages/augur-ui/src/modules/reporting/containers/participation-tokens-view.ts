import { connect } from 'react-redux';
import { ParticipationTokensView } from 'modules/reporting/common';

const mapStateToProps = state => {
  const isLogged = state.authStatus.isLogged;
  const repBalances = isLogged
    ? selectReportingBalances(state)
    : selectDefaultReportingBalances();
  return {
    ...repBalances,
  };
};

const mapDispatchToProps = dispatch => ({
  openGetRepModal: () => {},
});

const ParticipationTokensViewContaineer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipationTokensView);

export default ParticipationTokensViewContaineer;
