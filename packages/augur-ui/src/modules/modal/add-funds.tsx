import React, { useState } from 'react';
import { CloseButton, BackButton } from 'modules/common/buttons';
import {
  FundsHelp,
  CreditCard,
  Coinbase,
  Transfer,
} from 'modules/modal/common';
import { RadioTwoLineBarGroup } from 'modules/common/form';
import classNames from 'classnames';
import {
  ACCOUNT_TYPES,
  DAI,
  REP,
  ETH,
  ADD_FUNDS_SWAP,
  ADD_FUNDS_COINBASE,
  ADD_FUNDS_CREDIT_CARD,
  ADD_FUNDS_TRANSFER,
} from 'modules/common/constants';
import { Swap } from 'modules/swap/components/swap';
import { PillSelection } from 'modules/common/selection';
import { useAppStatusStore } from 'modules/app/store/app-status';

import Styles from 'modules/modal/modal.styles.less';

interface AddFundsProps {
  autoSelect: boolean;
}

export const AddFunds = ({
  autoSelect = false,
}: AddFundsProps) => {

  const {
    loginAccount: {
      address,
      meta: accountMeta,
      balances,
    },
    modal: {
      initialAddFundsFlow = null,
      tokenToAdd = DAI
    },
    modal,
    actions: { closeModal },
  } = useAppStatusStore();

  const usingOnRampSupportedWallet = accountMeta &&
    accountMeta.accountType === ACCOUNT_TYPES.TORUS ||
    accountMeta.accountType === ACCOUNT_TYPES.FORTMATIC;

  const [selectedOption, setSelectedOption] = useState(
    initialAddFundsFlow ? initialAddFundsFlow : usingOnRampSupportedWallet && tokenToAdd === DAI ? ADD_FUNDS_CREDIT_CARD : ADD_FUNDS_COINBASE
  );

      const closeAction = () => {
    if (modal.cb) {
      modal.cb();
    }
    closeModal();
  };

  if (!address) {
        return null;
  }

  const fundTypeLabel = tokenToAdd === DAI ?  'Dai ($)' : tokenToAdd;

  const FUND_OTPIONS = [
    {
      header: 'Credit/debit card',
      description: 'Add funds instantly using a credit/debit card',
      value: ADD_FUNDS_CREDIT_CARD,
    },
    {
      header: 'Coinbase',
      description: 'Send funds from a Coinbase account ',
      value: ADD_FUNDS_COINBASE,
    },
    {
      header: 'Transfer',
      description: 'Send funds to your trading account',
      value: ADD_FUNDS_TRANSFER,
    },
    {
      header: 'Convert',
      description: `Trade another token currency for ${tokenToAdd === DAI ? 'DAI ($)' : tokenToAdd}`,
      value: ADD_FUNDS_SWAP,
    },
  ];

  let addFundsOptions = [...FUND_OTPIONS];

  // Only show CreditCard option for onRamp wallets using the Add DAI flow
  if (tokenToAdd !== DAI || !usingOnRampSupportedWallet) {
    addFundsOptions = addFundsOptions.slice(1, addFundsOptions.length);
  }

  // If Add REP flow show SWAP at the top
  if (tokenToAdd === REP) {
    addFundsOptions = addFundsOptions.filter(
      option => option.value !== ADD_FUNDS_SWAP
    );
    addFundsOptions.unshift(
      FUND_OTPIONS.find(option => option.value === ADD_FUNDS_SWAP)
    );
  }

  const SWAP_ID = 0;
  const pillOptions = [{ label: 'Convert', id: SWAP_ID }];

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
          <h1>{tokenToAdd === REP ? 'Get REP' : 'Add Funds'}</h1>
          <h2>Choose a method</h2>
          <RadioTwoLineBarGroup
            radioButtons={addFundsOptions}
            defaultSelected={selectedOption}
            hideRadioButton
            onChange={value => {
              setSelectedOption(() => value && value.toString());
            }}
          />
          {tokenToAdd !== ETH && <FundsHelp fundType={tokenToAdd} />}
        </div>
      </div>
      <div>
        <div>
          <BackButton action={() => setSelectedOption(() => null)} />
          <CloseButton action={() => closeAction()} />
        </div>
        <div
          className={classNames({
            [Styles.AddFundsTransfer]: selectedOption === ADD_FUNDS_TRANSFER,
            [Styles.AddFundsCreditDebit]:
              selectedOption === ADD_FUNDS_CREDIT_CARD,
            [Styles.AddFundsCoinbase]: selectedOption === ADD_FUNDS_COINBASE,
          })}
        >
          {selectedOption === ADD_FUNDS_SWAP && (
            <>
              <h1>Convert</h1>
              <h2>
                {tokenToAdd === REP
                  ? 'Trade a currency for REP'
                  : 'Trade ETH or REP for DAI ($) and vice versa'}
              </h2>

              <div className={Styles.AddFundsSwap}>
                <PillSelection
                  options={pillOptions}
                  defaultSelection={SWAP_ID}
                />
              </div>

              <Swap/>
            </>
          )}

          {selectedOption === ADD_FUNDS_CREDIT_CARD && (
            <CreditCard
              fundTypeLabel={fundTypeLabel}
              fundTypeToUse={tokenToAdd}
            />
          )}
          {selectedOption === ADD_FUNDS_COINBASE && (
            <Coinbase
              fundTypeToUse={tokenToAdd}
              fundTypeLabel={fundTypeLabel}
            />
          )}
          {selectedOption === ADD_FUNDS_TRANSFER && (
            <Transfer
              fundTypeToUse={tokenToAdd}
              fundTypeLabel={fundTypeLabel}
            />
          )}
        </div>
        {tokenToAdd !== ETH && selectedOption !== ADD_FUNDS_SWAP && (
          <FundsHelp fundType={tokenToAdd} />
        )}
        <div>
          <button onClick={() => closeAction()}>Done</button>
        </div>
      </div>
    </div>
  );
};