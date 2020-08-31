import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import Clipboard from 'clipboard';
import classNames from 'classnames';
import {
  ACCOUNT_TYPES,
  NEW_ORDER_GAS_ESTIMATE,
  ETH,
  DAI,
  REP,
  NULL_ADDRESS,
  MODAL_ADD_FUNDS,
  MODAL_GAS_PRICE,
  MODAL_UNIVERSE_SELECTOR,
  GAS_SPEED_LABELS,
  GAS_TIME_LEFT_LABELS,
  FEE_RESERVES_LABEL,
} from 'modules/common/constants';
import {
  DaiLogoIcon,
  EthIcon,
  helpIcon,
  LogoutIcon,
  Open,
  Pencil,
  v2AugurLogo,
  ClipboardCopy,
  DirectionArrow,
  AddIcon,
} from 'modules/common/icons';
import { EthReserveAutomaticTopOff } from 'modules/common/labels';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { formatDai, formatEther, formatRep } from 'utils/format-number';
import { AFFILIATE_NAME } from 'modules/routes/constants/param-names';
import {
  displayGasInDai,
  ethToDai,
} from 'modules/app/actions/get-ethToDai-rate';
import { logout } from 'modules/auth/actions/logout';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import CommonModalStyles from 'modules/modal/common.styles.less';
import Styles from 'modules/auth/connect-dropdown.styles.less';
import { createBigNumber } from 'utils/create-big-number';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { getEthReserve } from 'modules/auth/helpers/login-account';

const useGasInfo = () => {
  const {
    gasPriceInfo: { userDefinedGasPrice, average, safeLow, fast },
  } = useAppStatusStore();
  let gasPriceSpeed = GAS_SPEED_LABELS.STANDARD;
  let gasPriceTime = GAS_TIME_LEFT_LABELS.STANDARD;
  if (userDefinedGasPrice >= fast && fast !== 0) {
    gasPriceSpeed = GAS_SPEED_LABELS.FAST;
    gasPriceTime = GAS_TIME_LEFT_LABELS.FAST;
  } else if (
    userDefinedGasPrice < average &&
    userDefinedGasPrice >= safeLow &&
    safeLow !== 0
  ) {
    gasPriceSpeed = GAS_SPEED_LABELS.SLOW;
    gasPriceTime = GAS_TIME_LEFT_LABELS.SAFELOW;
  } else if (userDefinedGasPrice < safeLow && safeLow !== 0) {
    gasPriceTime = GAS_TIME_LEFT_LABELS.SLOW;
    gasPriceSpeed = GAS_SPEED_LABELS.SLOW;
  }

  return {
    userDefinedGasPrice,
    gasPriceTime,
    gasPriceSpeed,
  };
};

