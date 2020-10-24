import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Message } from 'modules/modal/message';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';

const mapStateToProps = (state: AppState) => {
  const { appStatus, modal, env } = state;

  return {
    modal,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  closeModal: () => {
    dispatch(closeModal());
  },
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: 'Activate Account',
  description: [
    `Augur is a peer-to-peer system, and certain actions require paying a small fee to other users of the system. The cost of these fees will be included in the total fees displayed when taking that action. Trades, Creating Markets, and Reporting on the market outcome are examples of such actions.\n Augur will reserve $${sP.reserveAmount.formattedValue} of your funds in order to pay these fees, but your total balance can be cashed out at any time. To see the total amount reserved for fees, click on the Account menu.\n Until the account is activated you will be unable to place an order.`,
  ],
  buttons: sP.modal.customAction
    ? [
        {
          text: 'OK',
          action: () => {
            if (sP.modal.customAction) {
              sP.modal.customAction();
            }
            dP.closeModal();
          },
        },
      ]
    : [
        {
          text: 'Activate Account',
          action: () => {
            dP.closeModal();
          },
        },
        {
          text: 'Continue',
          action: () => {
            dP.closeModal();
          },
        },
      ],
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Message)
);
