import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ModalReporting from 'modules/modal/reporting';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { REPORTING_STATE } from 'modules/common/constants';
import { formatRep } from 'utils/format-number';

const mapStateToProps = (state, ownProps) => ({
  modal: state.modal,
  market: ownProps.market,
  rep: formatRep(state.loginAccount.balances.rep).formatted,
  userAccount: state.loginAccount.address,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP, dP, oP) => {
  const isReporting =
    sP.market.reportingState === REPORTING_STATE.OPEN_REPORTING ||
    sP.market.reportingState === REPORTING_STATE.DESIGNATED_REPORTING;
  return {
    isReporting,
    title: isReporting
      ? 'Report on this market'
      : 'Dispute or Support this market’s tenatative winning Outcome',
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    ...oP,
    ...sP,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ModalReporting)
);
