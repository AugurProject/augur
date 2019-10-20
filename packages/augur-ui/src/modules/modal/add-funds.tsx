import React, { useState } from 'react';
import {
  ExternalLinkButton,
  PrimaryButton,
  CloseButton,
  BackButton,
} from 'modules/common/buttons';
import {
  AccountAddressDisplay,
  FundsHelp,
  DaiEthSelector,
} from 'modules/modal/common';
import { RadioTwoLineBarGroup, TextInput } from 'modules/common/form';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';

import { ACCOUNT_TYPES } from 'modules/common/constants';
import { LoginAccount } from 'modules/types';

import TooltipStyles from 'modules/common/tooltip.styles.less';
import Styles from 'modules/modal/modal.styles.less';
import { helpIcon } from 'modules/common/icons';
import noop from 'utils/noop';

interface AddFundsProps {
  closeAction: Function;
  address: string;
  accountMeta: LoginAccount['meta'];
  isGnosis: boolean;
  autoSelect?: boolean;
}

export const generateDaiTooltip = (
  tipText = 'Augur requires deposits in DAI ($), a currency pegged 1 to 1 to the US Dollar.'
) => {
  return (
    <span className={Styles.AddFundsToolTip}>
      <label
        className={classNames(TooltipStyles.TooltipHint)}
        data-tip
        data-for='tooltip--confirm'
      >
        {helpIcon}
      </label>
      <ReactTooltip
        id='tooltip--confirm'
        className={TooltipStyles.Tooltip}
        effect='solid'
        place='top'
        type='light'
      >
        <p>{tipText}</p>
      </ReactTooltip>
    </span>
  );
};

export const AddFunds = ({
  closeAction,
  accountMeta,
  address,
  isGnosis = false,
  autoSelect = false,
}: AddFundsProps) => {
  const [selectedOption, setSelectedOption] = useState(autoSelect ? [ACCOUNT_TYPES.TORUS, ACCOUNT_TYPES.PORTIS].includes(accountMeta.accountType) ? '0' : '1' : null);
  const [daiSelected, setDaiSelected] = useState(true);

  let addFundsOptions = [
    {
      header: 'Credit/debit card',
      description: 'Add Funds instantly using a credit/debit card',
      value: '0',
    },
    {
      header: 'Coinbase',
      description: 'Add funds using a Coinbase account',
      value: '1',
    },
    {
      header: 'Transfer',
      description: 'Transfer funds to your account address',
      value: '2',
    },
  ];

  if (
    accountMeta.accountType !== ACCOUNT_TYPES.TORUS &&
    accountMeta.accountType !== ACCOUNT_TYPES.PORTIS
  ) {
    addFundsOptions = addFundsOptions.slice(1, 3);
  }

  return (
    <div
      onClick={event => event.stopPropagation()}
      className={classNames(Styles.AddFunds, {
        [Styles.ShowSelected]: selectedOption,
        [Styles.hideOnMobile]: autoSelect,
        [Styles.hideOnDesktop]: !autoSelect,
      })}
    >
      <div>
        <div>
          <CloseButton action={() => closeAction()} />
        </div>
        <div>
          <h1>Add Funds</h1>
          <h2>Choose a method</h2>
          <RadioTwoLineBarGroup
            radioButtons={addFundsOptions}
            defaultSelected={selectedOption}
            hideRadioButton
            onChange={value => {
              setSelectedOption(() => value && value.toString());
            }}
          />
          <FundsHelp />
        </div>
      </div>
      <div>
        <div>
          <BackButton action={() => setSelectedOption(() => null)} />
          <CloseButton action={() => closeAction()} />
        </div>
        <div className={selectedOption === '2' ? Styles.AddFundsTransfer : Styles.AddFundsCreditDebitCoinbase}>
          {selectedOption === '0' && (
            <>
              <h1>Credit/debit card</h1>
              {accountMeta.accountType === ACCOUNT_TYPES.PORTIS && (
                <h2>
                  Add up to $250 worth of DAI {generateDaiTooltip()} instantly
                </h2>
              )}
              {accountMeta.accountType === ACCOUNT_TYPES.TORUS && (
                <h2>Add DAI {generateDaiTooltip()} instantly</h2>
              )}

              {!isGnosis && <h3>Asset to buy</h3>}
              {!isGnosis && (
                <DaiEthSelector
                  handleClick={isSelected => setDaiSelected(isSelected)}
                  daiSelected={daiSelected}
                />
              )}

              <h3>Amount</h3>
              <TextInput
                placeholder='0'
                onChange={noop}
                innerLabel={daiSelected ? 'DAI' : 'ETH'}
              />

              {accountMeta.accountType === ACCOUNT_TYPES.PORTIS && (
                <a href='https://wallet.portis.io/buy/' target='_blank'>
                  <PrimaryButton
                    action={() => null}
                    text={`Buy with ${accountMeta.accountType}`}
                  />
                </a>
              )}
              {accountMeta.accountType === ACCOUNT_TYPES.TORUS && (
                <PrimaryButton
                  action={() => accountMeta.openWallet('topup')}
                  text={`Buy with ${accountMeta.accountType}`}
                />
              )}
              {accountMeta.accountType === ACCOUNT_TYPES.PORTIS && (
                <h4>
                  You will be taken to Portis’ website to finalise the purchase
                  process. The funds will appear in your Augur account address
                  when complete.
                </h4>
              )}

              {accountMeta.accountType === ACCOUNT_TYPES.TORUS && (
                <h4>
                  Open the Tor.us wallet to start the purchase process. The
                  funds will appear in your Augur account address when complete.
                </h4>
              )}
            </>
          )}
          {selectedOption === '1' && (
            <>
              <h1>Coinbase</h1>
              <h2>
                Add up to $25,000 worth of DAI ($) {generateDaiTooltip()} using
                a Coinbase account
              </h2>
              <ol>
                <li>
                  Login to your account at{' '}
                  <a href='https://www.coinbase.com' target='blank'>
                    www.coinbase.com
                  </a>
                </li>
                <li>Buy the cryptocurrency DAI</li>
                <li>Send the DAI to your account address</li>
              </ol>
              <h3>Your Account Address</h3>
              <AccountAddressDisplay copyable address={address} />
            </>
          )}
          {selectedOption === '2' && (
            <>
              <h1>Transfer</h1>
              <h2>
                Send funds to your account address from any external service
              </h2>
              <ol>
                <li>
                  Buy DAI {generateDaiTooltip()} using any external service
                </li>
                <li>Transfer the DAI to your account address</li>
              </ol>
              <h3>Your Account Address</h3>
              <AccountAddressDisplay copyable address={address} />
              <ExternalLinkButton label='popular services for buying dai' />
            </>
          )}
        </div>
        <FundsHelp />
      </div>
    </div>
  );
};
