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
} from 'modules/modal/common';
import { RadioTwoLineBarGroup, TextInput } from 'modules/common/form';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import { toChecksumAddress } from 'ethereumjs-util';
import { ACCOUNT_TYPES, DAI, REP } from 'modules/common/constants';
import { LoginAccount } from 'modules/types';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import Styles from 'modules/modal/modal.styles.less';
import { helpIcon } from 'modules/common/icons';
import noop from 'utils/noop';

interface AddFundsProps {
  closeAction: Function;
  address: string;
  accountMeta: LoginAccount['meta'];
  Gnosis_ENABLED: boolean;
  autoSelect?: boolean;
  fundType: string;
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
  Gnosis_ENABLED = false,
  autoSelect = false,
  fundType = DAI,
}: AddFundsProps) => {
  let autoSelection = '2'; // default Coinbase

  if (autoSelect) {
    if ([ACCOUNT_TYPES.TORUS, ACCOUNT_TYPES.PORTIS].includes(accountMeta.accountType) && fundType !== REP) {
      autoSelection = '1'; // default Credit/Debit Card
    }
  }

  const [selectedOption, setSelectedOption] = useState(autoSelect ? autoSelection : null);
  const fundTypeLabel = fundType === DAI ? 'Dai ($)' : 'REP';

  const FUND_OTPIONS = [
    // TODO build uniswap component
    { header: 'Swap',
      description: 'Swap funds in your account for REP',
      value: '0',
    },
    {
      header: 'Credit/debit card',
      description: 'Add Funds instantly using a credit/debit card',
      value: '1',
    },
    {
      header: 'Coinbase',
      description: 'Send funds from a Coinbase account',
      value: '2',
    },
    {
      header: 'Transfer',
      description: 'Send funds to your Augur account address',
      value: '3',
    },
  ];

  const addFundsOptions = [FUND_OTPIONS[2], FUND_OTPIONS[3]];

  if (fundType !== REP && (accountMeta.accountType === ACCOUNT_TYPES.TORUS || accountMeta.accountType === ACCOUNT_TYPES.PORTIS)) {
    addFundsOptions.unshift(FUND_OTPIONS[1]);
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
          <h1>{fundType === REP ? 'Get REP' : 'Add Funds'}</h1>
          <h2>Choose a method</h2>
          <RadioTwoLineBarGroup
            radioButtons={addFundsOptions}
            defaultSelected={selectedOption}
            hideRadioButton
            onChange={value => {
              setSelectedOption(() => value && value.toString());
            }}
          />
          <FundsHelp fundType={fundType} />
        </div>
      </div>
      <div>
        <div>
          <BackButton action={() => setSelectedOption(() => null)} />
          <CloseButton action={() => closeAction()} />
        </div>
        <div className={selectedOption === '3' ? Styles.AddFundsTransfer : Styles.AddFundsCreditDebitCoinbase}>
          {selectedOption === '1' && (
            <>
              <h1>Credit/debit card</h1>
              {accountMeta.accountType === ACCOUNT_TYPES.PORTIS && (
                <h2>
                  Add up to $250 worth of {fundTypeLabel} {generateDaiTooltip()} instantly
                </h2>
              )}
              {accountMeta.accountType === ACCOUNT_TYPES.TORUS && (
                <h2>Add {fundTypeLabel} {generateDaiTooltip()} instantly</h2>
              )}

              <h3>Amount</h3>
              <TextInput
                placeholder='0'
                onChange={noop}
                innerLabel={'USD'}
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
              <h4>
                Buy Dai ($) with our secure payments partner, {accountMeta.accountType}. Funds will appear in your Augur account when payment finalizes.
              </h4>
            </>
          )}
          {selectedOption === '2' && (
            <>
              <h1>Coinbase</h1>
              <h2>
                Add up to $25,000 worth of {fundType === DAI ? <>{fundTypeLabel} {generateDaiTooltip()}</> : fundType} using
                a Coinbase account
              </h2>
              <ol>
                <li>
                  Login to your account at{' '}
                  <a href='https://www.coinbase.com' target='blank'>
                    www.coinbase.com
                  </a>
                </li>
                <li>Buy the cryptocurrency {fundTypeLabel}</li>
                <li>Send the {fundTypeLabel} to your augur account address</li>
              </ol>
              <h3>Augur account address</h3>
              <AccountAddressDisplay copyable address={toChecksumAddress(address)} />
              <ExternalLinkButton URL='https://docs.augur.net/' label={'Learn about your address'} />
            </>
          )}
          {selectedOption === '3' && (
            <>
              <h1>Transfer</h1>
              <h2>
                Send funds to your Augur account address
              </h2>
              <ol>
                <li>
                  Buy{' '}
                  {fundType === DAI ? (
                    <>
                      {fundTypeLabel} {generateDaiTooltip()}
                    </>
                  ) : (
                    fundTypeLabel
                  )}{' '}
                   using an app or exchange (see our list of <a target='blank' href='https://docs.augur.net/'>popular ways to buy {fundTypeLabel})</a>
                </li>
                <li>Transfer the {fundTypeLabel} to your Augur account address</li>
              </ol>
              <h3>Augur account address</h3>
              <AccountAddressDisplay copyable address={toChecksumAddress(address)} />
              <ExternalLinkButton URL='https://docs.augur.net/' label={'Learn about your address'} />
            </>
          )}
        </div>
        <FundsHelp fundType={fundType} />
        <div>
          <button onClick={() => closeAction()}>Done</button>
        </div>
      </div>
    </div>
  );
};
