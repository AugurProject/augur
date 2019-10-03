// TODO -- this component needs to be broken up
//         all logic related to sidebar(s) need to be housed w/in a separate component

import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
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
  MobileNavBackIcon,
  LogoutIcon,
  NavAccountIcon,
  NavCreateIcon,
  NavMarketsIcon,
  NavPortfolioIcon,
  NavReportingIcon
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
  MOBILE_MENU_STATES
} from 'modules/common/constants';

import Styles from 'modules/app/components/app.styles.less';
import MarketsInnerNavContainer from 'modules/app/containers/markets-inner-nav';
import { Universe } from 'modules/types';

interface AppProps {
  blockchain: Object;
  env: Object;
  history: Object;
  initAugur: Function;
  isLogged: Boolean;
  isMobile: Boolean;
  location: Object;
  loginAccount: Object;
  modal: Object;
  universe: Universe;
  updateIsMobile: Function;
  updateIsMobileSmall: Function;
  updateModal: Function;
  finalizeMarket: Function;
  ethereumNodeHttp: string;
  ethereumNodeWs: string;
  useWeb3Transport: Boolean;
  logout: Function;
  sidebarStatus: Object;
  updateCurrentBasePath: Function;
  updateCurrentInnerNavType: Function;
  updateMobileMenuState: Function;
  updateIsAlertVisible: Function;
  updateSidebarStatus: Function;
  alerts: Object;
  toasts: Array<any>;
}

export default class AppView extends Component<AppProps> {
  static defaultProps = {
    ethereumNodeHttp: null,
    ethereumNodeWs: null,
    useWeb3Transport: false,
  };

  sideNavMenuData = [
    {
      title: 'Markets',
      icon: NavMarketsIcon,
      route: MARKETS,
    },
    {
      title: 'Account Summary',
      iconName: 'nav-account-icon',
      icon: NavAccountIcon,
      route: ACCOUNT_SUMMARY,
      requireLogin: true
    },
    {
      title: 'Portfolio',
      iconName: 'nav-portfolio-icon',
      icon: NavPortfolioIcon,
      route: MY_POSITIONS,
      requireLogin: true,
    },
    {
      title: 'Disputing',
      iconName: 'nav-reporting-icon',
      icon: NavReportingIcon,
      mobileClick: () =>
        this.props.updateMobileMenuState(MOBILE_MENU_STATES.FIRSTMENU_OPEN),
      route: DISPUTING,
    },
    {
      title: 'Reporting',
      iconName: 'nav-reporting-icon',
      icon: NavReportingIcon,
      mobileClick: () =>
        this.props.updateMobileMenuState(MOBILE_MENU_STATES.FIRSTMENU_OPEN),
      route: REPORTING,
    },
    {
      title: 'Create',
      iconName: 'nav-create-icon',
      icon: NavCreateIcon,
      route: CREATE_MARKET,
      requireLogin: true,
      disabled: this.props.universe.forkingInfo,
    },
    {
      title: 'Logout',
      iconName: 'nav-logout-icon',
      icon: LogoutIcon,
      mobileClick: () => this.props.logout(),
      route: MARKETS,
      requireLogin: true,
      onlyForMobile: true,
    },
  ];

  UNSAFE_componentWillMount() {
    const {
      env,
      ethereumNodeHttp,
      ethereumNodeWs,
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
        useWeb3Transport,
      },
      (err: any, res: any) => {
        if (err || (res && !res.ethereumNode) || (res)) {
          updateModal({
            type: MODAL_NETWORK_CONNECT,
            isInitialConnection: true
          });
        }
      }
    );

    const currentPath = parsePath(location.pathname)[0];
    updateCurrentBasePath(currentPath);

