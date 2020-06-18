import { React } from 'react';

import { useAppStatusStore } from 'modules/app/store/app-status';
import { Message } from "modules/modal/message";
import { submitNewMarket } from 'modules/markets/actions/submit-new-market';
import { MARKET_CREATION_COPY } from 'modules/create-market/constants';
import { getDai, getRep } from 'modules/contracts/actions/contractCalls';
import { REPORTING_GUIDE, DISPUTING_GUIDE, MODAL_LEDGER, MODAL_TREZOR } from 'modules/common/constants';
import { selectMarket } from 'modules/markets/selectors/market';
import { sendFinalizeMarket } from 'modules/markets/actions/finalize-market';
import isMetaMask from 'modules/auth/helpers/is-meta-mask';

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
  const {
    modal,
  } = useAppStatusStore();

  const { expectedNetwork } = modal;
  const description: Array<string> | undefined = [];
  if (isMetaMask()) {
    description.push(`MetaMask is connected to the wrong Ethereum network. Please set the MetaMask network to: ${expectedNetwork}.`);
  } else {
    description.push(
      `Your Ethereum node and Augur node are connected to different networks.`,
    );
    description.push(`Please connect to a ${expectedNetwork} Ethereum node.`);
  }

  return (
    <Message
      title={"Network Mismatch"}
      buttons={[]}
      description={description}
    />
  );
};
