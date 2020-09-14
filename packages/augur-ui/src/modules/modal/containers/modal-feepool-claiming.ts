import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Message } from 'modules/modal/message';
import { exitFeePool, redeemFeePool } from 'modules/contracts/actions/contractCalls';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { formatAttoEth, formatAttoRep } from 'utils/format-number';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal.modal,
  address: state.loginAccount.mixedCaseAddress,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  claimOnly: async () => redeemFeePool(),
  exitAll: async (amount) => exitFeePool(amount),
});


const mergeProps = (sP: any, dP: any, oP: any) => {
  const totalRep = sP.modal?.totalRep || "0";
  const totalFees = sP.modal?.totalFees || "0";
  const fullExit = sP.modal.isFullExit;

  const description = [`You have earned ${formatAttoEth(totalFees).formatted} wETH in fees.`];

  let title = "Claim Fee Pool Fees"
  let actionButtonName = "Claim Fees";
  let action = dP.claimOnly;
  if (fullExit) {
    actionButtonName = "Claim and Unstake";
    action = dP.exitAll;
    title = "Claim Fees and Unstake"
    description.push(`You are unstaking ${formatAttoRep(totalRep).formatted} REPv2.`)
  }
  return {
    title,
    description,
    closeAction: () => dP.closeModal(),
    buttons: [
      {
        text: actionButtonName,
        action: () => {
          dP.closeModal();
          fullExit ? action(totalRep) : action();
          if (sP.modal.cb) {
            sP.modal.cb(true);
          }
        },
      },
      {
        text: "Cancel",
        type: "gray",
        action: () => {
          dP.closeModal();
          if (sP.modal.cb) {
            sP.modal.cb(false);
          }
        },
      }
    ],
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Message)
);
