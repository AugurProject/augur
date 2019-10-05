import React, { useState } from 'react';

import {
  ExternalLinkButton,
  PrimaryButton,
  CloseButton,
  BackButton,
} from 'modules/common/buttons';
import { AccountAddressDisplay, FundsHelp } from 'modules/modal/common';

import Styles from 'modules/modal/modal.styles.less';
import { RadioTwoLineBarGroup, TextInput } from 'modules/common/form';
import classNames from 'classnames';
import { ACCOUNT_TYPES } from 'modules/common/constants';
import { LoginAccount } from 'modules/types';

interface AddFundsProps {
  closeAction: Function;
  address: string;
  accountMeta: LoginAccount['meta'];
}

export const AddFunds = ({
  closeAction,
  accountMeta,
  address,
}: AddFundsProps) => {
  const [selectedOption, setSelectedOption] = useState(null);

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
      className={classNames(Styles.AddFunds, {
        [Styles.ShowSelected]: selectedOption,
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
        <div>
          {selectedOption === '0' && (
            <>
              <h1>Credit/debit card</h1>
              {accountMeta.accountType === ACCOUNT_TYPES.PORTIS && (
                <h2>Add up to $250 worth of DAI/ETH instantly</h2>
              )}
              {accountMeta.accountType === ACCOUNT_TYPES.TORUS && (
                <h2>Add DAI/ETH instantly</h2>
              )}

              {accountMeta.accountType === ACCOUNT_TYPES.PORTIS && (
                <h3>Amount</h3>
              )}
              {accountMeta.accountType === ACCOUNT_TYPES.PORTIS && (
                <TextInput placeholder="0" onChange={null} innerLabel="DAI" />
              )}
              {accountMeta.accountType === ACCOUNT_TYPES.PORTIS && (
                <a href="https://wallet.portis.io/buy/" target="_blank">
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
              <h2>Add up to $25,000 worth of DAI using a Coinbase account</h2>
              <ol>
                <li>
                  Login to your account at{' '}
                  <a href="https://www.coinbase.com" target="blank">
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
                <li>Buy DAI using any external service</li>
                <li>Transfer the DAI to your account address</li>
              </ol>
              <h3>Your Account Address</h3>
              <AccountAddressDisplay copyable address={address} />
              <ExternalLinkButton label="popular services for buying dai" />
            </>
          )}
        </div>
        <FundsHelp />
      </div>
    </div>
  );
};
