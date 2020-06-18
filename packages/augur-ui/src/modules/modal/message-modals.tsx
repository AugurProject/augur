import React from 'react';

import { useAppStatusStore } from 'modules/app/store/app-status';
import { submitNewMarket } from 'modules/markets/actions/submit-new-market';
import { MARKET_CREATION_COPY } from 'modules/create-market/constants';
import { getDai, getRep, getGasPrice } from 'modules/contracts/actions/contractCalls';
import {
  REPORTING_GUIDE,
  DISPUTING_GUIDE,
  MODAL_LEDGER,
  MODAL_TREZOR,
  MODAL_ADD_FUNDS,
  MIGRATE_MARKET_GAS_ESTIMATE,
  GSN_WALLET_SEEN,
} from 'modules/common/constants';
import { selectMarket } from 'modules/markets/selectors/market';
import { sendFinalizeMarket } from 'modules/markets/actions/finalize-market';
import isMetaMask from 'modules/auth/helpers/is-meta-mask';
import { Message } from './message';
import { formatGasCostToEther, formatAttoEth, formatDai } from 'utils/format-number';
import { DISMISSABLE_NOTICE_BUTTON_TYPES } from 'modules/reporting/common';
import { FormattedNumber } from 'modules/types';
import { createFundedGsnWallet } from 'modules/auth/actions/update-sdk';

export const ModalCreateMarket = () => {
  const {
    newMarket,
    modal,
    loginAccount: { address },
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      title={'Final confirmation'}
      subheader={{
        header: 'Are you sure you want to proceeed?',
        subheaders: [
          'Once you create the market you can’t make any changes to the market or resolution details. Ensure that all market details are accurate before proceeding.',
        ],
      }}
      subheader_2={{
        header: 'Ready to proceed? Here’s what happens next, you will:',
        numbered: true,
        subheaders: [
          'Be taken to the portfolio page where your market will be listed as “Pending”',
          'Receive an alert when the market has been processed',
          'Receive a notification in your Account Summary to submit any initial liquidity previously entered',
        ],
      }}
      closeAction={() => closeModal()}
      buttons={[
        {
          text: 'Confirm',
          action: () => {
            submitNewMarket(newMarket);
            if (modal.cb) {
              modal.cb();
            }
            closeModal();
          },
        },
        {
          text: 'Cancel',
          action: () => closeModal(),
        },
      ]}
    />
  );
};

export const ModalCreationHelp = ({ copyType }) => {
  const {
    modal,
    loginAccount: account,
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      title={'Market Creation Help'}
      description={copyType && MARKET_CREATION_COPY[copyType].subheader}
      closeAction={() => {
        closeModal();
      }}
      buttons={[
        {
          text: 'Close',
          action: () => {
            closeModal();
          },
        },
      ]}
    />
  );
};

export const ModalDaiFaucet = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      title={'DAI Faucet'}
      description={[
        'Get test net DAI, it will be sent to your connected wallet.',
      ]}
      closeAction={() => {
        closeModal();
      }}
      buttons={[
        {
          text: 'Get DAI',
          action: () => {
            getDai();
            closeModal();
          },
        },
        {
          text: 'Cancel',
          action: () => closeModal(),
        },
      ]}
    />
  );
};

export const ModalDiscard = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      title={'Discard draft?'}
      description={['You will lose any data you have entered.']}
      closeAction={() => {
        closeModal();
        if (modal.cb) {
          modal.cb(false);
        }
      }}
      buttons={[
        {
          text: 'Discard draft',
          action: () => {
            closeModal();
            if (modal.cb) {
              modal.cb(true);
            }
          },
        },
        {
          text: 'Cancel',
          type: 'gray',
          action: () => {
            closeModal();
            if (modal.cb) {
              modal.cb(false);
            }
          },
        },
      ]}
    />
  );
};

