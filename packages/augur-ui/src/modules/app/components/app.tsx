// TODO -- this component needs to be broken up
//         all logic related to sidebar(s) need to be housed w/in a separate component

import React, { useEffect } from 'react';
import classNames from 'classnames';
import isWindows from 'utils/is-windows';
import Modal from 'modules/modal/containers/modal-view';
import TopBar from 'modules/app/containers/top-bar';
import SideNav from 'modules/app/components/side-nav/side-nav';
import TopNav from 'modules/app/components/top-nav/top-nav';
import Routes from 'modules/routes/components/routes/routes';
import AlertsContainer from 'modules/alerts/containers/alerts-view';
import ToastsContainer from 'modules/alerts/containers/toasts-view';

import { Betslip } from 'modules/trading/betslip';
import { BetslipProvider } from 'modules/trading/store/betslip';
import { AppStatusProvider, useAppStatusStore } from 'modules/app/store/app-status';

import {
  MobileNavHamburgerIcon,
  MobileNavCloseIcon,
  XIcon,
} from 'modules/common/icons';
import parsePath from 'modules/routes/helpers/parse-path';
import {
  MARKETS,
  ACCOUNT_SUMMARY,
  MY_POSITIONS,
  CREATE_MARKET,
  DISPUTING,
  REPORTING,
  MARKET,
} from 'modules/routes/constants/views';
import {
  MODAL_NETWORK_CONNECT,
  MOBILE_MENU_STATES,
  TRADING_TUTORIAL,
  THEMES,
} from 'modules/common/constants';
import Styles from 'modules/app/components/app.styles.less';
import MarketsInnerNavContainer from 'modules/app/containers/markets-inner-nav';
import {
  Universe,
  Blockchain,
  LoginAccount,
  Notification,
  AccountBalances,
} from 'modules/types';
import ForkingBanner from 'modules/reporting/containers/forking-banner';
import parseQuery, { parseLocation } from 'modules/routes/helpers/parse-query';
import {
  MARKET_ID_PARAM_NAME,
  AFFILIATE_NAME,
} from 'modules/routes/constants/param-names';
import makePath from 'modules/routes/helpers/make-path';
import { ExternalLinkText } from 'modules/common/buttons';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { APP_HEAD_TAGS } from 'modules/seo/helmet-configs';
import { SDKConfiguration } from '@augurproject/artifacts';

interface AppProps {
  notifications: Notification[];
  blockchain: Blockchain;
  config: SDKConfiguration;
  history: History;
  initAugur: Function;
  isLogged: boolean;
  restoredAccount: boolean;
  isMobile: boolean;
  location: Location;
  loginAccount: LoginAccount;
  modal: object;
  universe: Universe;
  updateIsMobile: Function;
  updateIsMobileSmall: Function;
  updateModal: Function;
  finalizeMarket: Function;
  env: any;
  ethereumNodeHttp: string;
  ethereumNodeWs: string;
  sdkEndpoint: string;
  useWeb3Transport: boolean;
  logout: Function;
  sidebarStatus: {
    mobileMenuState: number;
    currentBasePath: string;
  };
  updateCurrentBasePath: Function;
  updateCurrentInnerNavType: Function;
  updateMobileMenuState: Function;
  updateIsAlertVisible: Function;
  updateSidebarStatus: Function;
  toasts: any[];
  showGlobalChat: Function;
  migrateV1Rep: Function;
  walletBalances: AccountBalances;
  saveAffilateAddress: Function;
  createFundedGsnWallet: Function;
  showCreateAccountButton: boolean;
  showMigrateRepButton: boolean;
}

