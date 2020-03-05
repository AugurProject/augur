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
} from 'modules/routes/constants/views';
import {
  MODAL_NETWORK_CONNECT,
  MOBILE_MENU_STATES,
  TRADING_TUTORIAL,
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
import { MARKET_ID_PARAM_NAME, AFFILIATE_NAME } from 'modules/routes/constants/param-names';
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
  ethereumNodeHttp: string;
  ethereumNodeWs: string;
  sdkEndpoint: string;
  useWeb3Transport: boolean;
  logout: Function;
  sidebarStatus: {
    mobileMenuState: number;
    isAlertsVisible: boolean;
    currentBasePath: string;
  };
  updateCurrentBasePath: Function;
  updateCurrentInnerNavType: Function;
  updateMobileMenuState: Function;
  updateIsAlertVisible: Function;
  updateSidebarStatus: Function;
  toasts: any[];
  updateConnectionTray: Function;
  isConnectionTrayOpen: boolean;
  updateHelpMenuState: Function;
  isHelpMenuOpen: boolean;
  showGlobalChat: Function;
  migrateV1Rep: Function;
  walletBalances: AccountBalances;
  saveAffilateAddress: Function;
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
      title: 'Account Summary',
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
        if (err || (res && !res.ethereumNode) || res) {
          updateModal({
            type: MODAL_NETWORK_CONNECT,
            isInitialConnection: true,
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
      this.props.saveAffilateAddress(affiliate)
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
      sidebarStatus
    } = this.props;
    if (isMobile !== prevProps.isMobile) {
      updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
    }
    if (universe.forkingInfo !== prevProps.universe.forkingInfo) {
      this.sideNavMenuData[5].disabled = !!prevProps.universe.forkingInfo;
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
    const { isMobile, sidebarStatus, updateSidebarStatus, isConnectionTrayOpen, isHelpMenuOpen, updateConnectionTray, updateHelpMenuState } = this.props;
    let updateState = false;

    if (
      testSideNav &&
      isMobile &&
      sidebarStatus.mobileMenuState !== MOBILE_MENU_STATES.CLOSED
    ) {
      stateUpdate.mobileMenuState = MOBILE_MENU_STATES.CLOSED;
      updateState = true;
    }

    if (sidebarStatus.isAlertsVisible) {
      stateUpdate.isAlertsVisible = false;
      updateState = true;
    }

    if (updateState) {
      updateSidebarStatus(stateUpdate);
    }

    if (isHelpMenuOpen) {
      updateHelpMenuState(false);
    }

    if (isConnectionTrayOpen) {
      updateConnectionTray(false);
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

  toggleAlerts() {
    const { isLogged, sidebarStatus, updateIsAlertVisible } = this.props;
    if (isLogged) {
      updateIsAlertVisible(!sidebarStatus.isAlertsVisible);
    }
  }

  mobileMenuButtonClick() {
    const {
      sidebarStatus,
      updateMobileMenuState,
      updateConnectionTray,
    } = this.props;
    const { mobileMenuState: menuState } = sidebarStatus;

    updateConnectionTray(false);
    switch (menuState) {
      case MOBILE_MENU_STATES.CLOSED:
        updateMobileMenuState(MOBILE_MENU_STATES.SIDEBAR_OPEN);
        break;
      default:
        updateMobileMenuState(menuState - 1);
        break;
    }
  }

  renderMobileMenuButton() {
    const { sidebarStatus } = this.props;
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
        className={Styles['SideBar__mobile-bars']}
        onClick={() => this.mobileMenuButtonClick()}
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
      isConnectionTrayOpen,
      updateConnectionTray,
      migrateV1Rep,
      walletBalances,
      updateModal,
      isHelpMenuOpen,
      updateHelpMenuState,
      notifications,
      showMigrateRepButton,
    } = this.props;
    this.sideNavMenuData[1].showAlert =
      notifications.filter(item => item.isNew).length > 0;
    const currentPath = parsePath(location.pathname)[0];

    const onTradingTutorial =
      parseQuery(location.search)[MARKET_ID_PARAM_NAME] === TRADING_TUTORIAL;

    return (
      <main>
        <HelmetTag {...APP_HEAD_TAGS} />
        {Object.keys(modal).length !== 0 && <Modal />}
        {toasts.length > 0 && (
          <ToastsContainer
            toasts={toasts}
            onTradingTutorial={onTradingTutorial}
          />
        )}
        <div
          className={classNames({
            [Styles['App--blur']]: Object.keys(modal).length !== 0,
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
              className={classNames(Styles.TopBar, Styles.TopBar__floatAbove, {
                [Styles.SideNavOpen]:
                  sidebarStatus.mobileMenuState ===
                  MOBILE_MENU_STATES.SIDEBAR_OPEN,
              })}
              role="presentation"
            >
              <TopBar />
            </section>

            <section
              className={Styles.SideBar}
              onClick={e => this.mainSectionClickHandler(e, false)}
              role="presentation"
            >
              <div>{this.renderMobileMenuButton()}</div>

              {/* HIDDEN ON DESKTOP */}
              <SideNav
                showNav={
                  sidebarStatus.mobileMenuState ===
                  MOBILE_MENU_STATES.SIDEBAR_OPEN
                }
                defaultMobileClick={() => {
                  updateConnectionTray(false);
                  updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
                }}
                isLogged={isLogged || restoredAccount}
                menuData={this.sideNavMenuData}
                currentBasePath={sidebarStatus.currentBasePath}
                isConnectionTrayOpen={isConnectionTrayOpen}
                isHelpMenuOpen={isHelpMenuOpen}
                updateConnectionTray={updateConnectionTray}
                updateHelpMenuState={updateHelpMenuState}
                logout={() => this.props.logout()}
                showGlobalChat={() => this.props.showGlobalChat()}
                migrateV1Rep={migrateV1Rep}
                showMigrateRepButton={showMigrateRepButton}
                walletBalances={walletBalances}
                updateModal={updateModal}
              />

              {/* HIDDEN ON MOBILE */}
              <TopNav
                isLogged={isLogged || restoredAccount}
                menuData={this.sideNavMenuData}
                currentBasePath={sidebarStatus.currentBasePath}
                migrateV1Rep={migrateV1Rep}
                showMigrateRepButton={showMigrateRepButton}
                walletBalances={walletBalances}
                updateModal={updateModal}
              />
            </section>
            <AlertsContainer
              alertsVisible={isLogged && sidebarStatus.isAlertsVisible}
              toggleAlerts={() => this.toggleAlerts()}
            />
            {universe.forkEndTime &&
              universe.forkEndTime !== '0' &&
              blockchain &&
              blockchain.currentAugurTimestamp && (
                <section className={Styles.TopBar} />
              )}
            <section
              className={classNames(Styles.Main__wrap, {
                [Styles['Main__wrapMarkets']]: currentPath === MARKETS,
                [Styles['TopBarOpen']]:
                  sidebarStatus.mobileMenuState ===
                  MOBILE_MENU_STATES.SIDEBAR_OPEN,
              })}
            >
              {currentPath === MARKETS ? (
                <MarketsInnerNavContainer
                  location={location}
                  history={history}
                  mobileMenuState={sidebarStatus.mobileMenuState}
                />
              ) : (
                <div className="no-nav-placehold" />
              )}
              <section
                className={classNames(Styles.Main__content, {
                  [Styles.Tutorial]: onTradingTutorial,
                  [Styles.ModalShowing]: Object.keys(modal).length !== 0,
                  [Styles.SideNavOpen]:
                    sidebarStatus.mobileMenuState ===
                    MOBILE_MENU_STATES.SIDEBAR_OPEN,
                })}
                onClick={this.mainSectionClickHandler}
                role="presentation"
                id={'mainContent'}
              >
                {!isLogged && (
                  <div className={Styles.BettingUI}>
                    <ExternalLinkText
                      title={'Betting UI'}
                      label={' - Coming Soon!'}
                      URL={'https://augur.net'}
                    />
                  </div>
                )}

                <ForkingBanner />

                <Routes isLogged={isLogged || restoredAccount} />
              </section>
            </section>
          </section>
        </div>
      </main>
    );
  }
}
