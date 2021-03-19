import React, { useEffect, useMemo, useState } from 'react';

import Styles from './modal.styles.less';
import { Header } from './common';
import { useHistory } from 'react-router';
import { InfoNumbers } from '../market/trading-form';
import classNames from 'classnames';
import { AmmOutcome, Cash, LiquidityBreakdown, MarketInfo } from '../types';
import { BigNumber as BN } from 'bignumber.js';
import {
  ContractCalls,
  createBigNumber,
  PARA_CONFIG,
  useAppStatusStore,
  useGraphDataStore,
  useUserStore,
  ApprovalHooks,
  Formatter,
  Constants,
  Components,
} from '@augurproject/augur-comps';
const { checkAllowance } = ApprovalHooks;
const {
  checkConvertLiquidityProperties,
  doAmmLiquidity,
  doRemoveAmmLiquidity,
  estimateAddLiquidity,
  getRemoveLiquidity,
} = ContractCalls;
const {
  convertDisplayShareAmountToOnChainShareAmount,
  formatPercent,
  convertOnChainSharesToDisplayShareAmount,
  formatSimpleShares,
  formatCash,
} = Formatter;
const {
  Icons: { BackIcon },
  ButtonComps: { ApprovalButton, APPROVED, BuySellButton },
  SelectionComps: { MultiButtonSelection },
  InputComps: {
    AmountInput,
    isInvalidNumber,
    OutcomesGrid,
    TextInput,
  },
  LabelComps: {
    generateTooltip
  }
} = Components;
const {
  YES_NO,
  BUY,
  USDC,
  SHARES,
  MARKETS,
  ApprovalAction,
  ENTER_AMOUNT,
  YES_OUTCOME_ID,
  NO_OUTCOME_ID,
  CREATE,
  ADD,
  REMOVE,
  CONNECT_ACCOUNT,
  SET_PRICES,
  TX_STATUS,
  INSUFFICIENT_BALANCE,
  ONE,
  ERROR_AMOUNT,
  ETH,
  PORTION_OF_CASH_INVALID_POOL,
} = Constants;

const TRADING_FEE_OPTIONS = [
  {
    id: 0,
    label: '0.0%',
    value: 0,
  },
  {
    id: 1,
    label: '0.5%',
    value: 0.5,
  },
  {
    id: 2,
    label: '1%',
    value: 1,
  },
  {
    id: 3,
    label: '2%',
    value: 2,
  },
];

const defaultAddLiquidityBreakdown: LiquidityBreakdown = {
  yesShares: '0',
  noShares: '0',
  lpTokens: '0',
  cashAmount: '0',
};

interface ModalAddLiquidityProps {
  market: MarketInfo;
  liquidityModalType: string;
  currency?: string;
}

