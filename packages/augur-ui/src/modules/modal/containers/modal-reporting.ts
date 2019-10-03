import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ModalReporting from 'modules/modal/reporting';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { REPORTING_STATE } from 'modules/common/constants';
import { formatRep } from 'utils/format-number';
import { AppState } from 'store';

const mapStateToProps = (state: AppState, ownProps) => ({
  modal: state.modal,
  market: ownProps.market,
  rep: formatRep(state.loginAccount.balances.rep).formatted,
  userAccount: state.loginAccount.address,
  forkingMarket:
    state.universe.forkingInfo && state.universe.forkingInfo.forkingMarket,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP, dP, oP) => {
  const isForkingMarket = sP.market.id === sP.forkingMarket;
  const isReporting =
    sP.market.reportingState === REPORTING_STATE.OPEN_REPORTING ||
    sP.market.reportingState === REPORTING_STATE.DESIGNATED_REPORTING;
  let title = 'Dispute or Support this market’s tenatative winning Outcome';
  if (isReporting) {
    title = 'Report on this market';
  } else if (isForkingMarket) {
    title = 'Augur is Forking';
  }

  return {
    title,
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    ...oP,
    ...sP,
    isForkingMarket,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ModalReporting)
);