export const ModalDrQuickGuide = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  const guide =
    modal.whichGuide === 'reporting' ? REPORTING_GUIDE : DISPUTING_GUIDE;

  return (
    <Message
      title={guide.title}
      description={guide.content}
      closeAction={() => {
        closeModal();
      }}
      buttons={[
        {
          text: guide.learnMoreButtonText,
          URL: guide.learnMoreUrl,
          action: () => {
            closeModal();
          },
        },
        {
          text: guide.closeButtonText,
          action: () => {
            closeModal();
          },
        },
      ]}
    />
  );
};

export const ModalFinalize = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  const market = selectMarket(modal.marketId);
  const marketDescription = market.description;

  return (
    <Message
      title={'Finalize Warp Sync Market'}
      marketTitle={marketDescription}
      callToAction={
        'Please finalize warp sync market to claim REP reward. The reward will be transferred to your signing wallet'
      }
      closeAction={() => {
        closeModal();
        if (modal.cb) {
          modal.cb();
        }
      }}
      buttons={[
        {
          text: 'Finalize',
          action: () => {
            sendFinalizeMarket(modal.marketId, modal.cb);
            closeModal();
          },
        },
      ]}
    />
  );
};

export const ModalHelp = () => {
  const {
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      showHelp={true}
      title={'Popular help resources'}
      closeAction={() => {
        closeModal();
      }}
    />
  );
};

export const ModalInvalidMarketRules = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      invalidMarketRules={true}
      title={'Invalid Outcome'}
      closeAction={() => {
        closeModal();
        if (modal.cb) {
          modal.cb();
        }
      }}
      buttons={[
        {
          text: 'Ok',
          action: () => {
            closeModal();
          },
        },
      ]}
    />
  );
};

const signerTypes = {
  [MODAL_LEDGER]: 'Ledger',
  [MODAL_TREZOR]: 'Trezor',
};

export const ModalSignTransaction = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();
  const type = signerTypes[modal.type];

  return (
    <Message
      title={`${type} Information`}
      closeAction={() => closeModal()}
      description={[
        modal.error ? modal.error : `Please sign transaction on ${type}.`,
      ]}
      buttons={
        modal.error
          ? [
              {
                text: 'Close',
                action: () => closeModal(),
              },
            ]
          : []
      }
    />
  );
};

export const ModalRepFaucet = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      title={'REP Faucet'}
      closeAction={() => closeModal()}
      description={[
        'Get test net REP, it will be sent to your connected wallet.',
      ]}
      buttons={[
        {
          text: 'Get REP',
          action: () => {
            getRep();
            closeModal();
          },
        },
        {
          text: 'Cancel',
          action: () => closeModal(),
        },
      ]}
    />
  );
};

export const ModalOdds = () => {
  const {
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      showOdds={true}
      title={'Settings'}
      closeAction={() => {
        closeModal();
      }}
    />
  );
};

export const ModalMarketLoading = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      title={`Market Loading`}
      buttons={[]}
      description={['Please wait, Market is loading...']}
      closeAction={() => {
        closeModal();
      }}
    />
  );
};

export const ModalNetworkMismatch = () => {
  const { modal } = useAppStatusStore();

  const { expectedNetwork } = modal;
  const description: Array<string> | undefined = [];
  if (isMetaMask()) {
    description.push(
      `MetaMask is connected to the wrong Ethereum network. Please set the MetaMask network to: ${expectedNetwork}.`
    );
  } else {
    description.push(
      `Your Ethereum node and Augur node are connected to different networks.`
    );
    description.push(`Please connect to a ${expectedNetwork} Ethereum node.`);
  }

  return (
    <Message
      title={'Network Mismatch'}
      buttons={[]}
      description={description}
    />
  );
};

export const ModalNetworkDisabled = () => {
  const { modal } = useAppStatusStore();

  return (
    <Message
      title={'Network Disabled'}
      description={['Connecting to mainnet through this UI is disabled.']}
    />
  );
};

