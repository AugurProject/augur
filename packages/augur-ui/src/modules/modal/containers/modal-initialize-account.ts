import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Message } from 'modules/modal/message';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { createFundedGsnWallet } from 'modules/auth/actions/update-sdk';
import { GSN_WALLET_SEEN } from 'modules/common/constants';
import { formatAttoEth, formatDaiPrice, formatDai } from 'utils/format-number';
import { FormattedNumber } from 'modules/types';

const mapStateToProps = (state: AppState) => {
  const { appStatus, modal, env } = state;
  const ethToDaiRate = appStatus.ethToDaiRate.roundedValue;
  const desiredSignerEthBalance = formatAttoEth(
    env.gsn.desiredSignerBalanceInETH * 10**18
  ).value;
  const reserveAmount: FormattedNumber = formatDai(
    ethToDaiRate.multipliedBy(desiredSignerEthBalance)
  );

  return {
    modal,
    reserveAmount,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  closeModal: () => {
    dispatch(closeModal());

    const localStorageRef =
      typeof window !== 'undefined' && window.localStorage;
    if (localStorageRef && localStorageRef.setItem) {
      localStorageRef.setItem(GSN_WALLET_SEEN, 'true');
    }
  },
  createFundedGsnWallet: () => dispatch(createFundedGsnWallet()),
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
            dP.createFundedGsnWallet();
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
