import React, { useState } from 'react';
import {
  CloseButton,
  BackButton,
} from 'modules/common/buttons';
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
import { LoginAccount } from 'modules/types';
import Styles from 'modules/modal/modal.styles.less';
import { Swap } from 'modules/swap/components/swap';
import { Pool } from 'modules/swap/components/pool';
import { PillSelection } from 'modules/common/selection';
import { BigNumber, createBigNumber } from 'utils/create-big-number';

interface AddFundsProps {
  closeAction: Function;
  autoSelect?: boolean;
  isRelayDown?: boolean;
  fundType: string;
  loginAccount: LoginAccount;
  ETH_RATE: BigNumber;
  REP_RATE: BigNumber;
  addFundsTorus: Function;
  addFundsFortmatic: Function;
}

export const AddFunds = ({
  closeAction,
  autoSelect = false,
  fundType = DAI,
  loginAccount,
  ETH_RATE,
  REP_RATE,
  isRelayDown = false,
  addFundsTorus,
  addFundsFortmatic,
}: AddFundsProps) => {
  const address = loginAccount.address
  const accountMeta = loginAccount.meta;
  let BUY_MIN = 0;
  let BUY_MAX = 0;


  const usingOnRampSupportedWallet = accountMeta.accountType === ACCOUNT_TYPES.TORUS
    || accountMeta.accountType === ACCOUNT_TYPES.PORTIS
    || accountMeta.accountType === ACCOUNT_TYPES.FORTMATIC;


  if (accountMeta.accountType === ACCOUNT_TYPES.TORUS) {
    BUY_MIN = 20;
    BUY_MAX = 250
  } else if (accountMeta.accountType === ACCOUNT_TYPES.FORTMATIC) {
    BUY_MIN = 50;
    BUY_MAX = 250
  }

  const [amountToBuy, setAmountToBuy] = useState(createBigNumber(0));
  const [isAmountValid, setIsAmountValid] = useState(false);

  const validateAndSet = (amount) => {
    const amountToBuy = createBigNumber(amount);
    if (amountToBuy.gte(BUY_MIN) && amountToBuy.lte(BUY_MAX)) {
      setIsAmountValid(true);
    } else {
      setIsAmountValid(false);
    }
    setAmountToBuy(amountToBuy);
  }
  const [poolSelected, setPoolSelected] = useState(false);

  const toggleSwapPool = (selection) => {
    if (selection === 0) {
      setSwapSelected(true);
      setPoolSelected(false);
    } else if (selection === 1) {
      setSwapSelected(false);
      setPoolSelected(true);
    }
  }

  const accountLabel = isRelayDown && fundType === DAI ? `[${accountMeta.accountType}]` : 'Augur';
  const fundTypeToUse = isRelayDown && fundType === DAI ? ETH : fundType;
  const fundTypeLabel = fundTypeToUse === ETH ? 'ETH' : fundTypeToUse === DAI ? 'Dai ($)' : 'REP';


  let autoSelectValue = ADD_FUNDS_COINBASE;  // Coinbase default selected
  if (fundTypeToUse === REP) {
    // IF Add Funds REP flow, show swap as default selected
    autoSelectValue = ADD_FUNDS_SWAP
  } else if (usingOnRampSupportedWallet && fundTypeToUse === DAI) {
    // IF Add Funds DAI flow and using a onramp supported wallet show CreditCard as default selected
    autoSelectValue = ADD_FUNDS_CREDIT_CARD
  }

  const [selectedOption, setSelectedOption] = useState(autoSelect ? autoSelectValue : null);
  const [swapSelected, setSwapSelected] = useState(true);


  // When Adding ETH through Add Funds we use the signer address since we need that account to have ETH to cover gas during outages
  const walletAddress = isRelayDown && fundType === DAI && accountMeta.signer ?  accountMeta.signer._address : address;

  const FUND_OTPIONS = [
    {
      header: 'Credit/debit card',
      description: `Add ${fundTypeToUse === ETH ? 'ETH' : 'Funds'} instantly using a credit/debit card`,
      value: ADD_FUNDS_CREDIT_CARD,
    },
    {
      header: 'Coinbase',
      description: `Send ${fundTypeToUse === ETH ? 'ETH' : 'Funds'} from a Coinbase account`,
      value: ADD_FUNDS_COINBASE,
    },
    {
      header: 'Transfer',
      description: `Send ${fundTypeToUse === ETH ? 'ETH' : 'Funds'} to your ${accountLabel} account address`,
      value: ADD_FUNDS_TRANSFER,
    },
    {
      header: 'Convert',
      description: fundTypeToUse === DAI ? 'Trade ETH or REP for DAI and vice versa' : 'Trade ETH or DAI for REP and vice versa',
      value: ADD_FUNDS_SWAP,
    },
  ];


  let addFundsOptions = [...FUND_OTPIONS];

  // Only show CreditCard option for onRamp wallets using the Add DAI flow
  if (fundTypeToUse !== DAI || !usingOnRampSupportedWallet) {
    addFundsOptions = addFundsOptions.slice(1, addFundsOptions.length);
  }

  // If Add REP flow show SWAP at the top
  if (fundTypeToUse === REP) {
    addFundsOptions = addFundsOptions.filter(option => option.value !== ADD_FUNDS_SWAP);
    addFundsOptions.unshift(FUND_OTPIONS.find(option => option.value === ADD_FUNDS_SWAP));
  }

  const SWAP_ID = 0;
  const POOL_ID = 1;
  const pillOptions = [
    { label: 'Convert', id: SWAP_ID },
    { label: 'Pool', subLabel: '(Advanced)', id: POOL_ID },
  ];

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
          <h1>{fundTypeToUse === REP ? 'Get REP' : 'Add Funds'}</h1>
          <h2>Choose a method</h2>
          <RadioTwoLineBarGroup
            radioButtons={addFundsOptions}
            defaultSelected={selectedOption}
            hideRadioButton
            onChange={value => {
              setSelectedOption(() => value && value.toString());
            }}
          />
          {fundTypeToUse !== ETH && <FundsHelp fundType={fundTypeToUse} />}
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
            [Styles.AddFundsCreditDebit]: selectedOption === ADD_FUNDS_CREDIT_CARD,
            [Styles.AddFundsCoinbase]: selectedOption === ADD_FUNDS_COINBASE,
          })}
        >
          {selectedOption === ADD_FUNDS_SWAP && (
            <>
              <h1>Convert</h1>
              <h2>{fundTypeToUse === REP ? 'Trade a currency for REP or add to the REP pool' : 'Trade ETH or REP for DAI and vice versa'}</h2>

              <div className={Styles.AddFundsSwap}>
                <PillSelection
                  options={pillOptions}
                  onChange={selection => toggleSwapPool(selection)}
                  defaultSelection={SWAP_ID}
                />
              </div>

              {poolSelected && (
                <Pool
                  balances={loginAccount.balances}
                  ETH_RATE={ETH_RATE}
                  REP_RATE={REP_RATE}
                />
              )}

              {swapSelected && (
                <Swap
                  balances={loginAccount.balances}
                  toToken={fundTypeToUse === REP ? REP : DAI}
                  fromToken={fundTypeToUse === REP ? DAI : REP}
                  ETH_RATE={ETH_RATE}
                  REP_RATE={REP_RATE}
                />
              )}
            </>
          )}

          {selectedOption === ADD_FUNDS_CREDIT_CARD && (
            <CreditCard
              accountMeta={accountMeta}
              walletAddress={walletAddress}
              addFundsTorus={addFundsTorus}
              addFundsFortmatic={addFundsFortmatic}
              fundTypeLabel={fundTypeLabel}
              fundTypeToUse={fundTypeToUse}
              validateAndSet={validateAndSet}
              BUY_MIN={BUY_MIN}
              BUY_MAX={BUY_MAX}
              amountToBuy={amountToBuy}
              isAmountValid={isAmountValid}
            />
          )}
          {selectedOption === ADD_FUNDS_COINBASE && (
            <Coinbase
              fundTypeToUse={fundTypeToUse}
              fundTypeLabel={fundTypeLabel}
              walletAddress={walletAddress}
              accountLabel={accountLabel}
            />
          )}
          {selectedOption === ADD_FUNDS_TRANSFER && (
            <Transfer
              fundTypeToUse={fundTypeToUse}
              fundTypeLabel={fundTypeLabel}
              walletAddress={walletAddress}
              accountLabel={accountLabel}
            />
          )}
        </div>
        {fundTypeToUse !== ETH && selectedOption !== ADD_FUNDS_SWAP && <FundsHelp fundType={fundTypeToUse} />}
        <div>
          <button onClick={() => closeAction()}>Done</button>
        </div>
      </div>
    </div>
  );
};
