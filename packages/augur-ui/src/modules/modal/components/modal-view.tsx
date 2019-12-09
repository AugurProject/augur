import React, { Component, useEffect } from 'react';
import classNames from 'classnames';

import ModalSignTransaction from 'modules/modal/containers/modal-sign-transaction';
import ModalReporting from 'modules/modal/containers/modal-reporting';
import ModalConfirm from 'modules/modal/components/modal-confirm';
import ModalReview from 'modules/modal/components/modal-review';
import ModalRepFaucet from 'modules/modal/containers/modal-rep-faucet';
import ModalCreateMarket from 'modules/modal/containers/modal-create-market';
import ModalDaiFaucet from 'modules/modal/containers/modal-dai-faucet';
import ModalCreationHelp from 'modules/modal/containers/modal-creation-help';
import ModalDeposit from 'modules/modal/containers/modal-deposit';
import ModalWithdraw from 'modules/modal/containers/modal-withdraw';
import ModalMigrateRep from 'modules/modal/containers/modal-migrate-rep';
import ModalNetworkDisabled from 'modules/modal/containers/modal-network-disabled';
import ModalTransactions from 'modules/modal/containers/modal-transactions';
import ModalUnsignedOrders from 'modules/modal/containers/modal-unsigned-orders';
import ModalNetworkMismatch from 'modules/modal/containers/modal-mismatch';
import ModalNetworkDisconnected from 'modules/modal/containers/modal-network-disconnected';
import ModalApproval from 'modules/modal/containers/modal-approval';
import ModalFinalize from 'modules/modal/containers/modal-finalize';
import ModalBuyDai from 'modules/modal/containers/modal-buy-dai';
import ModalDiscard from 'modules/modal/containers/modal-discard';
import ModalMarketReview from 'modules/modal/containers/modal-market-review';
import ModalClaimFees from 'modules/modal/containers/modal-claim-fees';
import ModalParticipate from 'modules/modal/containers/modal-participate';
import ModalNetworkConnect from 'modules/modal/containers/modal-network-connect';
import ModalDisclaimer from 'modules/modal/containers/modal-disclaimer';
import ModalGasPrice from 'modules/modal/containers/modal-gas-price';
import ModalClaimMarketsProceeds from 'modules/modal/containers/modal-claim-markets-proceeds';
import ModalTradingOverlay from 'modules/modal/components/modal-trading-overlay';
import ModalOpenOrders from 'modules/modal/containers/modal-open-orders';
import ModalMarketLoading from 'modules/modal/containers/modal-market-loading';
import ModalContent from 'modules/modal/containers/modal-content';
import ModalCategories from 'modules/modal/containers/modal-categories';
import ModalMarketType from 'modules/modal/containers/modal-market-type';
import ModalDrQuickGuide from 'modules/modal/containers/modal-dr-quick-guide';
import ModalMigrateMarket from 'modules/modal/containers/modal-migrate-market';
import ModalAddFunds from 'modules/modal/containers/modal-add-funds';
import ModalSignin from 'modules/modal/containers/modal-signin';
import ModalConnect from 'modules/modal/containers/modal-connect';
import ModalLoading from 'modules/modal/containers/modal-loading';
import ModalUniverseSelector from 'modules/modal/containers/modal-universe-selector';
import ModalTestBet from 'modules/modal/containers/modal-test-bet';
import ModalGlobalChat from 'modules/modal/containers/modal-global-chat';
import ModalAccountCreated from 'modules/modal/containers/modal-account-created';
import ModalWalletError from 'modules/modal/containers/modal-wallet-error';
import ModalAugurUsesDai from 'modules/modal/containers/modal-augur-uses-dai';
import ModalTutorialOutro from 'modules/modal/containers/modal-tutorial-outro';
import ModalTutorialIntro from 'modules/modal/containers/modal-tutorial-intro';

import * as TYPES from 'modules/common/constants';

import Styles from 'modules/modal/components/common/common.styles.less';

const ESCAPE_KEYCODE = 27;