function renderMobileMenuButton(mobileMenuState, updateMobileMenuState, cbForMobileClick = () => {}) {
  let icon: any = null;
  if (mobileMenuState === MOBILE_MENU_STATES.CLOSED) {
    icon = <MobileNavHamburgerIcon />;
  } else {
    if (mobileMenuState === MOBILE_MENU_STATES.FIRSTMENU_OPEN) {
      icon = null;
    } else {
      icon = <MobileNavCloseIcon />;
    }
  }

  return (
    <button
      type="button"
      className={Styles.MobileBars}
      onClick={() => {
        cbForMobileClick();
        switch (mobileMenuState) {
          case MOBILE_MENU_STATES.CLOSED:
            updateMobileMenuState(MOBILE_MENU_STATES.SIDEBAR_OPEN);
            break;
          default:
            updateMobileMenuState(mobileMenuState - 1);
            break;
        }
      }}
    >
      {icon}
    </button>
  );
};

function changeMenu(nextBasePath, updateCurrentInnerNavType, updateMobileMenuState) {
  if (nextBasePath === MARKETS) {
    updateCurrentInnerNavType(MarketsInnerNavContainer);
  } else {
    updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
  }
}

function checkIsMobile (updateIsMobile, updateIsMobileSmall) {
  // This method sets up the side bar's state + calls the method to attach the touch event handler for when a user is mobile
  // CSS breakpoint sets the value when a user is mobile
  const isMobile =
    (
      window
        .getComputedStyle(document.body)
        .getPropertyValue('--is-mobile') || ''
    ).indexOf('true') !== -1;
  const isMobileSmall =
    (
      window
        .getComputedStyle(document.body)
        .getPropertyValue('--is-mobile-small') || ''
    ).indexOf('true') !== -1;

  updateIsMobile(isMobile);
  updateIsMobileSmall(isMobileSmall);
};

