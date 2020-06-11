import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ModalReporting from 'modules/modal/reporting';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  REPORTING_STATE,
  MODAL_ADD_FUNDS,
  REP,
} from 'modules/common/constants';
import { formatRep } from 'utils/format-number';
import { AppState } from 'appStore';
import { AppStatus } from 'modules/app/store/app-status';
import { addPendingReport, addPendingData, removePendingData, addPendingDispute } from 'modules/pending-queue/actions/pending-queue-management';
import { selectMarket } from 'modules/markets/selectors/market';

const mapStateToProps = (state: AppState, ownProps) => {
  const {
    loginAccount: {
      balances: { rep },
      address: userAccount,
    },
    universe: { forkingInfo, warpSyncHash },
    modal,
  } = AppStatus.get();
  let { market, marketId } = ownProps;
  if (marketId && !market) {
    market = selectMarket(marketId);
  }
  market.isForking = forkingInfo && forkingInfo.forkingMarket === market.id;
  const hasForked = !!forkingInfo;
  const migrateRep = hasForked && forkingInfo.forkingMarket === market.id;
  const migrateMarket = hasForked && !!forkingInfo.winningChildUniverseId;

  return {
    warpSyncHash,
    modal,
    market,
    rep: formatRep(rep).formatted,
    userAccount,
    migrateRep,
    migrateMarket,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => AppStatus.actions.closeModal(),
  getRepModal: () => AppStatus.actions.setModal({ type: MODAL_ADD_FUNDS, fundType: REP }),
  addPendingData: (pendingId, queueName, status,hash, info) => addPendingData(pendingId, queueName, status,hash, info),
  removePendingData: (pendingId, queueName) => removePendingData(pendingId, queueName),
  addPendingReport: (report) => addPendingReport(report),
  addPendingDispute: (dispute, payload) => addPendingDispute(dispute, payload)
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
    ...dP,
    ...sP,
    isDisputing,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(ModalReporting)
);