    this.changeMenu(currentPath);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);

    // Restyle all scrollbars on windows
    if (isWindows()) {
      document.body.classList.add('App--windowsScrollBars');
    }
    this.checkIsMobile();
  }

  UNSAFE_componentWillReceiveProps(nextProps: AppProps) {
    const {
      isMobile,
      location,
      universe,
      updateCurrentBasePath,
      updateMobileMenuState,
    } = this.props;
    if (isMobile !== nextProps.isMobile) {
      updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
    }
    if (universe.forkingInfo !== nextProps.universe.forkingInfo) {
      this.sideNavMenuData[1].disabled = nextProps.universe.forkingInfo;
    }

    if (location !== nextProps.location) {
      const lastBasePath = parsePath(location.pathname)[0];
      const nextBasePath = parsePath(nextProps.location.pathname)[0];

      if (lastBasePath !== nextBasePath) {
        updateCurrentBasePath(nextBasePath);
        this.changeMenu(nextBasePath);
      }
    }
  }

  mainSectionClickHandler = (e: any, testSideNav = true) => {
    const stateUpdate: any = {};
    const { isMobile, sidebarStatus, updateSidebarStatus } = this.props;
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
  };

  changeMenu(nextBasePath: string) {
    if (nextBasePath === MARKETS) {
      this.props.updateCurrentInnerNavType(MarketsInnerNavContainer);
    }
    else {
      this.props.updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
    }
  }

  handleWindowResize = () => {
    this.checkIsMobile();
  }

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
  }

  toggleAlerts() {
    const { isLogged, sidebarStatus, updateIsAlertVisible } = this.props;
    if (isLogged) {
      updateIsAlertVisible(!sidebarStatus.isAlertsVisible);
    }
  }

  mobileMenuButtonClick() {
    const { sidebarStatus, updateMobileMenuState } = this.props;
    const { mobileMenuState: menuState } = sidebarStatus;

    switch (menuState) {
      case MOBILE_MENU_STATES.CLOSED:
        updateMobileMenuState(MOBILE_MENU_STATES.SIDEBAR_OPEN);
        break;
      default:
        updateMobileMenuState(menuState - 1);
        break;
    }
  }

  renderMobileMenuButton(unseenCount: number) {
    const { sidebarStatus } = this.props;
    const { mobileMenuState: menuState } = sidebarStatus;

    let icon: any = null;
    if (menuState === MOBILE_MENU_STATES.CLOSED) {
      icon = <MobileNavHamburgerIcon />;
    }
    else if (menuState === MOBILE_MENU_STATES.SIDEBAR_OPEN) {
      icon = <MobileNavCloseIcon />;
    }
    else if (menuState >= MOBILE_MENU_STATES.FIRSTMENU_OPEN) {
      icon = <MobileNavBackIcon />;
    }
    // remove back icon for markets on mobile
    if (
      sidebarStatus.currentBasePath === MARKETS &&
      menuState !== MOBILE_MENU_STATES.CLOSED
    ) {
      icon = <MobileNavCloseIcon />;
    }

    return (
      <button
        type='button'
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
      isMobile,
      location,
      modal,
      universe,
      sidebarStatus,
      updateMobileMenuState,
      alerts,
      toasts
    } = this.props;

    const { unseenCount } = alerts;
    const currentPath = parsePath(location.pathname)[0];

    return (
      <main>
        <Helmet
          defaultTitle='Decentralized Prediction Markets | Augur'
          titleTemplate='%s | Augur'
        />
        {Object.keys(modal).length !== 0 && <Modal />}
        {toasts.length > 0 && <ToastsContainer toasts={toasts}/>}
        <div
          className={classNames({
            [Styles['App--blur']]: Object.keys(modal).length !== 0,
          })}
        >
          <section className={Styles.Main}>
            <section
              className={classNames(Styles.TopBar, Styles.TopBar__floatAbove)}
              onClick={this.mainSectionClickHandler}
              role='presentation'
            >
              <TopBar />
            </section>

            <section
            className={Styles.SideBar}
            onClick={e => this.mainSectionClickHandler(e, false)}
            role='presentation'
          >
            {this.renderMobileMenuButton(unseenCount)}

            {/* HIDDEN ON DESKTOP */}
            <SideNav
              defaultMobileClick={() =>
                updateMobileMenuState(MOBILE_MENU_STATES.CLOSED)
              }
              isLogged={isLogged}
              mobileShow={
                sidebarStatus.mobileMenuState ===
                MOBILE_MENU_STATES.SIDEBAR_OPEN
              }
              menuData={this.sideNavMenuData}
              currentBasePath={sidebarStatus.currentBasePath}
            />

            {/* HIDDEN ON MOBILE */}
            <TopNav
              isLogged={isLogged}
              menuData={this.sideNavMenuData}
              currentBasePath={sidebarStatus.currentBasePath}
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
                <section className={Styles.TopBar}>
                </section>
              )}
            <section
              className={classNames(Styles.Main__wrap, {
                [Styles['Main__wrapMarkets']]: currentPath === MARKETS,
              })}
            >
             { currentPath === MARKETS ?  <MarketsInnerNavContainer
                  location={location}
                  history={history}
                  mobileMenuState={sidebarStatus.mobileMenuState}
             /> : <div className='no-nav-placehold' /> }

              <section
                className={Styles.Main__content}
                onClick={this.mainSectionClickHandler}
                role='presentation'
              >
                <Routes isLogged={isLogged} />
              </section>
            </section>
          </section>
        </div>
      </main>
    );
  }
}