const AppView = ({
  ethereumNodeHttp = null,
  ethereumNodeWs = null,
  sdkEndpoint = null,
  useWeb3Transport = false,
  notifications,
  universe: { forkEndTime, forkingInfo },
  env,
  history,
  initAugur,
  location: locationProp,
  updateModal,
  updateCurrentBasePath,
  saveAffilateAddress,
  isMobile,
  updateMobileMenuState,
  sidebarStatus: { currentBasePath, mobileMenuState },
  updateSidebarStatus,
  updateIsMobile,
  updateIsMobileSmall,
  blockchain: { currentAugurTimestamp },
  isLogged,
  restoredAccount,
  modal,
  toasts,
  migrateV1Rep,
  walletBalances,
  createFundedGsnWallet,
  showCreateAccountButton,
  showMigrateRepButton,
  logout,
  showGlobalChat,
  updateCurrentInnerNavType,
}:AppProps) => {
  const currentPath = parsePath(locationProp.pathname)[0];
  const navShowing = mobileMenuState === MOBILE_MENU_STATES.SIDEBAR_OPEN;
  const ModalShowing = Object.keys(modal).length !== 0;
  const onTradingTutorial =
    parseQuery(locationProp.search)[MARKET_ID_PARAM_NAME] === TRADING_TUTORIAL;
  const sideNavMenuData = [
    {
      title: 'Markets',
      route: MARKETS,
      requireLogin: false,
      disabled: false,
    },
    {
      title:'Account Summary',
      route: ACCOUNT_SUMMARY,
      requireLogin: true,
      showAlert: notifications.filter(item => item.isNew).length > 0,
    },
    {
      title: 'Portfolio',
      route: MY_POSITIONS,
      requireLogin: true,
    },
    {
      title: 'Disputing',
      route: DISPUTING,
      requireLogin: true,
      alternateStyle: true,
    },
    {
      title: 'Reporting',
      route: REPORTING,
      requireLogin: true,
      alternateStyle: true,
    },
    {
      title: 'Create Market',
      route: CREATE_MARKET,
      requireLogin: true,
      button: true,
      alternateStyle: true,
      disabled: !!forkingInfo,
    },
  ];

  useEffect(() => {
    initAugur(
      history,
      {
        ...env,
        ethereumNodeHttp,
        ethereumNodeWs,
        sdkEndpoint,
        useWeb3Transport,
      },
      (err: any, res: any) => {
        if (err) {
          updateModal({
            type: MODAL_NETWORK_CONNECT,
            isInitialConnection: true,
            config: res.config,
          });
        }
      }
    );
    // we only want this to run the first mount, so we set the things to look at to a static value.
  }, [false])

  useEffect(() => {
    function handleRezize() {
      checkIsMobile(updateIsMobile, updateIsMobileSmall);
    }
    window.addEventListener('resize', handleRezize);
    if (isWindows()) {
      document.body.classList.add('App--windowsScrollBars');
    }
    return () => {
      window.removeEventListener('resize', handleRezize);
    };
  }, [])

  useEffect(() => {
    // weirdly location and the passed location prop are both needed, this uses the standard location object.
    const affiliate = parseLocation(location.href)[AFFILIATE_NAME];
    if (affiliate) {
      saveAffilateAddress(affiliate);
    }
  }, [location])

  useEffect(() => {
    updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
    updateCurrentBasePath(currentPath);
    changeMenu(currentPath, updateCurrentInnerNavType, updateMobileMenuState);
    if (mobileMenuState === MOBILE_MENU_STATES.FIRSTMENU_OPEN) {
      document.body.classList.add('App--noScroll');
    } else {
      document.body.classList.remove('App--noScroll');
    }
  }, [mobileMenuState, isMobile, currentPath])

  function mainSectionClickHandler(e: any, testSideNav = true) {
    const stateUpdate: any = {};
    if (
      testSideNav &&
      isMobile &&
      mobileMenuState !== MOBILE_MENU_STATES.CLOSED
    ) {
      stateUpdate.mobileMenuState = MOBILE_MENU_STATES.CLOSED;
      updateSidebarStatus(stateUpdate);
    }
  };

  return (
    <main>
      <AppStatusProvider>
      <HelmetTag {...APP_HEAD_TAGS} />
      {ModalShowing && <Modal />}
      {toasts.length > 0 && (
        <ToastsContainer
          toasts={toasts}
          onTradingTutorial={onTradingTutorial}
        />
      )}
      <div
        className={classNames({
          [Styles.AppBlur]: ModalShowing,
        })}
      >
        <section
          className={classNames(Styles.Main, {
            [Styles.TradingTutorial]: onTradingTutorial,
          })}
        >
          {onTradingTutorial && (
            <section className={Styles.TutorialBanner}>
              <span>Test market</span>
              <button
                onClick={() =>
                  history.push({
                    pathname: makePath(MARKETS),
                  })
                }
              >
                {XIcon}
              </button>
            </section>
          )}
          <section
            className={classNames(Styles.TopBar, Styles.FloatAbove, {
              [Styles.SideNavOpen]: navShowing,
            })}
            role="presentation"
          >
            <TopBar />
          </section>
          <SideBarSection
            mobileMenuState={mobileMenuState}
            renderMobileMenuButton={renderMobileMenuButton}
            mainSectionClickHandler={mainSectionClickHandler}
            navShowing={navShowing}
            updateMobileMenuState={updateMobileMenuState}
            isLogged={isLogged}
            restoredAccount={restoredAccount}
            sideNavMenuData={sideNavMenuData}
            currentBasePath={currentBasePath}
            logout={logout}
            showGlobalChat={showGlobalChat}
            migrateV1Rep={migrateV1Rep}
            showMigrateRepButton={showMigrateRepButton}
            walletBalances={walletBalances}
            updateModal={updateModal}
            showCreateAccountButton={showCreateAccountButton}
            createFundedGsnWallet={createFundedGsnWallet}
          />
          <AlertsContainer isLogged={isLogged} />
          {forkEndTime !== '0' && currentAugurTimestamp && (
            <section className={Styles.TopBar} />
          )}
          <section
            className={classNames(Styles.Wrap, {
              [Styles.WrapMarkets]: currentPath === MARKETS,
              [Styles.TopBarOpen]: navShowing,
            })}
          >
            {currentPath === MARKETS ? (
              <MarketsInnerNavContainer
                location={location}
                history={history}
                mobileMenuState={mobileMenuState}
              />
            ) : (
              <div className="no-nav-placehold" />
            )}
            <MainAppContent
              isLogged={isLogged}
              restoredAccount={restoredAccount}
              onTradingTutorial={onTradingTutorial}
              ModalShowing={ModalShowing}
              navShowing={navShowing}
              currentPath={currentPath}
              currentBasePath={currentBasePath}
              mainSectionClickHandler={mainSectionClickHandler}
            />
          </section>
        </section>
      </div>
      </AppStatusProvider>
    </main>
  );
};

