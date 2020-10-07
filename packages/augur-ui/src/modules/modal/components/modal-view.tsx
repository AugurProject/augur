import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import ModalReporting from 'modules/modal/reporting';
import { TransferForm as ModalWithdraw } from 'modules/modal/transfer-form';
import { MigrateRep as ModalMigrateRep } from 'modules/modal/migrate-rep';
import { Transactions as ModalTransactions } from 'modules/modal/transactions';
import ModalNetworkDisconnected from 'modules/modal/components/modal-network-disconnected';
import {
  ModalClaimFees,
  ModalUnsignedOrders,
  ModalOpenOrders,
} from 'modules/modal/shared-modals';
import { ModalClaimMarketsProceeds } from 'modules/modal/shared-modals';
import { ModalParticipate } from 'modules/modal/components/modal-participate';
import ModalNetworkConnect from 'modules/modal/components/modal-network-connect';
import ModalDisclaimer from 'modules/modal/components/modal-disclaimer';
import { Gas as ModalGasPrice } from 'modules/modal/gas';
import { AddFunds as ModalAddFunds } from 'modules/modal/add-funds';
import { SignIn as ModalSignin } from 'modules/modal/signin';
import { Loading as ModalLoading } from 'modules/modal/loading';
import { ModalUniverseSelector } from 'modules/modal/components/modal-universe-selector';
import {
  ModalTestBet,
  ModalAugurUsesDai,
  ModalApprovals,
  ModalEthDeposit,
  ModalSwap,
  ModalBankroll,
  ModalTokenSelect
} from 'modules/modal/onboarding-modals';
import { ModalAddLiquidity } from 'modules/modal/add-liquidity';
import { Scalar as ModalScalar } from 'modules/modal/scalar';
import { useHistory } from 'react-router';
import { ModalFrozenFunds } from 'modules/modal/components/modal-frozen-funds';
import * as TYPES from 'modules/common/constants';

import Styles from 'modules/modal/common.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { track, MODAL_VIEWED } from 'services/analytics/helpers';
import {
  ModalCreateMarket,
  ModalDaiFaucet,
  ModalCreationHelp,
  ModalFinalize,
  ModalDiscard,
  ModalDrQuickGuide,
  ModalHelp,
  ModalRepFaucet,
  ModalSignTransaction,
  ModalMarketLoading,
  ModalOdds,
  ModalInvalidMarketRules,
  ModalNetworkMismatch,
  ModalNetworkDisabled,
  ModalMigrateMarket,
  ModalWalletError,
  ReportingOnly,
  ModalCashoutBet,
  ModalCancelAllBets,
  ModalMarketRules
} from 'modules/modal/message-modals';
import { HardwareWallet } from 'modules/modal/hardware-wallet';
import { ModalGlobalChat } from 'modules/modal/components/modal-global-chat';

const ESCAPE_KEYCODE = 27;

function selectModal(type, props, closeModal, modal) {
  switch (type) {
    case TYPES.MODAL_ADD_LIQUIDITY:
      return <ModalAddLiquidity />;
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
    case TYPES.MODAL_MARKET_RULES:
      return <ModalMarketRules />;
    case TYPES.MODAL_CREATE_MARKET:
      return <ModalCreateMarket />;
    case TYPES.MODAL_ADD_FUNDS:
      return (
        <>
          {/* MOBILE */}
          <ModalAddFunds />

          {/* DESKTOP */}
          <ModalAddFunds autoSelect />
        </>
      );
    case TYPES.MODAL_HARDWARE_WALLET:
      return <HardwareWallet />;
    case TYPES.MODAL_DAI_FAUCET:
      return <ModalDaiFaucet />;
    case TYPES.MODAL_CREATION_HELP:
      return <ModalCreationHelp {...modal} />;
    case TYPES.MODAL_TRANSFER:
      return <ModalWithdraw />;
    case TYPES.MODAL_CASHOUT_BET:
      return <ModalCashoutBet />;
    case TYPES.MODAL_CANCEL_ALL_BETS:
      return <ModalCancelAllBets />;
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
    case TYPES.MODAL_APPROVALS:
      return <ModalApprovals />;
    case TYPES.MODAL_ETH_DEPOSIT:
      return <ModalEthDeposit />;
    case TYPES.MODAL_BANKROLL:
      return <ModalBankroll />;
    case TYPES.MODAL_TOKEN_SELECT:
      return <ModalTokenSelect />;
    case TYPES.MODAL_SWAP:
      return <ModalSwap />;
    case TYPES.MODAL_TUTORIAL_OUTRO:
      return <ModalTutorialOutro {...modal} />;
    case TYPES.MODAL_TUTORIAL_INTRO:
      return <ModalTutorialIntro {...modal} />;
    case TYPES.MODAL_AUGUR_USES_DAI:
      return <ModalAugurUsesDai />;
    case TYPES.MODAL_ERROR:
      return <ModalWalletError />;
    case TYPES.MODAL_SCALAR_MARKET:
      return <ModalScalar {...modal} />;
    case TYPES.MODAL_INVALID_MARKET_RULES:
      return <ModalInvalidMarketRules />;
    case TYPES.MODAL_FROZEN_FUNDS:
      return <ModalFrozenFunds />;
    case TYPES.MODAL_REPORTING_ONLY:
      return <ReportingOnly />;
    case TYPES.MODAL_GLOBAL_CHAT:
      return <ModalGlobalChat />;
    default:
      return <div />;
  }
}

const ModalView = () => {
  const history = useHistory();
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();
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
  const trackModalViewed = (modalName, payload) =>
    track(modalName + ' - ' + MODAL_VIEWED, payload);

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
          [Styles.Taller]: modal.type === TYPES.MODAL_DISCLAIMER,
        })}
      >
        {Modal}
      </div>
    </section>
  );
};

export default ModalView;
