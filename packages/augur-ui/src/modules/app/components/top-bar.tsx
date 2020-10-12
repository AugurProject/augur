import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Alerts, BetsIconCount } from 'modules/common/icons';
import ConnectAccount from 'modules/auth/connect-account';
import {
  MovementLabel,
  LinearPropertyLabel,
  LinearPropertyLabelUnderlineTooltip,
} from 'modules/common/labels';
import ButtonStyles from 'modules/common/buttons.styles.less';
import { Link } from 'react-router-dom';
import makePath from 'modules/routes/helpers/make-path';
import { NewLogo } from 'modules/app/components/logo';
import { ThemeSwitch } from 'modules/app/components/theme-switch';
import {
  PrimaryButton,
  SecondaryButton,
  ProcessingButton,
} from 'modules/common/buttons';
import { MARKETS } from 'modules/routes/constants/views';
import { HelpResources } from 'modules/app/components/help-resources';
import { OddsMenu } from 'modules/app/components/odds-menu';
import {
  MODAL_MIGRATE_REP,
  TRANSACTIONS,
  MODAL_LOGIN,
  MODAL_SIGNUP,
  MIGRATE_FROM_LEG_REP_TOKEN,
  THEMES,
  MODAL_AUGUR_USES_DAI,
  MODAL_ETH_DEPOSIT,
  MODAL_TOKEN_SELECT,
  MODAL_APPROVALS,
  MODAL_TEST_BET
} from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { getInfoAlertsAndSeenCount } from 'modules/alerts/helpers/alerts';
import AlertsContainer from 'modules/alerts/components/alerts-view';
import { useBetslipStore } from 'modules/trading/store/betslip';
import { BETSLIP_SELECTED } from 'modules/trading/store/constants';
import Styles from 'modules/app/components/top-bar.styles.less';
import { getCoreStats } from 'modules/auth/helpers/login-account';
import { TOTAL_ONBOARDING_STEPS } from 'modules/modal/onboarding';
import { approveFillOrderCheck, approveShareTokenCheck, approveZeroXCheck } from 'modules/contracts/actions/contractCalls';


const handleShowOnboarding = (currentOnboardingStep, setModal) => {
  let nextStep = MODAL_AUGUR_USES_DAI;
  if (currentOnboardingStep === 1) {
    nextStep = MODAL_AUGUR_USES_DAI;
  } else if (currentOnboardingStep === 2) {
    nextStep = MODAL_ETH_DEPOSIT;
  } else if (currentOnboardingStep === 3) {
    nextStep = MODAL_TOKEN_SELECT;
  } else if (currentOnboardingStep === 4) {
    nextStep = MODAL_TOKEN_SELECT;
  } else if (currentOnboardingStep === 5) {
    nextStep = MODAL_TOKEN_SELECT;
  } else if (currentOnboardingStep === 6) {
    nextStep = MODAL_APPROVALS;
  } else if (currentOnboardingStep === 7) {
    nextStep = MODAL_TEST_BET;
  }
  setModal({ type: nextStep });
};

export const Stats = () => {
  const {
    isLogged,
    restoredAccount,
    isMobile,
    loginAccount,
  } = useAppStatusStore();
  const stats = getCoreStats(isLogged, loginAccount);
  if (!stats) return null;
  const { availableFunds, frozenFunds, totalFunds, realizedPL } = stats;

  return (
    <>
      {(isLogged || restoredAccount) && (
        <div className={Styles.statsContainer}>
          <div>
            <LinearPropertyLabel {...availableFunds} highlightAlternateBolded />
            <LinearPropertyLabel {...frozenFunds} highlightAlternateBolded />
            <LinearPropertyLabelUnderlineTooltip
              {...totalFunds}
              highlightAlternateBolded
              id={isMobile ? 'totalFundsMobile' : 'totalFunds_top_bar'}
            />
            <div>
              <span>{realizedPL.label}</span>
              <MovementLabel value={realizedPL.value} useFull />
            </div>
          </div>
          <div>
            <span>{realizedPL.label}</span>
            <MovementLabel value={realizedPL.value} useFull />
          </div>
        </div>
      )}
    </>
  );
};