function selectModal(type, props, closeModal, modal) {
  switch (type) {
    case TYPES.MODAL_MARKET_TYPE:
      return <ModalMarketType {...props} />;
    case TYPES.MODAL_CATEGORIES:
      return <ModalCategories {...props} />;
    case TYPES.MODAL_CONTENT:
      return <ModalContent {...props} />;
    case TYPES.MODAL_CLAIM_MARKETS_PROCEEDS:
      return <ModalClaimMarketsProceeds {...props} />;
    case TYPES.MODAL_GAS_PRICE:
      return <ModalGasPrice {...props} />;
    case TYPES.MODAL_UNSIGNED_ORDERS:
      return <ModalUnsignedOrders />;
    case TYPES.MODAL_OPEN_ORDERS:
      return <ModalOpenOrders />;
    case TYPES.MODAL_TRANSACTIONS:
      return <ModalTransactions />;
    case TYPES.MODAL_REP_FAUCET:
      return <ModalRepFaucet />;
    case TYPES.MODAL_CREATE_MARKET:
      return <ModalCreateMarket />;
    case TYPES.MODAL_ADD_FUNDS:
      return (
        <>
          {/* MOBILE */}
          <ModalAddFunds />

          {/* DESKTOP */}
          <ModalAddFunds {...props} autoSelect />
        </>
      );
    case TYPES.MODAL_DAI_FAUCET:
      return <ModalDaiFaucet />;
    case TYPES.MODAL_CREATION_HELP:
      return <ModalCreationHelp {...modal} />;
    case TYPES.MODAL_DEPOSIT:
      return <ModalDeposit />;
    case TYPES.MODAL_WITHDRAW:
      return <ModalWithdraw />;
    case TYPES.MODAL_MIGRATE_REP:
      return <ModalMigrateRep />;
    case TYPES.MODAL_CONFIRM:
      return <ModalConfirm {...modal} closeModal={closeModal} />;
    case TYPES.MODAL_REVIEW:
      return <ModalReview {...modal} />;
    case TYPES.MODAL_LEDGER:
    case TYPES.MODAL_TREZOR:
      return <ModalSignTransaction {...modal} />;
    case TYPES.MODAL_REPORTING:
      return <ModalReporting {...modal} />;
    case TYPES.MODAL_PARTICIPATE:
      return <ModalParticipate />;
    case TYPES.MODAL_NETWORK_MISMATCH:
      return <ModalNetworkMismatch {...modal} />;
    case TYPES.MODAL_NETWORK_DISABLED:
      return <ModalNetworkDisabled {...modal} />;
    case TYPES.MODAL_NETWORK_CONNECT:
      return <ModalNetworkConnect />;
    case TYPES.MODAL_NETWORK_DISCONNECTED:
      return <ModalNetworkDisconnected {...props} />;
    case TYPES.MODAL_FINALIZE_MARKET:
      return <ModalFinalize />;
    case TYPES.MODAL_BUY_DAI:
      return <ModalBuyDai />;
    case TYPES.MODAL_DISCARD:
      return <ModalDiscard />;
    case TYPES.MODAL_MARKET_REVIEW:
      return <ModalMarketReview {...modal} />;
    case TYPES.MODAL_ACCOUNT_APPROVAL:
      return <ModalApproval />;
    case TYPES.MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET:
      return <ModalClaimReportingFeesForkedMarket {...modal} />;
    case TYPES.MODAL_CLAIM_FEES:
      return <ModalClaimFees {...modal} />;
    case TYPES.MODAL_DISCLAIMER:
      return <ModalDisclaimer {...modal} />;
    case TYPES.MODAL_TRADING_OVERLAY:
      return <ModalTradingOverlay {...modal} closeModal={closeModal} />;
    case TYPES.MODAL_MARKET_LOADING:
      return <ModalMarketLoading />;
    case TYPES.MODAL_DR_QUICK_GUIDE:
      return <ModalDrQuickGuide />;
    case TYPES.MODAL_MIGRATE_MARKET:
      return <ModalMigrateMarket {...modal} />;
    case TYPES.MODAL_LOGIN:
      return <ModalSignin {...props} isLogin />;
    case TYPES.MODAL_SIGNUP:
      return <ModalSignin {...props} isLogin={false} />;
    case TYPES.MODAL_CONNECT:
      return <ModalConnect />;
    case TYPES.MODAL_LOADING:
      return <ModalLoading />;
    case TYPES.MODAL_UNIVERSE_SELECTOR:
      return <ModalUniverseSelector />;
    case TYPES.MODAL_TEST_BET:
      return <ModalTestBet />;
    case TYPES.MODAL_TUTORIAL_OUTRO:
      return <ModalTutorialOutro {...modal} />;
    case TYPES.MODAL_TUTORIAL_INTRO:
      return <ModalTutorialIntro {...modal} />;
    case TYPES.MODAL_GLOBAL_CHAT:
      return <ModalGlobalChat />;
    case TYPES.MODAL_ACCOUNT_CREATED:
      return <ModalAccountCreated />
    case TYPES.MODAL_AUGUR_USES_DAI:
      return <ModalAugurUsesDai />
    case TYPES.MODA_WALLET_ERROR:
      return <ModalWalletError />
    default:
      return <div />;
  }
}

interface ModalViewProps {
  modal: {
    cb: Function;
    type: string;
  };
  closeModal: Function;
  trackModalViewed: Function;
}

export default class ModalView extends Component<ModalViewProps> {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const { closeModal, modal, trackModalViewed } = this.props;
    window.onpopstate = () => {
      closeModal();
    };

    window.addEventListener('keydown', this.handleKeyDown);

    trackModalViewed(modal.type, {
      modal: modal.type, 
      from: window.location.href
    })
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    const { modal, closeModal } = this.props;

    if (e.keyCode === ESCAPE_KEYCODE) {
      if (modal && modal.cb) {
        modal.cb();
      }
      closeModal();
    }
  }

  render() {
    const { closeModal, modal } = this.props;

    const Modal = selectModal(modal.type, this.props, closeModal, modal);

    return (
      <section className={Styles.ModalView}>
        <div
          className={classNames({
            [`${Styles['ModalView__content--taller']}`]:
              modal.type === TYPES.MODAL_DISCLAIMER,
            [`${Styles['ModalView__content--full']}`]:
              modal.type === TYPES.MODAL_TRADING_OVERLAY,
          })}
        >
          {Modal}
        </div>
      </section>
    );
  }
}