export const ModalWalletError = () => {
  const {
    modal,
    actions: { closeModal, setModal },
  } = useAppStatusStore();

  const linkContent = {
    link: modal.link,
    label: modal.linkLabel,
    description: modal.error,
  };

  return (
    <Message
      title={modal.title ? modal.title : 'Something went wrong'}
      buttons={[{ text: 'Close', action: () => closeModal() }]}
      description={modal.link ? null : [modal.error ? modal.error : '']}
      descriptionWithLink={modal.link ? linkContent : null}
      showDiscordLink={modal.showDiscordLink}
      showAddFundsHelp={modal.showAddFundsHelp}
      walletType={modal.walletType}
      closeAction={() => closeModal()}
      showAddFundsModal={() => setModal({ type: MODAL_ADD_FUNDS })}
    />
  );
};

export const ModalMigrateMarket = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  const gasCost = formatGasCostToEther(
    MIGRATE_MARKET_GAS_ESTIMATE.toFixed(),
    { decimalsRounded: 4 },
    getGasPrice()
  );

  const marketId = modal.market.id;
  const payoutNumerators = [];
  const description = '';
  const estimateGas = false;
  const migrateMarketThroughOneFork = () => {
    migrateMarketThroughOneFork(
      marketId,
      payoutNumerators,
      description,
      estimateGas
    );
  };

  return (
    <Message
      migrateMarket={true}
      title={'Migrate Market'}
      description={[
        'This market will be migrated to the winning universe and will no longer be viewable in the current universe.',
      ]}
      marketId={modal.market.id}
      marketTitle={modal.market.description}
      type={modal.marketType}
      closeModal={() => closeModal()}
      breakdown={[
        {
          label: 'Total Gas Cost (Est)',
          // @ts-ignore
          value: formatEther(gasCost).full,
        },
      ]}
      dismissableNotice={{
        title: 'You may need to sign multiple transactions',
        buttonType: DISMISSABLE_NOTICE_BUTTON_TYPES.CLOSE,
        show: true,
      }}
      buttons={[
        {
          text: 'Migrate Market',
          action: () => {
            migrateMarketThroughOneFork();
            closeModal();
          },
        },
        {
          text: 'Close',
          action: () => closeModal(),
        },
      ]}
    />
  );
};

export const ModalInitializeAccounts = () => {
  const {
    modal,
    env: {
      gsn: { desiredSignerBalanceInETH },
    },
    ethToDaiRate: { roundedValue: ethToDaiRate },
    actions: { closeModal },
  } = useAppStatusStore();

  const desiredSignerEthBalance = formatAttoEth(
    desiredSignerBalanceInETH * 10 ** 18
  ).value;
  const reserveAmount: FormattedNumber = formatDai(
    ethToDaiRate.multipliedBy(desiredSignerEthBalance)
  );

  const closeAction = () => {
    closeModal();

    const localStorageRef =
      typeof window !== 'undefined' && window.localStorage;
    if (localStorageRef && localStorageRef.setItem) {
      localStorageRef.setItem(GSN_WALLET_SEEN, 'true');
    }
  };

  return (
    <Message
      title={'Activate Account'}
      description={[
        `Augur is a peer-to-peer system, and certain actions require paying a small fee to other users of the system. The cost of these fees will be included in the total fees displayed when taking that action. Trades, Creating Markets, and Reporting on the market outcome are examples of such actions.\n Augur will reserve $${reserveAmount.formattedValue} of your funds in order to pay these fees, but your total balance can be cashed out at any time. To see the total amount reserved for fees, click on the Account menu.\n Until the account is activated you will be unable to place an order.`,
      ]}
      buttons={
        modal.customAction
          ? [
              {
                text: 'OK',
                action: () => {
                  if (modal.customAction) {
                    modal.customAction();
                  }
                  closeAction();
                },
              },
            ]
          : [
              {
                text: 'Activate Account',
                action: () => {
                  closeAction();
                  createFundedGsnWallet();
                },
              },
              {
                text: 'Do it later',
                action: () => {
                  closeAction();
                },
              },
            ]
      }
    />
  );
};
