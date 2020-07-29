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
  USDC,
  USDT,
} from 'modules/common/constants';
import { LoginAccount } from 'modules/types';
import { Swap } from 'modules/swap/components/swap';
import { PillSelection } from 'modules/common/selection';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import type { SDKConfiguration } from '@augurproject/artifacts';

import Styles from 'modules/modal/modal.styles.less';

interface AddFundsProps {
  autoSelect: boolean;
  closeAction: Function;
  tokenToAdd: string;
  loginAccount: LoginAccount;
  ETH_RATE: BigNumber;
  REP_RATE: BigNumber;
  config: SDKConfiguration;
  addFundsTorus: Function;
  addFundsFortmatic: Function;
  useSigner?: boolean;
  initialAddFundsFlow?: string;
  initialSwapToken?: string;
}

export const AddFunds = ({
  autoSelect = false,
  closeAction,
  tokenToAdd = DAI,
  loginAccount,
  ETH_RATE,
  REP_RATE,
  config,
  addFundsTorus,
  addFundsFortmatic,
  useSigner = false,
  initialAddFundsFlow = null,
  initialSwapToken = null,
}: AddFundsProps) => {
  const address = loginAccount.address;
  const accountMeta = loginAccount.meta;
  const BUY_MIN = 20;
  const BUY_MAX = 250;

  const usingOnRampSupportedWallet = accountMeta &&
    accountMeta.accountType === ACCOUNT_TYPES.TORUS ||
    accountMeta.accountType === ACCOUNT_TYPES.FORTMATIC;

  const [amountToBuy, setAmountToBuy] = useState(createBigNumber(0));
  const [isAmountValid, setIsAmountValid] = useState(false);

  const validateAndSet = amount => {
    const amountToBuy = createBigNumber(amount);
    if (amountToBuy.gte(BUY_MIN) && amountToBuy.lte(BUY_MAX)) {
      setIsAmountValid(true);
    } else {
      setIsAmountValid(false);
    }
    setAmountToBuy(amountToBuy);
  };

  const fundTypeLabel = tokenToAdd === DAI ?  'DAI ($)' : tokenToAdd;

  const [selectedOption, setSelectedOption] = useState(
    initialAddFundsFlow ? initialAddFundsFlow : usingOnRampSupportedWallet && tokenToAdd === DAI ? ADD_FUNDS_CREDIT_CARD : ADD_FUNDS_COINBASE
  );

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

  if (initialSwapToken === USDC || initialSwapToken === USDT) {
    // Convert USDT/USDC to dai flow, only show SWAP payament flow to avoid confusion
    addFundsOptions = [FUND_OTPIONS[ADD_FUNDS_SWAP]];
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

              <Swap
                address={loginAccount.address}
                balances={loginAccount.balances}
                toToken={tokenToAdd}
                fromToken={initialSwapToken ? initialSwapToken : null}
                ETH_RATE={ETH_RATE}
                REP_RATE={REP_RATE}
                config={config}
                useSigner={useSigner}
              />
            </>
          )}

          {selectedOption === ADD_FUNDS_CREDIT_CARD && (
            <CreditCard
              accountMeta={accountMeta}
              walletAddress={address}
              addFundsTorus={addFundsTorus}
              addFundsFortmatic={addFundsFortmatic}
              fundTypeLabel={fundTypeLabel}
              fundTypeToUse={tokenToAdd}
              validateAndSet={validateAndSet}
              BUY_MIN={BUY_MIN}
              BUY_MAX={BUY_MAX}
              amountToBuy={amountToBuy}
              isAmountValid={isAmountValid}
            />
          )}
          {selectedOption === ADD_FUNDS_COINBASE && (
            <Coinbase
              fundTypeToUse={tokenToAdd}
              fundTypeLabel={fundTypeLabel}
              walletAddress={address}
            />
          )}
          {selectedOption === ADD_FUNDS_TRANSFER && (
            <Transfer
              fundTypeToUse={tokenToAdd}
              fundTypeLabel={fundTypeLabel}
              walletAddress={address}
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