export default AppView;


const SideBarSection = ({
  mobileMenuState,
  renderMobileMenuButton,
  mainSectionClickHandler,
  navShowing,
  updateMobileMenuState,
  isLogged,
  restoredAccount,
  sideNavMenuData,
  currentBasePath,
  logout,
  showGlobalChat,
  migrateV1Rep,
  showMigrateRepButton,
  walletBalances,
  updateModal,
  showCreateAccountButton,
  createFundedGsnWallet,
}) => {
  const { theme, actions: { closeAppMenus } } = useAppStatusStore();
  sideNavMenuData[1].title =
      theme !== THEMES.TRADING ? 'My Account' : 'Account Summary';
  sideNavMenuData[2].title =
    theme !== THEMES.TRADING ? 'My Bets' : 'Portfolio';

  return (
    <section
      className={Styles.SideBar}
      onClick={e => { console.log('SideBar clicked');mainSectionClickHandler(e, false); closeAppMenus(); }}
      role="presentation"
    >
      <div>{renderMobileMenuButton(mobileMenuState, updateMobileMenuState, closeAppMenus)}</div>

      {/* HIDDEN ON DESKTOP */}
      <SideNav
        showNav={navShowing}
        defaultMobileClick={() => {
          updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
        }}
        isLogged={isLogged || restoredAccount}
        menuData={sideNavMenuData}
        currentBasePath={currentBasePath}
        logout={() => logout()}
        showGlobalChat={() => showGlobalChat()}
        migrateV1Rep={migrateV1Rep}
        showMigrateRepButton={showMigrateRepButton}
        walletBalances={walletBalances}
        updateModal={updateModal}
        showCreateAccountButton={showCreateAccountButton}
        createFundedGsnWallet={createFundedGsnWallet}
      />

      {/* HIDDEN ON MOBILE */}
      <TopNav
        isLogged={isLogged || restoredAccount}
        menuData={sideNavMenuData}
        currentBasePath={currentBasePath}
        migrateV1Rep={migrateV1Rep}
        showMigrateRepButton={showMigrateRepButton}
        walletBalances={walletBalances}
        updateModal={updateModal}
        showCreateAccountButton={showCreateAccountButton}
        createFundedGsnWallet={createFundedGsnWallet}
      />
    </section>
  );
};

const MainAppContent = ({ 
  isLogged,
  restoredAccount,
  onTradingTutorial,
  ModalShowing,
  navShowing,
  currentPath,
  currentBasePath,
  mainSectionClickHandler,
}) => {
  const { actions: { closeAppMenus }} = useAppStatusStore();
  const hideBetslip = !currentBasePath?.includes(MARKET);
  return (
    <section
    className={classNames(Styles.Content, {
      [Styles.Tutorial]: onTradingTutorial,
      [Styles.ModalShowing]: ModalShowing,
      [Styles.SideNavOpen]: navShowing,
      [Styles.HideBetslip]: hideBetslip,
    })}
    onClick={e => { console.log('main content clicked'); mainSectionClickHandler(e); closeAppMenus(); }}
    role="presentation"
    id="mainContent"
  >
    {!isLogged && currentPath === MARKETS && (
      <div className={Styles.BettingUI}>
        <ExternalLinkText
          title={'Betting UI'}
          label={' - Coming Soon!'}
          URL={'https://augur.net'}
        />
      </div>
    )}
    <BetslipProvider>
    <ForkingBanner />
    <Routes isLogged={isLogged || restoredAccount} />
    {isLogged && <Betslip />}
    </BetslipProvider>
  </section>
  );
};
