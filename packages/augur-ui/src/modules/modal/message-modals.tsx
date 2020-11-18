import React from 'react';

import { useAppStatusStore } from 'modules/app/store/app-status';
import { submitNewMarket } from 'modules/markets/actions/submit-new-market';
import { MARKET_CREATION_COPY } from 'modules/create-market/constants';
import {
  getParaToken,
  getRep,
  getGasPrice,
} from 'modules/contracts/actions/contractCalls';
import {
  REPORTING_GUIDE,
  DISPUTING_GUIDE,
  MODAL_LEDGER,
  MODAL_TREZOR,
  MODAL_ADD_FUNDS,
  MIGRATE_MARKET_GAS_ESTIMATE,
  REPORTING_ONLY_DESC,
  SPORTS_GROUP_MARKET_TYPES_READABLE,
} from 'modules/common/constants';
import { selectMarket } from 'modules/markets/selectors/market';
import { sendFinalizeMarket } from 'modules/markets/actions/finalize-market';
import isMetaMask from 'modules/auth/helpers/is-meta-mask';
import { Message } from './message';
import { formatGasCostToEther, formatDai } from 'utils/format-number';
import { DISMISSABLE_NOTICE_BUTTON_TYPES } from 'modules/reporting/common';

export const ModalMarketRules = () => {
  const {
    modal: { endTime, description, sportMarkets },
    actions: { closeModal },
  } = useAppStatusStore();

  let resolutionDetailsArray = [];
  sportMarkets.forEach(details => {
      const dupes = resolutionDetailsArray.filter(v => {
        return v.details === details.details && v.sportsBook?.groupType === details.sportsBook?.groupType
      });
      if (dupes.length === 0) {
        resolutionDetailsArray.push(details);
      }
    }
  );

  let headers = [
    {
      header: `${description}`,
      subheaders: [`Event Expiration date: ${endTime}`],
    },
  ];

  resolutionDetailsArray.map(details => {
    headers.push({
      header: SPORTS_GROUP_MARKET_TYPES_READABLE[details.sportsBook?.groupType],
      bullets: true,
      subheaders: details.details.split('\n'),
    })
  });
  return (
    <Message
      title="Market Rules"
      subheaders={headers}
      closeAction={() => closeModal()}
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

export const ModalCreateMarket = () => {
  const {
    newMarket,
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      title="Final confirmation"
      subheaders={[
        {
          header: 'Are you sure you want to proceeed?',
          subheaders: [
            'Once you create the market you can’t make any changes to the market or resolution details. Ensure that all market details are accurate before proceeding.',
          ],
        },
        {
          header: 'Ready to proceed? Here’s what happens next, you will:',
          numbered: false,
          subheaders: [
            'Be taken to the portfolio page where your market will be listed as “Pending”',
            'Receive an alert when the market has been processed',
            'Receive a notification in your Account Summary to submit any initial liquidity previously entered',
          ],
        },
      ]}
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
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      title="Market Creation Help"
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

export const ModalTokenFaucet = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      title={modal.token}
      description={[
        `Get test net ${modal.token}, it will be sent to your connected wallet.`,
      ]}
      closeAction={() => {
        closeModal();
      }}
      buttons={[
        {
          text: `Get ${modal.token}`,
          action: () => {
            getParaToken();
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
      title="Discard draft?"
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

  const subheaders = guide.content.map(content => {
    return {
      header: content.header,
      subheaders: content.paragraphs,
    };
  });

  return (
    <Message
      title={guide.title}
      subheaders={subheaders}
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
      title="Finalize Warp Sync Market"
      marketTitle={marketDescription}
      callToAction={
        'Please finalize warp sync market to claim REPv2 reward. The reward will be transferred to your signing wallet'
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
      showHelp
      title="Popular help resources"
      closeAction={() => {
        closeModal();
      }}
    />
  );
};

export const ReportingOnly = () => {
  const {
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      description={[REPORTING_ONLY_DESC]}
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

export const ModalInvalidMarketRules = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      invalidMarketRules
      title="Invalid Outcome"
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
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      title="REPv2 Faucet"
      closeAction={() => closeModal()}
      description={[
        'Get test net REPv2, it will be sent to your connected wallet.',
      ]}
      buttons={[
        {
          text: 'Get REPv2',
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
      showOdds
      title="Settings"
      closeAction={() => {
        closeModal();
      }}
    />
  );
};

export const ModalMarketLoading = () => {
  const {
    actions: { closeModal },
  } = useAppStatusStore();

  return (
    <Message
      title="Market Loading"
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
    <Message title="Network Mismatch" buttons={[]} description={description} />
  );
};

export const ModalNetworkDisabled = () => (
  <Message
    title="Network Disabled"
    description={['Connecting to mainnet through this UI is disabled.']}
  />
);

export const ModalWalletError = () => {
  const {
    modal: {
      link,
      linkLabel,
      error,
      title,
      showAddFundsHelp,
      showDiscordLink,
      walletType,
    },
    actions: { closeModal, setModal },
  } = useAppStatusStore();

  const linkContent = {
    link,
    label: linkLabel,
    description: error,
  };

  return (
    <Message
      {...{
        showDiscordLink,
        showAddFundsHelp,
        walletType,
      }}
      title={title ? title : 'Something went wrong'}
      buttons={[{ text: 'Close', action: () => closeModal() }]}
      description={link ? null : [error ? error : '']}
      descriptionWithLink={link ? linkContent : null}
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
      migrateMarket
      title="Migrate Market"
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

export const ModalCashoutBet = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  const { wager, cashOut, odds, positive, cb } = modal;

  return (
    <Message
      title="Are you sure you want to cash out?"
      description={[
        'If the odds or orderbook change during submission, the amount may be rejected. ',
      ]}
      closeAction={() => {
        closeModal();
      }}
      breakdown={[
        {
          label: 'Wager',
          value: formatDai(wager).full,
        },
        {
          label: 'Odds',
          value: odds,
        },
        {
          label: 'Cash out',
          value: formatDai(cashOut).full,
          positive: positive,
          showColor: true,
        },
      ]}
      buttons={[
        {
          text: 'Confirm',
          action: () => {
            if (cb) {
              cb();
            }
            closeModal();
          },
        },
        {
          text: 'Cancel',
          action: () => {
            closeModal();
          },
        },
      ]}
    />
  );
};

export const ModalCancelAllBets = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  const { cb } = modal;

  return (
    <Message
      title="Are you sure you want to cancel all your unmatched bets?"
      description={[
        'Nobody matched your bets yet. Use this option if you want to get your money back, or wait a little longer. It can still be matched.',
      ]}
      closeAction={() => {
        closeModal();
      }}
      buttons={[
        {
          text: 'Cancel Bets',
          action: () => {
            if (cb) {
              cb();
            }
            closeModal();
          },
        },
        {
          text: 'Keep Bets',
          action: () => {
            closeModal();
          },
        },
      ]}
    />
  );
};
