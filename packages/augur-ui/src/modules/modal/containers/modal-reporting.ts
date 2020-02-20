import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ModalReporting from 'modules/modal/reporting';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { REPORTING_STATE, MODAL_ADD_FUNDS, REP } from 'modules/common/constants';
import { formatRep } from 'utils/format-number';
import { AppState } from 'appStore';
import { updateModal } from '../actions/update-modal';

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
  getRepModal: () => dispatch(updateModal({ type: MODAL_ADD_FUNDS, fundType: REP })),
});

const mergeProps = (sP, dP, oP) => {
  const { migrateMarket, migrateRep, market } = sP;
  const isDisputing =
    !migrateRep &&
    !migrateMarket &&
    market.reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE;
  let title = 'Dispute or Support this market’s tenatative winning Outcome';
  if (migrateRep) {
    title = 'Augur is Forking';
  } else if (migrateMarket) {
    title = 'Report and Migrate market';
  } else if (!isDisputing) {
    title = 'Report on this market';
  }

  return {
    title,
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    getRepModal: dP.getRepModal,
    ...oP,
    ...sP,
    isDisputing,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ModalReporting)
);
