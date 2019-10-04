import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ModalReporting from 'modules/modal/reporting';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { REPORTING_STATE } from 'modules/common/constants';
import { formatRep } from 'utils/format-number';
import { AppState } from 'store';

const mapStateToProps = (state: AppState, ownProps) => {
  const { universe, modal, loginAccount } = state;
  const { market } = ownProps;
  const hasForked = !!state.universe.forkingInfo;
  const migrateRep =
    hasForked && universe.forkingInfo.forkingMarket === market.id;
  const migrateMarket =
    hasForked && !!universe.forkingInfo.winningChildUniverseId;

  return {
    modal: modal,
    market,
    rep: formatRep(loginAccount.balances.rep).formatted,
    userAccount: loginAccount.address,
    migrateRep,
    migrateMarket,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP, dP, oP) => {
  const migrateRep = sP.market.id === sP.forkingMarket;
  const isReporting =
    sP.market.reportingState === REPORTING_STATE.OPEN_REPORTING ||
    sP.market.reportingState === REPORTING_STATE.DESIGNATED_REPORTING;
  let title = 'Dispute or Support this market’s tenatative winning Outcome';
  if (isReporting) {
    title = 'Report on this market';
  } else if (migrateRep) {
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
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ModalReporting)
);