const TopBar = () => {

  const {
    pendingQueue,
    loginAccount: { address, currentOnboardingStep, balances },
    theme,
    isLogged,
    restoredAccount,
    isMobile,
    isAlertsMenuOpen,
    ethToDaiRate,
    actions: { setIsAlertsMenuOpen, setBetslipMinimized, setModal },
  } = useAppStatusStore();
  const {
    matched: { count: MyBetsCount },
    actions: { toggleHeader },
  } = useBetslipStore();
  const isSports = theme === THEMES.SPORTS;
  const { unseenCount } = getInfoAlertsAndSeenCount();
  const LoggedOrRestored = isLogged || restoredAccount;
  const notLoggedAndRestored = !isLogged && !restoredAccount;
  const pending =
    pendingQueue[TRANSACTIONS] &&
    pendingQueue[TRANSACTIONS][MIGRATE_FROM_LEG_REP_TOKEN];
  const showMigrateRepButton =
    balances?.legacyRep !== '0' || balances?.legacyAttoRep !== '0' || !!pending;

    const [isZeroXApproved, setIsZeroXApproved] = useState(false);
    const [isShareTokenApproved, setIsShareTokenApproved] = useState(false);
    const [isFillOrderAprpoved, setIsFillOrderApproved] = useState(false);

    useEffect(() => {
      if (
        isLogged &&
        address &&
        currentOnboardingStep < TOTAL_ONBOARDING_STEPS &&
        (!isZeroXApproved || !isShareTokenApproved || !isFillOrderAprpoved)
      ) {
        const checkIsZeroXApproved = async () => {
          const approved = await approveZeroXCheck(address);
          setIsZeroXApproved(approved);
        };

        const checkIsShareTokenApproved = async () => {
          const approved = await approveShareTokenCheck(address);
          setIsShareTokenApproved(approved);
        };

        const checkIsFillOrderApproved = async () => {
          const approved = await approveFillOrderCheck(address);
          setIsFillOrderApproved(approved);
        };

        checkIsZeroXApproved();
        checkIsShareTokenApproved();
        checkIsFillOrderApproved();
      }
    }, [isLogged, address]);


  const accountSetup = isZeroXApproved && isShareTokenApproved && isFillOrderAprpoved;
  return (
    <header className={Styles.TopBar}>
      <div className={Styles.Logo}>
        <Link to={makePath(MARKETS)}>
          <NewLogo />
        </Link>
      </div>
      <ThemeSwitch />
      {LoggedOrRestored && <Stats />}
      <div>
        {LoggedOrRestored && isSports && showMigrateRepButton && (
          <ProcessingButton
            text="Migrate V1 to REPv2"
            action={() => setModal({ type: MODAL_MIGRATE_REP })}
            queueName={TRANSACTIONS}
            queueId={MIGRATE_FROM_LEG_REP_TOKEN}
            primaryButton
            spinner
            className={ButtonStyles.ProcessingSpinnerButton}
          />
        )}

        {(isLogged || restoredAccount) && !accountSetup && currentOnboardingStep < TOTAL_ONBOARDING_STEPS && ethToDaiRate && (
          <PrimaryButton text={'Continue account setup'} action={() => handleShowOnboarding(currentOnboardingStep, setModal)} />
        )}

        {(!isLogged || (!isMobile && LoggedOrRestored)) && <HelpResources />}
        {!isMobile && <OddsMenu />}
        {notLoggedAndRestored && (
          <>
            <SecondaryButton
              action={() => setModal({ type: MODAL_LOGIN })}
              title="Connect"
              text="Connect"
              dark
            />
            <PrimaryButton
              action={() => setModal({ type: MODAL_SIGNUP })}
              title="Signup"
              text="Signup"
            />
          </>
        )}
        {LoggedOrRestored && (
          <div
            className={classNames(Styles.ActiveBets, {
              [Styles.Empty]: MyBetsCount === 0,
            })}
          >
            <button
              onClick={() => {
                toggleHeader(BETSLIP_SELECTED.MY_BETS);
                setBetslipMinimized(false);
              }}
            >
              {BetsIconCount(MyBetsCount)}
            </button>
          </div>
        )}
        {LoggedOrRestored && (
          <div className={Styles.AlertsDiv}>
            <button
              className={classNames(Styles.alerts, {
                [Styles.alertsDark]: isAlertsMenuOpen,
                [Styles.Empty]: unseenCount < 1,
              })}
              onClick={() => {
                setIsAlertsMenuOpen(!isAlertsMenuOpen);
              }}
              tabIndex={-1}
            >
              {Alerts(unseenCount)}
            </button>
            <AlertsContainer />
          </div>
        )}
        <ConnectAccount />
      </div>
    </header>
  );
};

export default TopBar;