const ConnectDropdown = () => {
  const [showMetaMaskHelper, setShowMetaMaskHelper] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const {
    loginAccount: { address, meta, balances },
    universe: {
      outcomeName: universeOutcomeName = null,
      forkingInfo,
      parentUniverseId: parentUniId,
    },
    isLogged,
    restoredAccount,
    gsnEnabled,
    ethToDaiRate,
    actions: { setModal },
  } = useAppStatusStore();
  const showTransferMyDai = balances.signerBalances.dai !== "0";
  const showTransferMyRep = balances.signerBalances.rep !== "0";
  const { gasPriceTime, gasPriceSpeed, userDefinedGasPrice } = useGasInfo();
  const parentUniverseId = parentUniId !== NULL_ADDRESS ? parentUniId : null;
  let gasCostTrade;
  const reserveEthAmount = getEthReserve();
  if (gsnEnabled && ethToDaiRate) {
    gasCostTrade = displayGasInDai(
      NEW_ORDER_GAS_ESTIMATE,
      userDefinedGasPrice * 10 ** 9
    );
  }

  let timeoutId = null;
  const referralLink = `${window.location.origin}?${AFFILIATE_NAME}=${address}`;

  const copyClicked = () => {
    setIsCopied(true);
    timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  useEffect(() => {
    new Clipboard('#copy_referral');

    return function() {
      clearTimeout(timeoutId);
    };
  }, []);

  if (!isLogged && !restoredAccount) return null;

  const renderToolTip = (id: string, content: JSX.Element) => (
    <span>
      <label
        className={classNames(TooltipStyles.TooltipHint)}
        data-tip
        data-for={id}
      >
        {helpIcon}
      </label>
      <ReactTooltip
        id={id}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        data-event="mouseover mouseenter"
        data-eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        {content}
      </ReactTooltip>
    </span>
  );

  const ethReserveInDai = ethToDai(
    reserveEthAmount.value,
    createBigNumber(ethToDaiRate?.value || 0)
  ).formattedValue;

  const accountFunds = [
    {
      value: formatDai(balances.dai, {
        zeroStyled: false,
        decimalsRounded: 2,
      }).formatted,
      name: 'DAI',
      logo: DaiLogoIcon,
      disabled: false,
    },
    {
      value: formatEther(balances.eth, {
        zeroStyled: false,
        decimalsRounded: 4,
      }).formatted,
      name: 'ETH',
      logo: EthIcon,
      disabled: gsnEnabled ? balances.eth === "0" : false,
    },
    {
      name: 'REP',
      logo: v2AugurLogo,
      value: formatRep(balances.rep, {
        zeroStyled: false,
        decimalsRounded: 4,
      }).formatted,
      disabled: gsnEnabled ? balances.rep === "0" : false,
    },
  ];

  const feeReserveFunds = (
    <div className={Styles.EthReserves}>
      <div className={Styles.AccountFunds}>
        {FEE_RESERVES_LABEL}
        {renderToolTip(
          'tooltip--ethReserve',
          <div>
            <p>
              Augur runs on a peer-to-peer network, transaction fees are paid in
              ETH. These fees go entirely to the network. Augur doesn’t collect
              any of these fees.
            </p>
            <p>
              If your account balance exceeds $40, 0.04 ETH equivalent in DAI
              will be held in your Fee reserve to cover transaction fees, which
              results in cheaper transaction fees.
            </p>
            <p>
              As long as your available account balance remains over $40 Dai,
              your Fee reserve will automatically be replenished.
            </p>
            <p>
              Your Fee reserve can easily be cashed out at anytime using the
              withdraw button in the transactions section of your account
              summary.
            </p>
          </div>
        )}
        <div>
          <span>{ethReserveInDai} DAI</span>
          <span>{reserveEthAmount.formattedValue} ETH</span>
        </div>
      </div>
      <EthReserveAutomaticTopOff />
    </div>
  );

  const walletProviders = [
    {
      accountType: ACCOUNT_TYPES.FORTMATIC,
      action: () => meta?.openWallet(),
      disabled: !meta?.openWallet,
    },
    {
      accountType: ACCOUNT_TYPES.TORUS,
      action: () => meta?.openWallet(),
      disabled: !meta?.openWallet,
    },
    {
      accountType: ACCOUNT_TYPES.WEB3WALLET,
      action: () => setShowMetaMaskHelper(true),
    },
  ];

  const referralTooltipContent = (
    <span>
      <span>Referral Link</span>
      <div>
        Invite friends to Augur using this link and collect a portion of the
        market fees whenever they trade in markets.
      </div>
    </span>
  );

  return (
    <div onClick={event => event.stopPropagation()}>
      {showMetaMaskHelper && (
        <article onClick={() => setShowMetaMaskHelper(false)} className={CommonModalStyles.ModalMetaMaskFinder}>
          <div>
            <img src="images/metamask-help.png" />
          </div>
          <div>Click the Metamask logo to open your wallet</div>
          <div>{DirectionArrow}</div>
        </article>
      )}
      <div className={Styles.AccountInfo}>
        <div className={Styles.MobileAddFunds}>
          <PrimaryButton
            action={() => setModal({ type: MODAL_ADD_FUNDS })}
            text="Add Funds"
            icon={AddIcon}
          />
        </div>

        <div className={Styles.AddFunds}>
          <div>Your account</div>
          <PrimaryButton
            action={() => setModal({ type: MODAL_ADD_FUNDS })}
            text="Add Funds"
            icon={AddIcon}
          />
        </div>
{/* 
        {showTransferMyDai && <TransferMyTokens condensed={true} tokenName={DAI} />}
        {showTransferMyRep && <TransferMyTokens condensed={true} tokenName={REP} />} */}

        {accountFunds
          .filter(fundType => !fundType.disabled)
          .map((fundType, idx) => (
            <div key={idx} className={Styles.AccountFunds}>
              {fundType.logo} {fundType.name}
              <div>
                  {fundType.value} {fundType.name}
              </div>
            </div>
          ))}
        {reserveEthAmount.value !== 0 && feeReserveFunds}
        {walletProviders
          .filter(wallet => wallet.accountType === meta?.accountType)
          .map((wallet, idx) => {
            return (
              <div
                key={idx}
                className={classNames(Styles.WalletProvider, {
                  [Styles.MetaMask]:
                    wallet?.accountType === ACCOUNT_TYPES.WEB3WALLET,
                })}
              >
                <div>
                  <div>
                    Wallet provider
                    {renderToolTip(
                      'tooltip--walleProvider',
                      <p>
                        Your wallet provider allows you to create a private and
                        secure account for accessing and using Augur.
                      </p>
                    )}
                  </div>
                  <div>
                    {wallet.accountType} {meta.email ? `(${meta.email})` : null}
                  </div>
                </div>
                <SecondaryButton
                  action={() => wallet.action()}
                  text="Open"
                  title="Open"
                  icon={Open}
                  disabled={wallet.disabled}
                  small
                />
              </div>
            );
          })}

        {gasCostTrade && (
          <div className={Styles.GasEdit}>
            <div>
              <div>
                Transaction fee
                {renderToolTip(
                  'tooltip--gasEdit',
                  <p>The fee for processing your transactions.</p>
                )}
              </div>
              <div>
                {gasCostTrade} / Trade ({gasPriceSpeed} {gasPriceTime})
              </div>
            </div>
            <SecondaryButton
              action={() => setModal({ type: MODAL_GAS_PRICE })}
              text="Edit"
              title="Edit"
              icon={Pencil}
              small
            />
          </div>
        )}

        <div className={Styles.GasEdit}>
          <div>
            <div>
              Refer a friend
              {renderToolTip('tooltip--referral', referralTooltipContent)}
            </div>
            <div>{referralLink}</div>
          </div>
          <SecondaryButton
            small
            id="copy_referral"
            data-clipboard-text={referralLink}
            action={() => copyClicked()}
            text='Copy'
            icon={ClipboardCopy}
            className={isCopied ? Styles.ShowConfirmaiton : null}
          />
        </div>

        {(parentUniverseId !== null || !!forkingInfo) && (
          <div className={Styles.WalletProvider}>
            <div>
              <div>Universe</div>
              <div>{universeOutcomeName}</div>
            </div>
            <SecondaryButton
              action={() => setModal({ type: MODAL_UNIVERSE_SELECTOR })}
              text="CHANGE UNIVERSE"
              title="Change Universe"
            />
          </div>
        )}

        <button className={Styles.Logout} onClick={() => logout()}>
          Logout {LogoutIcon}
        </button>
      </div>
    </div>
  );
};

export default ConnectDropdown;
