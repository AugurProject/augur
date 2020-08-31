import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import ModalSignTransaction from 'modules/modal/containers/modal-sign-transaction';
import ModalReporting from 'modules/modal/containers/modal-reporting';
import ModalConfirm from 'modules/modal/components/modal-confirm';
import ModalReview from 'modules/modal/components/modal-review';
import ModalRepFaucet from 'modules/modal/containers/modal-rep-faucet';
import ModalCreateMarket from 'modules/modal/containers/modal-create-market';
import ModalDaiFaucet from 'modules/modal/containers/modal-dai-faucet';
import ModalWithdraw from 'modules/modal/containers/modal-transfer';
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
import ModalOpenOrders from 'modules/modal/containers/modal-open-orders';
import ModalMarketLoading from 'modules/modal/containers/modal-market-loading';
import ModalContent from 'modules/modal/containers/modal-content';
import ModalCategories from 'modules/modal/containers/modal-categories';
import ModalMarketType from 'modules/modal/containers/modal-market-type';
import ModalDrQuickGuide from 'modules/modal/containers/modal-dr-quick-guide';
import ModalMigrateMarket from 'modules/modal/containers/modal-migrate-market';
import ModalAddFunds from 'modules/modal/containers/modal-add-funds';
import ModalSignin from 'modules/modal/containers/modal-signin';
import ModalHardwareWallet from 'modules/modal/containers/modal-hardware-wallet';
import ModalLoading from 'modules/modal/containers/modal-loading';
import ModalUniverseSelector from 'modules/modal/containers/modal-universe-selector';
import ModalTestBet from 'modules/modal/containers/modal-test-bet';
import ModalAugurP2P from 'modules/modal/containers/modal-p2p-trading';
import ModalApprovals from 'modules/modal/containers/modal-approvals';
import ModalEthDeposit from 'modules/modal/containers/modal-eth-deposit';
import ModalGlobalChat from 'modules/modal/containers/modal-global-chat';
import ModalWalletError from 'modules/modal/containers/modal-wallet-error';
import ModalAugurUsesDai from 'modules/modal/containers/modal-augur-uses-dai';
import ModalSwap from 'modules/modal/containers/modal-swap';
import ModalBankroll from 'modules/modal/containers/modal-bankroll';
import ModalTokenSelect from 'modules/modal/containers/modal-token-select';
import ModalTutorialOutro from 'modules/modal/containers/modal-tutorial-outro';
import ModalTutorialIntro from 'modules/modal/containers/modal-tutorial-intro';
import ModalScalar from 'modules/modal/containers/modal-scalar';
import ModalInvalidMarketRules from 'modules/modal/containers/modal-invalid-market-rules';
import ModalInitializeAccounts from 'modules/modal/containers/modal-initialize-account';
import ModalHelp from 'modules/modal/containers/modal-help';
import ModalMarketNotFound from 'modules/modal/containers/modal-market-not-found';
import FrozenFundsBreakdown from 'modules/modal/containers/modal-frozen-funds-breakdown';
import ModalTutorialVideo from 'modules/modal/containers/modal-tutoria-video';
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
    case TYPES.MODAL_TRANSFER:
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
    case TYPES.MODAL_MARKET_LOADING:
      return <ModalMarketLoading />;
    case TYPES.MODAL_MARKET_NOT_FOUND:
      return <ModalMarketNotFound />;
    case TYPES.MODAL_DR_QUICK_GUIDE:
      return <ModalDrQuickGuide />;
    case TYPES.MODAL_MIGRATE_MARKET:
      return <ModalMigrateMarket {...modal} />;
    case TYPES.MODAL_LOGIN:
      return <ModalSignin {...props} isLogin />;
    case TYPES.MODAL_HELP:
      return <ModalHelp {...props} />;
    case TYPES.MODAL_SIGNUP:
      return <ModalSignin {...props} isLogin={false} />;
    case TYPES.MODAL_HARDWARE_WALLET:
      return <ModalHardwareWallet {...props} />;
    case TYPES.MODAL_LOADING:
      return <ModalLoading />;
    case TYPES.MODAL_UNIVERSE_SELECTOR:
      return <ModalUniverseSelector />;
    case TYPES.MODAL_TEST_BET:
      return <ModalTestBet />;
    case TYPES.MODAL_AUGUR_P2P:
      return <ModalAugurP2P />;
    case TYPES.MODAL_APPROVALS:
      return <ModalApprovals />;
    case TYPES.MODAL_ETH_DEPOSIT:
      return <ModalEthDeposit />;
    case TYPES.MODAL_TUTORIAL_OUTRO:
      return <ModalTutorialOutro {...modal} />;
    case TYPES.MODAL_TUTORIAL_INTRO:
      return <ModalTutorialIntro {...modal} />;
    case TYPES.MODAL_GLOBAL_CHAT:
      return <ModalGlobalChat />;
    case TYPES.MODAL_AUGUR_USES_DAI:
      return <ModalAugurUsesDai />
    case TYPES.MODAL_BANKROLL:
      return <ModalBankroll />;
    case TYPES.MODAL_TOKEN_SELECT:
      return <ModalTokenSelect />;
    case TYPES.MODAL_SWAP:
      return <ModalSwap />;
    case TYPES.MODAL_ERROR:
      return <ModalWalletError />
    case TYPES.MODAL_SCALAR_MARKET:
      return <ModalScalar {...modal} />
    case TYPES.MODAL_INVALID_MARKET_RULES:
      return <ModalInvalidMarketRules />;
    case TYPES.MODAL_INITIALIZE_ACCOUNT:
      return <ModalInitializeAccounts />;
    case TYPES.MODAL_FROZEN_FUNDS:
      return <FrozenFundsBreakdown />;
    case TYPES.MODAL_REPORTING_ONLY:
      return <ModalDisclaimer {...modal} isReportingOnly={true} />;
    case TYPES.MODAL_TUTORIA_VIDEO:
      return <ModalTutorialVideo />
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
  history: History;
}

const ModalView = ({
  modal,
  closeModal,
  trackModalViewed,
  history,
}: ModalViewProps) => {
  const [locationKeys, setLocationKeys] = useState([]);
  const handleKeyDown = e => {
    if (e.keyCode === ESCAPE_KEYCODE) {
      if (modal && modal.cb) {
        modal.cb();
      }
      closeModal();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    trackModalViewed(modal.type, {
      modal: modal.type,
      from: window.location.href,
    });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  useEffect(() => {
    return history.listen(location => {
      if (history.action === 'PUSH') {
        setLocationKeys([location.key]);
      }

      if (history.action === 'POP') {
        if (locationKeys[1] === location.key) {
          setLocationKeys(([_, ...keys]) => keys);

          closeModal();
        } else {
          setLocationKeys(keys => [location.key, ...keys]);

          closeModal();
        }
      }
    });
  }, [locationKeys]);

  const Modal = selectModal(
    modal.type,
    { modal, closeModal, trackModalViewed },
    closeModal,
    modal
  );

  return (
    <section className={Styles.ModalView}>
      <div
        className={classNames({
          [`${Styles['ModalView__content--taller']}`]:
            modal.type === TYPES.MODAL_DISCLAIMER,
        })}
      >
        {Modal}
      </div>
    </section>
  );
};

export default ModalView;
