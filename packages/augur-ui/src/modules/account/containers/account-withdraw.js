import { connect } from "react-redux";

import AccountWithdraw from "modules/account/components/account-withdraw/account-withdraw";
import { updateModal } from "modules/modal/actions/update-modal";
import { closeModal } from "modules/modal/actions/close-modal";
import { MODAL_REVIEW } from "modules/modal/constants/modal-types";
import { transferFunds } from "modules/auth/actions/transfer-funds";
import { selectLoginAccount } from "modules/auth/selectors/login-account";

const mapStateToProps = state => {
  const loginAccount = selectLoginAccount(state);
  return {
    eth: loginAccount.eth,
    rep: loginAccount.rep,
    isMobileSmall: state.appStatus.isMobileSmall
  };
};

const mapDispatchToProps = dispatch => ({
  transferFunds: (amount, asset, to) =>
    dispatch(transferFunds(amount, asset, to)),
  withdrawReviewModal: modal =>
    dispatch(
      updateModal({
        type: MODAL_REVIEW,
        ...modal
      })
    ),
  closeModal: () => dispatch(closeModal())
});

const AccountWithdrawContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountWithdraw);

export default AccountWithdrawContainer;