const ModalAddLiquidity = ({
  market,
  liquidityModalType,
  currency,
}: ModalAddLiquidityProps) => {
  const {
    isLogged,
    actions: { closeModal },
  } = useAppStatusStore();
  const {
    account,
    balances,
    transactions,
    loginAccount,
    actions: { addTransaction },
  } = useUserStore();
  const { cashes } = useGraphDataStore();
  const history = useHistory();

  let amm = market?.amm;
  const mustSetPrices =
    liquidityModalType === CREATE ||
    !amm ||
    amm?.liquidity === undefined ||
    amm?.liquidity === '0';
  const modalType = liquidityModalType;

  const [outcomes, setOutcomes] = useState<AmmOutcome[]>(
    !mustSetPrices && modalType !== CREATE
      ? amm.ammOutcomes
      : [
        {
          id: 0,
          name: 'Invalid',
          price: '',
          isInvalid: true,
        },
        {
          id: 1,
          name: 'No',
          price: '',
        },
        {
          id: 2,
          name: 'Yes',
          price: '',
        },
      ]
  );
  const [showBackView, setShowBackView] = useState(false);
  const [chosenCash, updateCash] = useState<string>(currency ? currency : USDC);
  const [breakdown, setBreakdown] = useState(defaultAddLiquidityBreakdown);
  const [estimatedLpAmount, setEstimatedLpAmount] = useState<string>('0');
  const [tradingFeeSelection, setTradingFeeSelection] = useState<number>(
    TRADING_FEE_OPTIONS[2].id
  );
  const [canAddLiquidity, setCanAddLiquidity] = useState(false);
  const [canRemoveLiquidity, setCanRemoveLiquidity] = useState(false);

  const cash: Cash = useMemo(() => {
    return cashes && chosenCash
      ? Object.values(cashes).find((c) => c.name === chosenCash)
      : Object.values(cashes)[0];
  }, [chosenCash]);

  const isETH = cash?.name === ETH;
  const {
    addresses: { AMMFactory },
  } = PARA_CONFIG;
  const isApproved =
    modalType === REMOVE ? canRemoveLiquidity : canAddLiquidity;

  useEffect(() => {
    const checkCanCashAdd = async () => {
      const approvalCheck = await checkAllowance(
        cash?.address,
        AMMFactory,
        loginAccount,
        transactions,
      );
      setCanAddLiquidity(approvalCheck === APPROVED);
    };

    const checkCanRemoveAmm = async () => {
      const approvalCheckOne = await checkAllowance(
        amm?.invalidPool?.id,
        AMMFactory,
        loginAccount,
        transactions,
      );
      const approvalCheckTWo = await checkAllowance(
        amm?.id,
        AMMFactory,
        loginAccount,
        transactions,
      );
      setCanRemoveLiquidity(approvalCheckOne === APPROVED && approvalCheckTWo === APPROVED);
    };

    if (isLogged && !canAddLiquidity) {
      if (isETH) {
        setCanAddLiquidity(true);
      } else {
        checkCanCashAdd();
      }
    }
    if (isLogged && !canRemoveLiquidity && modalType === REMOVE) {
      checkCanRemoveAmm();
    }
  }, [
    isLogged,
    canAddLiquidity,
    canRemoveLiquidity,
    setCanAddLiquidity,
    setCanRemoveLiquidity,
    transactions,
    modalType,
  ]);

  const userTokenBalance = cash?.name ? balances[cash?.name]?.balance : '0';
  const shareBalance =
    balances &&
    balances.lpTokens &&
    balances.lpTokens[amm?.id] &&
    balances.lpTokens[amm?.id]?.balance;
  const userMaxAmount = modalType === REMOVE ? shareBalance : userTokenBalance;

  const [amount, updateAmount] = useState(
    modalType === REMOVE ? userMaxAmount : ''
  );

  const [customName, setCustomName] = useState('');
  const customNameCapitlized =
    customName.charAt(0).toUpperCase() + customName.slice(1);

  const feePercentFormatted = useMemo(() => {
    const feeOption = TRADING_FEE_OPTIONS.find(
      (t) => t.id === tradingFeeSelection
    );
    const feePercent =
      modalType === CREATE ? feeOption.value : amm?.feeInPercent;
    return formatPercent(feePercent).full;
  }, [tradingFeeSelection, amm?.feeInPercent]);

  const onChainFee = useMemo(() => {
    const feeOption = TRADING_FEE_OPTIONS.find(
      (t) => t.id === tradingFeeSelection
    );
    const feePercent =
      modalType === CREATE ? feeOption.value : amm?.feeInPercent;

    return String(new BN(feePercent).times(new BN(10)));
  }, [tradingFeeSelection, amm?.feeRaw]);

  const userPercentOfPool = useMemo(() => {
    let userPercent = '100';
    const rawSupply = amm?.totalSupply;
    if (rawSupply) {
      if (modalType === ADD) {
        const displaySupply = convertOnChainSharesToDisplayShareAmount(
          rawSupply,
          cash?.decimals
        );
        userPercent = String(
          new BN(estimatedLpAmount)
            .plus(new BN(shareBalance || '0'))
            .div(new BN(displaySupply).plus(new BN(estimatedLpAmount)))
            .times(new BN(100))
        );
      } else if (modalType === REMOVE) {
        const userBalanceLpTokens =
          balances && balances.lpTokens && balances.lpTokens[amm?.id];
        const userAmount = userBalanceLpTokens?.rawBalance || '0';
        const estUserAmount = convertDisplayShareAmountToOnChainShareAmount(
          amount,
          cash?.decimals
        );
        userPercent = String(
          new BN(userAmount || '0')
            .minus(new BN(estUserAmount))
            .div(new BN(rawSupply).minus(new BN(estUserAmount)))
        );
      }
    }

    return formatPercent(userPercent).full;
  }, [
    amm?.totalSupply,
    amount,
    balances,
    shareBalance,
    estimatedLpAmount,
    amm?.id,
    cash?.decimals,
  ]);

  let buttonError = '';
  const priceErrors = outcomes.filter((outcome) => {
    return (
      parseFloat(outcome.price) >= 1 ||
      (!outcome.isInvalid && isInvalidNumber(outcome.price))
    );
  });
  const hasPriceErrors = priceErrors.length > 0;
  const hasAmountErrors = isInvalidNumber(amount);
  if (hasAmountErrors) {
    buttonError = ERROR_AMOUNT;
  } else if (hasPriceErrors) {
    buttonError = 'Price is not valid';
  }

  useEffect(() => {
    const priceErrorsWithEmptyString = outcomes.filter(
      (outcome) =>
        !outcome.isInvalid &&
        (parseFloat(outcome.price) >= 1 ||
          isInvalidNumber(outcome.price) ||
          outcome.price === '')
    );
    if (priceErrorsWithEmptyString.length > 0 || hasAmountErrors) {
      return setBreakdown(defaultAddLiquidityBreakdown);
    }

    const properties = checkConvertLiquidityProperties(
      account,
      market.marketId,
      amount,
      onChainFee,
      outcomes,
      cash,
      amm,
      customName
    );
    if (!properties) {
      return setBreakdown(defaultAddLiquidityBreakdown);
    }
    async function getResults() {
      let results = defaultAddLiquidityBreakdown;
      if (modalType === REMOVE) {
        results = await getRemoveLiquidity(
          properties.marketId,
          cash,
          onChainFee,
          amount
        );
      } else {
        results = await estimateAddLiquidity(
          properties.account,
          properties.amm,
          properties.marketId,
          properties.cash,
          properties.fee,
          properties.amount,
          properties.priceNo,
          properties.priceYes
        );
      }

      if (!results) {
        return setBreakdown(defaultAddLiquidityBreakdown);
      }
      setBreakdown(results);
      setEstimatedLpAmount(results.lpTokens);
    }

    getResults();
  }, [
    account,
    amount,
    tradingFeeSelection,
    cash,
    outcomes[YES_OUTCOME_ID]?.price,
    outcomes[NO_OUTCOME_ID]?.price,
  ]);

  let inputFormError = '';
  if (!account) inputFormError = CONNECT_ACCOUNT;
  else if (!amount || amount === '0' || amount === '')
    inputFormError = ENTER_AMOUNT;
  else if (new BN(amount).gt(new BN(userMaxAmount)))
    inputFormError = INSUFFICIENT_BALANCE;
  else if (modalType === CREATE) {
    const yesPrice = outcomes[YES_OUTCOME_ID].price;
    const noPrice = outcomes[NO_OUTCOME_ID].price;
    if (
      yesPrice === '0' ||
      !yesPrice ||
      noPrice === '0' ||
      !noPrice ||
      noPrice === '0.00' ||
      yesPrice === '0.00'
    ) {
      inputFormError = SET_PRICES;
    }
  }

  const addCreateBreakdown = [
    {
      label: 'yes shares',
      value: `${formatSimpleShares(breakdown.yesShares).formatted}`,
    },
    {
      label: 'no shares',
      value: `${formatSimpleShares(breakdown.noShares).formatted}`,
    },
    {
      label: 'LP tokens',
      value: `${formatSimpleShares(breakdown.lpTokens).formatted}`,
    },
  ];

  const invalidCashAmount = formatCash(
    createBigNumber(amount === '' ? '0' : amount).times(
      PORTION_OF_CASH_INVALID_POOL
    ),
    cash?.name
  ).full;

  const confirmAction = async () => {
    const properties = checkConvertLiquidityProperties(
      account,
      market.marketId,
      amount,
      onChainFee,
      outcomes,
      cash,
      amm,
      customName
    );
    if (!properties) {
      setBreakdown(defaultAddLiquidityBreakdown);
    }
    if (modalType === REMOVE) {
      doRemoveAmmLiquidity(properties)
        .then((response) => {
          const { hash } = response;
          addTransaction({
            hash,
            chainId: loginAccount.chainId,
            seen: false,
            status: TX_STATUS.PENDING,
            from: account,
            addedTime: new Date().getTime(),
            message: `Remove Liquidity`,
            marketDescription: market.description,
          });
        })
        .catch((e) => {
          //TODO: handle errors here
        });
    } else {
      await doAmmLiquidity(
        properties.account,
        modalType === CREATE ? undefined : properties.amm,
        properties.marketId,
        properties.cash,
        properties.fee,
        properties.amount,
        modalType === ADD
          ? amm !== null && amm?.id !== undefined && amm?.liquidity !== '0'
          : false,
        properties.priceNo,
        properties.priceYes,
        properties.symbolRoot
      )
        .then((response) => {
          const { hash } = response;
          addTransaction({
            hash,
            chainId: loginAccount.chainId,
            from: account,
            seen: false,
            status: TX_STATUS.PENDING,
            addedTime: new Date().getTime(),
            message: `Add Liquidity`,
            marketDescription: market.description,
          });
        })
        .catch((e) => {
          // TODO: handle error
        });
    }
    closeModal();
    if (modalType === CREATE && history.location.pathname !== `/${MARKETS}`) {
      history.push(`/${MARKETS}`);
    }
  };

  const LIQUIDITY_STRINGS = {
    [REMOVE]: {
      header: 'remove all liquidity',
      showTradingFee: false,
      cantEditAmount: true,
      hideCurrentOdds: true,
      receiveTitle: 'What you will recieve',
      approvalButtonText: 'approve shares spend',
      actionButtonText: 'Remove all liquidity',
      confirmButtonText: 'confirm remove',
      currencyName: SHARES,
      footerText: `Removing liquidity returns shares; these shares may be sold for ${chosenCash}.`,
      breakdown: [
        {
          label: 'yes shares',
          value: `${formatSimpleShares(breakdown.yesShares).formatted}`,
        },
        {
          label: 'no shares',
          value: `${formatSimpleShares(breakdown.noShares).formatted}`,
        },
      ],
      liquidityDetails: {
        title: 'Market Liquidity Details',
        breakdown: [
          {
            label: 'Trading fee',
            value: `${feePercentFormatted}`,
          },
          {
            label: 'your share of the liquidity pool',
            value: `${userPercentOfPool}`,
          },
        ],
      },
      confirmOverview: {
        title: 'What you are Removing',
        breakdown: [
          {
            label: 'LP tokens',
            value: `${amount}`,
          },
        ],
      },
      confirmReceiveOverview: {
        title: 'What you will recieve',
        breakdown: [
          {
            label: 'yes shares',
            value: `${formatSimpleShares(breakdown.yesShares).formatted}`,
          },
          {
            label: 'no shares',
            value: `${formatSimpleShares(breakdown.noShares).formatted}`,
          },
        ],
      },
    },
    [ADD]: {
      header: 'add liquidity',
      showTradingFee: true,
      setOdds: true,
      setOddsTitle: mustSetPrices
        ? 'Set the price (between 0.0 to 1.0)'
        : 'Current Prices',
      receiveTitle: "You'll receive",
      actionButtonText: 'Add',
      confirmButtonText: 'confirm add',
      footerText: `By adding liquidity you'll earn ${feePercentFormatted} of all trades on this market proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity. ${invalidCashAmount} will be added to the invalid balancer pool.`,
      breakdown: addCreateBreakdown,
      approvalButtonText: `approve ${chosenCash}`,
      confirmOverview: {
        title: 'What you are depositing',
        breakdown: [
          {
            label: 'amount',
            value: `${amount} ${amm?.cash?.name}`,
          },
        ],
      },
      confirmReceiveOverview: {
        title: 'What you will receive',
        breakdown: addCreateBreakdown,
      },
      marketLiquidityDetails: {
        title: 'Market liquidity details',
        breakdown: [
          {
            label: 'trading fee',
            value: `${feePercentFormatted}`,
          },
          {
            label: 'your share of the pool',
            value: `${userPercentOfPool}`,
          },
        ],
      },
      currencyName: `${chosenCash}`,
    },
    [CREATE]: {
      header: 'add liquidity',
      showTradingFee: false,
      setOdds: true,
      setOddsTitle: 'Set the price (between 0.0 to 1.0)',
      editableOutcomes: true,
      setFees: true,
      receiveTitle: "You'll receive",
      actionButtonText: 'Add',
      confirmButtonText: 'confirm market liquidity',
      currencyName: `${chosenCash}`,
      customToken: {
        title: 'Give your outcome tokens a custom name',
        confirmationTitle: 'Token names',
        breakdown: [
          {
            label: 'Yes',
            value: `y${customNameCapitlized}`,
          },
          {
            label: 'No',
            value: `n${customNameCapitlized}`,
          },
          {
            label: 'Invalid',
            value: `i${customNameCapitlized}`,
          },
        ],
      },
      footerText: `By adding initial liquidity you'll earn your set trading fee percentage of all trades on this market proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity. ${invalidCashAmount} will be added to the invalid balancer pool.`,
      breakdown: addCreateBreakdown,
      approvalButtonText: `approve ${chosenCash}`,
      confirmOverview: {
        title: 'What you are depositing',
        breakdown: [
          {
            label: 'amount',
            value: `${amount} ${cash?.name}`,
          },
        ],
      },
      confirmReceiveOverview: {
        title: 'What you will receive',

        breakdown: addCreateBreakdown,
      },
      marketLiquidityDetails: {
        title: 'Market liquidity details',

        breakdown: [
          {
            label: 'trading fee',
            value: `${feePercentFormatted}`,
          },
          {
            label: 'your share of the pool',
            value: `${userPercentOfPool}`,
          },
        ],
      },
    },
  };

  const setPrices = (price, index) => {
    const newOutcomes = outcomes;
    newOutcomes[index].price = price;
    if (
      price !== '' &&
      !isNaN(price) &&
      price !== '0' &&
      parseFloat(price) < 1
    ) {
      let newValue = ONE.minus(createBigNumber(price)).toString();
      if (newOutcomes[index].id === YES_OUTCOME_ID) {
        newOutcomes[NO_OUTCOME_ID].price = newValue;
      } else {
        newOutcomes[YES_OUTCOME_ID].price = newValue;
      }
    }
    setOutcomes([...newOutcomes]);
  };
  return (
    <section
      className={classNames(Styles.ModalAddLiquidity, {
        [Styles.showBackView]: showBackView,
        [Styles.Remove]: modalType === REMOVE,
      })}
    >
      {!showBackView ? (
        <>
          <Header
            title={LIQUIDITY_STRINGS[modalType].header}
            subtitle={{
              label: 'trading fee',
              value: LIQUIDITY_STRINGS[modalType].showTradingFee
                ? feePercentFormatted
                : null,
            }}
          />
          <main>
            {!LIQUIDITY_STRINGS[modalType].cantEditAmount && (
              <>
                {LIQUIDITY_STRINGS[modalType].amountSubtitle && (
                  <span className={Styles.SmallLabel}>
                    {LIQUIDITY_STRINGS[modalType].amountSubtitle}
                  </span>
                )}
                <AmountInput
                  ammCash={cash}
                  updateInitialAmount={(amount) => updateAmount(amount)}
                  initialAmount={amount}
                  maxValue={userMaxAmount}
                  showCurrencyDropdown={!currency}
                  chosenCash={modalType === REMOVE ? SHARES : chosenCash}
                  updateCash={updateCash}
                  updateAmountError={() => null}
                  error={hasAmountErrors}
                />
              </>
            )}
            {LIQUIDITY_STRINGS[modalType].setFees && (
              <>
                <span className={Styles.SmallLabel}>
                  Set trading fee
                  {generateTooltip(
                  'Fees earned for providing liquidity.',
                  'tradingFeeInfo'
                )}
                </span>
                <MultiButtonSelection
                  options={TRADING_FEE_OPTIONS}
                  selection={tradingFeeSelection}
                  setSelection={(id) => setTradingFeeSelection(id)}
                />
              </>
            )}
            {!LIQUIDITY_STRINGS[modalType].hideCurrentOdds && (
              <>
                <span className={Styles.SmallLabel}>
                  {LIQUIDITY_STRINGS[modalType].setOddsTitle}
                </span>
                <OutcomesGrid
                  outcomes={outcomes}
                  selectedOutcome={null}
                  setSelectedOutcome={() => null}
                  marketType={YES_NO}
                  orderType={BUY}
                  nonSelectable
                  editable={mustSetPrices}
                  setEditableValue={(price, index) => setPrices(price, index)}
                  ammCash={cash}
                  error={hasPriceErrors}
                />
              </>
            )}
            {LIQUIDITY_STRINGS[modalType].customToken && (
              <div className={Styles.LineBreak}>
                <span className={Styles.SmallLabel}>
                  {LIQUIDITY_STRINGS[modalType].customToken.title}
                  {generateTooltip(
                    'Name your AMM outcome share tokens, so they can be distinguished on other trading platforms.',
                    'customTokenTitle'
                  )}
                </span>
                <TextInput
                  placeholder="Enter a custom name"
                  value={customName}
                  onChange={(value) => setCustomName(value)}
                />
                <InfoNumbers
                  infoNumbers={
                    LIQUIDITY_STRINGS[modalType].customToken.breakdown
                  }
                />
              </div>
            )}
            {LIQUIDITY_STRINGS[modalType].liquidityDetails && (
              <div className={Styles.LineBreak}>
                <span className={Styles.SmallLabel}>
                  {LIQUIDITY_STRINGS[modalType].liquidityDetails.title}
                </span>
                <InfoNumbers
                  infoNumbers={
                    LIQUIDITY_STRINGS[modalType].liquidityDetails.breakdown
                  }
                />
              </div>
            )}
            <span className={Styles.SmallLabel}>
              {LIQUIDITY_STRINGS[modalType].receiveTitle}
            </span>
            <InfoNumbers
              unedited={
                JSON.stringify(breakdown) ===
                JSON.stringify(defaultAddLiquidityBreakdown)
              }
              infoNumbers={LIQUIDITY_STRINGS[modalType].breakdown}
            />
            {!isApproved && (
              <>
                <ApprovalButton
                  amm={amm}
                  cash={cash}
                  actionType={
                    modalType !== REMOVE
                      ? ApprovalAction.ADD_LIQUIDITY
                      : ApprovalAction.REMOVE_LIQUIDITY
                  }
                />
                {modalType === REMOVE &&
                  <ApprovalButton
                    amm={amm}
                    cash={cash}
                    actionType={ApprovalAction.TRANSFER_LIQUIDITY}
                  />
                }
              </>
            )}

            <BuySellButton
              action={() => setShowBackView(true)}
              disabled={!isApproved || inputFormError !== ''}
              error={buttonError}
              text={
                inputFormError === ''
                  ? buttonError
                    ? buttonError
                    : LIQUIDITY_STRINGS[modalType].actionButtonText
                  : inputFormError
              }
            />
            <div className={Styles.FooterText}>
              {LIQUIDITY_STRINGS[modalType].footerText}
            </div>
          </main>
        </>
      ) : (
          <>
            <div className={Styles.Header} onClick={() => setShowBackView(false)}>
              {BackIcon}
            Back
          </div>
            <main>
              <div className={Styles.MarketTitle}>
                <span>Market</span>
                <span>{market.description}</span>
              </div>
              <section>
                <span className={Styles.SmallLabel}>
                  {LIQUIDITY_STRINGS[modalType].confirmOverview.title}
                </span>
                <InfoNumbers
                  infoNumbers={
                    LIQUIDITY_STRINGS[modalType].confirmOverview.breakdown
                  }
                />
              </section>

              <section>
                <span className={Styles.SmallLabel}>
                  {LIQUIDITY_STRINGS[modalType].confirmReceiveOverview.title}
                </span>
                <InfoNumbers
                  infoNumbers={
                    LIQUIDITY_STRINGS[modalType].confirmReceiveOverview.breakdown
                  }
                />
              </section>
              {LIQUIDITY_STRINGS[modalType].marketLiquidityDetails && (
                <section>
                  <span className={Styles.SmallLabel}>
                    {LIQUIDITY_STRINGS[modalType].marketLiquidityDetails.title}
                  </span>
                  <InfoNumbers
                    infoNumbers={
                      LIQUIDITY_STRINGS[modalType].marketLiquidityDetails
                        .breakdown
                    }
                  />
                </section>
              )}
              {LIQUIDITY_STRINGS[modalType].customToken && (
                <section>
                  <span className={Styles.SmallLabel}>
                    {LIQUIDITY_STRINGS[modalType].customToken.confirmationTitle}
                  </span>
                  <InfoNumbers
                    infoNumbers={
                      LIQUIDITY_STRINGS[modalType].customToken.breakdown
                    }
                  />
                </section>
              )}
              <BuySellButton
                text={LIQUIDITY_STRINGS[modalType].confirmButtonText}
                action={confirmAction}
              />
              {LIQUIDITY_STRINGS[modalType].footerText && (
                <div className={Styles.FooterText}>
                  {LIQUIDITY_STRINGS[modalType].footerText}
                </div>
              )}
            </main>
          </>
        )}
    </section>
  );
};

export default ModalAddLiquidity;
