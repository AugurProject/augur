// TODO -- this component needs to be broken up
//         all logic related to sidebar(s) need to be housed w/in a separate component

import React, { Component } from 'react';
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

export default class AppView extends Component<AppProps> {
  static defaultProps = {
    ethereumNodeHttp: null,
    ethereumNodeWs: null,
    sdkEndpoint: null,
    useWeb3Transport: false,
  };

  sideNavMenuData = [
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
      showAlert: this.props.notifications.filter(item => item.isNew).length > 0,
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
      disabled: !!this.props.universe.forkingInfo,
    },
  ];

  handleComponentMount = () => {
    const {
      env,
      ethereumNodeHttp,
      ethereumNodeWs,
      sdkEndpoint,
      history,
      initAugur,
      location,
      updateModal,
      useWeb3Transport,
      updateCurrentBasePath,
    } = this.props;
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
    const currentPath = parsePath(location.pathname)[0];
    updateCurrentBasePath(currentPath);
    this.changeMenu(currentPath);
  };

  componentDidMount() {
    this.handleComponentMount();
    window.addEventListener('resize', this.handleWindowResize);

    // Restyle all scrollbars on windows
    if (isWindows()) {
      document.body.classList.add('App--windowsScrollBars');
    }
    this.checkIsMobile();

    const affiliate = parseLocation(location.href)[AFFILIATE_NAME];
    if (affiliate) {
      this.props.saveAffilateAddress(affiliate);
    }
  }

  compomentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps: AppProps) {
    const {
      isMobile,
      location,
      universe,
      updateCurrentBasePath,
      updateMobileMenuState,
      sidebarStatus,
    } = this.props;
    if (isMobile !== prevProps.isMobile) {
      updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
    }
    if (universe.forkingInfo !== prevProps.universe.forkingInfo) {
      this.sideNavMenuData[5].disabled = !!universe.forkingInfo;
    }

    if (location !== prevProps.location) {
      const nextBasePath = parsePath(location.pathname)[0];
      const lastBasePath = parsePath(prevProps.location.pathname)[0];

      if (lastBasePath !== nextBasePath) {
        updateCurrentBasePath(nextBasePath);
        this.changeMenu(nextBasePath);
      }
    }

    if (sidebarStatus.mobileMenuState === MOBILE_MENU_STATES.FIRSTMENU_OPEN) {
      document.body.classList.add('App--noScroll');
    } else {
      document.body.classList.remove('App--noScroll');
    }
  }

  mainSectionClickHandler = (e: any, testSideNav = true) => {
    const stateUpdate: any = {};
    const {
      isMobile,
      sidebarStatus,
      updateSidebarStatus,
    } = this.props;
    let updateState = false;

    if (
      testSideNav &&
      isMobile &&
      sidebarStatus.mobileMenuState !== MOBILE_MENU_STATES.CLOSED
    ) {
      stateUpdate.mobileMenuState = MOBILE_MENU_STATES.CLOSED;
      updateState = true;
    }

    if (updateState) {
      updateSidebarStatus(stateUpdate);
    }
  };

  changeMenu(nextBasePath: string) {
    if (nextBasePath === MARKETS) {
      this.props.updateCurrentInnerNavType(MarketsInnerNavContainer);
    } else {
      this.props.updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
    }
  }

  handleWindowResize = () => {
    this.checkIsMobile();
  };

  checkIsMobile = () => {
    const { updateIsMobile, updateIsMobileSmall } = this.props;
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

  renderMobileMenuButton(sidebarStatus, updateMobileMenuState, cbForMobileClick = () => {}) {
    const { mobileMenuState: menuState } = sidebarStatus;

    let icon: any = null;
    if (menuState === MOBILE_MENU_STATES.CLOSED) {
      icon = <MobileNavHamburgerIcon />;
    } else {
      if (menuState === MOBILE_MENU_STATES.FIRSTMENU_OPEN) {
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
          switch (menuState) {
            case MOBILE_MENU_STATES.CLOSED:
              updateMobileMenuState(MOBILE_MENU_STATES.SIDEBAR_OPEN);
              break;
            default:
              updateMobileMenuState(menuState - 1);
              break;
          }
        }}
      >
        {icon}
      </button>
    );
  }

  render() {
    const {
      blockchain,
      history,
      isLogged,
      restoredAccount,
      location,
      modal,
      universe,
      sidebarStatus,
      updateMobileMenuState,
      toasts,
      migrateV1Rep,
      walletBalances,
      updateModal,
      notifications,
      createFundedGsnWallet,
      showCreateAccountButton,
      showMigrateRepButton,
      logout,
      showGlobalChat,
    } = this.props;
    const sideNavMenuData = this.sideNavMenuData;
    const { forkEndTime } = universe;
    const { currentAugurTimestamp } = blockchain;    
    sideNavMenuData[1].showAlert =
      notifications.filter(item => item.isNew).length > 0;
    const currentPath = parsePath(location.pathname)[0];

    const { currentBasePath, mobileMenuState } = sidebarStatus;
    const navShowing = mobileMenuState === MOBILE_MENU_STATES.SIDEBAR_OPEN;
    const ModalShowing = Object.keys(modal).length !== 0;

    const onTradingTutorial =
      parseQuery(location.search)[MARKET_ID_PARAM_NAME] === TRADING_TUTORIAL;

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
              sidebarStatus={sidebarStatus}
              renderMobileMenuButton={this.renderMobileMenuButton}
              mainSectionClickHandler={this.mainSectionClickHandler}
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
                mainSectionClickHandler={this.mainSectionClickHandler}
              />
            </section>
          </section>
        </div>
        </AppStatusProvider>
      </main>
    );
  }
};

const SideBarSection = ({
  sidebarStatus,
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
      onClick={e => { mainSectionClickHandler(e, false); closeAppMenus(); }}
      role="presentation"
    >
      <div>{renderMobileMenuButton(sidebarStatus, updateMobileMenuState, closeAppMenus)}</div>

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
    onClick={e => { mainSectionClickHandler(e); closeAppMenus(); }}
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
