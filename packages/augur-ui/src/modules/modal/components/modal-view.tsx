import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import ModalSignTransaction from 'modules/modal/containers/modal-sign-transaction';
import ModalReporting from 'modules/modal/containers/modal-reporting';
import ModalRepFaucet from 'modules/modal/containers/modal-rep-faucet';
import ModalCreateMarket from 'modules/modal/containers/modal-create-market';
import ModalDaiFaucet from 'modules/modal/containers/modal-dai-faucet';
import ModalCreationHelp from 'modules/modal/containers/modal-creation-help';
import ModalWithdraw from 'modules/modal/containers/modal-transfer';
import { ModalCashOut } from 'modules/modal/cash-out-form';
import { MigrateRep as ModalMigrateRep } from 'modules/modal/migrate-rep';
import ModalNetworkDisabled from 'modules/modal/containers/modal-network-disabled';
import ModalTransactions from 'modules/modal/containers/modal-transactions';
import ModalUnsignedOrders from 'modules/modal/containers/modal-unsigned-orders';
import ModalNetworkMismatch from 'modules/modal/containers/modal-mismatch';
import ModalNetworkDisconnected from "modules/modal/components/modal-network-disconnected";
import ModalFinalize from 'modules/modal/containers/modal-finalize';
import ModalBuyDai from 'modules/modal/containers/modal-buy-dai';
import ModalDiscard from 'modules/modal/containers/modal-discard';
import ModalClaimFees from 'modules/modal/containers/modal-claim-fees';
import ModalParticipate from 'modules/modal/containers/modal-participate';
import ModalNetworkConnect from 'modules/modal/components/modal-network-connect';
import ModalDisclaimer from 'modules/modal/components/modal-disclaimer';
import { Gas as ModalGasPrice } from 'modules/modal/gas';
import ModalClaimMarketsProceeds from 'modules/modal/containers/modal-claim-markets-proceeds';
import ModalOpenOrders from 'modules/modal/containers/modal-open-orders';
import ModalMarketLoading from 'modules/modal/containers/modal-market-loading';
import ModalDrQuickGuide from 'modules/modal/containers/modal-dr-quick-guide';
import ModalMigrateMarket from 'modules/modal/containers/modal-migrate-market';
import { AddFunds as ModalAddFunds } from 'modules/modal/add-funds';
import ModalSignin from 'modules/modal/containers/modal-signin';
import { Loading as ModalLoading } from 'modules/modal/loading';
import ModalUniverseSelector from 'modules/modal/containers/modal-universe-selector';
import ModalTestBet from 'modules/modal/containers/modal-test-bet';
import ModalAugurP2P from 'modules/modal/containers/modal-p2p-trading';
import ModalGlobalChat from 'modules/modal/containers/modal-global-chat';
import ModalAccountCreated from 'modules/modal/containers/modal-account-created';
import ModalWalletError from 'modules/modal/containers/modal-wallet-error';
import ModalAugurUsesDai from 'modules/modal/containers/modal-augur-uses-dai';
import ModalTutorialOutro from 'modules/modal/containers/modal-tutorial-outro';
import ModalTutorialIntro from 'modules/modal/containers/modal-tutorial-intro';
import { Scalar as ModalScalar } from 'modules/modal/scalar';
import ModalInvalidMarketRules from 'modules/modal/containers/modal-invalid-market-rules';
import ModalInitializeAccounts from 'modules/modal/containers/modal-initialize-account';
import ModalHelp from 'modules/modal/containers/modal-help';
import ModalOdds from 'modules/modal/containers/modal-odds';
import { useHistory } from 'react-router';

import * as TYPES from 'modules/common/constants';

import Styles from 'modules/modal/common.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { track } from 'services/analytics/helpers';

const ESCAPE_KEYCODE = 27;

function selectModal(type, props, closeModal, modal) {
  switch (type) {
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
    case TYPES.MODAL_CASHOUT:
      return <ModalCashOut />;
    case TYPES.MODAL_MIGRATE_REP:
      return <ModalMigrateRep />;
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
    case TYPES.MODAL_CLAIM_FEES:
      return <ModalClaimFees {...modal} />;
    case TYPES.MODAL_DISCLAIMER:
      return <ModalDisclaimer {...modal} />;
    case TYPES.MODAL_MARKET_LOADING:
      return <ModalMarketLoading />;
    case TYPES.MODAL_DR_QUICK_GUIDE:
      return <ModalDrQuickGuide />;
    case TYPES.MODAL_MIGRATE_MARKET:
      return <ModalMigrateMarket {...modal} />;
    case TYPES.MODAL_LOGIN:
      return <ModalSignin {...props} isLogin />;
    case TYPES.MODAL_HELP:
      return <ModalHelp {...props} />;
    case TYPES.MODAL_ODDS:
      return <ModalOdds {...props} />;
    case TYPES.MODAL_SIGNUP:
      return <ModalSignin {...props} isLogin={false} />;
    case TYPES.MODAL_LOADING:
      return <ModalLoading />;
    case TYPES.MODAL_UNIVERSE_SELECTOR:
      return <ModalUniverseSelector />;
    case TYPES.MODAL_TEST_BET:
      return <ModalTestBet />;
    case TYPES.MODAL_AUGUR_P2P:
      return <ModalAugurP2P />;
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
    case TYPES.MODAL_ERROR:
      return <ModalWalletError />
    case TYPES.MODAL_SCALAR_MARKET:
      return <ModalScalar {...modal} />
    case TYPES.MODAL_INVALID_MARKET_RULES:
      return <ModalInvalidMarketRules />;
    case TYPES.MODAL_INITIALIZE_ACCOUNT:
      return <ModalInitializeAccounts />;
    default:
      return <div />;
  }
}

const ModalView = () => {
  const history = useHistory();
  const { modal, actions: { closeModal } } = useAppStatusStore();
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
    track(modal.type + ' - ' + MODAL_VIEWED, {
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
          [Styles.Taller]:
            modal.type === TYPES.MODAL_DISCLAIMER,
        })}
      >
        {Modal}
      </div>
    </section>
  );
};

export default ModalView;
