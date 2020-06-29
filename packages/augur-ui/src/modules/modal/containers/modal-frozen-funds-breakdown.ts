import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { ModalFrozenFunds } from 'modules/modal/components/modal-frozen-funds';
import { augurSdk } from 'services/augursdk';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  account: state.loginAccount.address,
  universe: state.universe.id,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeAction: () => dispatch(closeModal()),
  getUserFrozenFundsBreakdown: async (universe, account) => {
    const Augur = augurSdk.get();
    return await Augur.getUserFrozenFundsBreakdown({ universe, account });
  },
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...sP,
  ...dP,
  ...oP,
  getUserFrozenFundsBreakdown: () =>
    dP.getUserFrozenFundsBreakdown(sP.universe, sP.account),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(ModalFrozenFunds)
);
