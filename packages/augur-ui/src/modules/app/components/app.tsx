// TODO -- this component needs to be broken up
//         all logic related to sidebar(s) need to be housed w/in a separate component

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import classNames from "classnames";

import shouldComponentUpdatePure from "utils/should-component-update-pure";
import isWindows from "utils/is-windows";

import { tween } from "shifty";
import { isEqual } from "lodash";

import Modal from "modules/modal/containers/modal-view";
import TopBar from "modules/app/containers/top-bar";
import ForkingAlert from "modules/forking/components/forking-alert/forking-alert";
import AccountInnerNav from "modules/app/components/inner-nav/account-inner-nav";
import SideNav from "modules/app/components/side-nav/side-nav";
import Logo from "modules/app/components/logo";
import Routes from "modules/routes/components/routes/routes";
import AlertsContainer from "modules/alerts/containers/alerts-view";

import MobileNavHamburgerIcon from "modules/common/components/mobile-nav-hamburger-icon";
import MobileNavCloseIcon from "modules/common/components/mobile-nav-close-icon";
import MobileNavBackIcon from "modules/common/components/mobile-nav-back-icon";

import NavLogoutIcon from "modules/common/components/nav-logout-icon";
import NavAccountIcon from "modules/common/components/nav-account-icon";
import NavCreateIcon from "modules/common/components/nav-create-icon";
import NavMarketsIcon from "modules/common/components/nav-markets-icon";
import NavPortfolioIcon from "modules/common/components/nav-portfolio-icon";
import { NavReportingIcon } from "modules/common/components/icons";
import { Link } from "react-router-dom";
import makePath from "modules/routes/helpers/make-path";
import parsePath from "modules/routes/helpers/parse-path";
import parseQuery from "modules/routes/helpers/parse-query";

import getValue from "utils/get-value";

import {
  MARKETS,
  ACCOUNT_DEPOSIT,
  ACCOUNT_WITHDRAW,
  ACCOUNT_REP_FAUCET,
  ACCOUNT_UNIVERSES,
  MY_POSITIONS,
  CREATE_MARKET,
  REPORTING_REPORTS,
  REPORTING_DISPUTE_MARKETS,
  REPORTING_REPORT_MARKETS,
  REPORTING_RESOLVED_MARKETS,
  DEFAULT_VIEW
} from "modules/routes/constants/views";
import {
  MODAL_NETWORK_CONNECT,
  CATEGORY_PARAM_NAME,
  MOBILE_MENU_STATES
} from "modules/common-elements/constants";

import Styles from "modules/app/components/app.styles";
import MarketsInnerNavContainer from "modules/app/containers/markets-inner-nav";
import ReportingInnerNav from "modules/app/containers/reporting-inner-nav";

const SUB_MENU = "subMenu";
const MAIN_MENU = "mainMenu";

const navTypes = {
  [MARKETS]: MarketsInnerNavContainer,
  [REPORTING_REPORTS]: ReportingInnerNav,
  [ACCOUNT_DEPOSIT]: AccountInnerNav,
  [ACCOUNT_WITHDRAW]: AccountInnerNav,
  [ACCOUNT_REP_FAUCET]: AccountInnerNav,
  [ACCOUNT_UNIVERSES]: AccountInnerNav,
  [REPORTING_DISPUTE_MARKETS]: ReportingInnerNav,
  [REPORTING_REPORT_MARKETS]: ReportingInnerNav,
  [REPORTING_RESOLVED_MARKETS]: ReportingInnerNav
};

interface AppProps {
  blockchain: any;
  env: any;
  history: any;
  initAugur: any;
  isLogged: any;
  isMobile: any;
  location: any;
  loginAccount: any;
  modal: any;
  universe: any;
  updateIsMobile: any;
  updateIsMobileSmall: any;
  updateModal: any;
  finalizeMarket: any;
  augurNode: any;
  ethereumNodeHttp: any;
  ethereumNodeWs: any;
  useWeb3Transport: any;
  logout: any;
  sidebarStatus: any;
  updateCurrentBasePath: any;
  updateCurrentInnerNavType: any;
  updateMobileMenuState: any;
  updateIsAlertVisible: any;
  updateSidebarStatus: any;
  alerts: any;
}

interface MenuStateItem {
  scalar?: number;
  open?: boolean;
  currentTween?: any | null;
  locked?: boolean;
}

interface AppState {
  mainMenu: MenuStateItem;
  subMenu: MenuStateItem;
}

export default class AppView extends Component<AppProps, AppState> {
  static propTypes = {
    blockchain: PropTypes.object.isRequired,
    env: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    initAugur: PropTypes.func.isRequired,
    isLogged: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    loginAccount: PropTypes.object.isRequired,
    modal: PropTypes.object.isRequired,
    universe: PropTypes.object.isRequired,
    updateIsMobile: PropTypes.func.isRequired,
    updateIsMobileSmall: PropTypes.func.isRequired,
    updateModal: PropTypes.func.isRequired,
    finalizeMarket: PropTypes.func.isRequired,
    augurNode: PropTypes.string,
    ethereumNodeHttp: PropTypes.string,
    ethereumNodeWs: PropTypes.string,
    useWeb3Transport: PropTypes.bool,
    logout: PropTypes.func.isRequired,
    sidebarStatus: PropTypes.object.isRequired,
    updateCurrentBasePath: PropTypes.func.isRequired,
    updateCurrentInnerNavType: PropTypes.func.isRequired,
    updateMobileMenuState: PropTypes.func.isRequired,
    updateIsAlertVisible: PropTypes.func.isRequired,
    updateSidebarStatus: PropTypes.func.isRequired,
    alerts: PropTypes.object.isRequired
  };

  static defaultProps = {
    augurNode: null,
    ethereumNodeHttp: null,
    ethereumNodeWs: null,
    useWeb3Transport: false
  };

  state: AppState = {
    mainMenu: { scalar: 0, open: false, currentTween: null },
    subMenu: { scalar: 0, open: false, currentTween: null }
  };
  sideNavMenuData = [
    {
      title: "Markets",
      icon: NavMarketsIcon,
      route: MARKETS
    },
    {
      title: "Create",
      iconName: "nav-create-icon",
      icon: NavCreateIcon,
      route: CREATE_MARKET,
      requireLogin: true,
      disabled: this.props.universe.isForking
    },
    {
      title: "Portfolio",
      iconName: "nav-portfolio-icon",
      icon: NavPortfolioIcon,
      route: MY_POSITIONS,
      requireLogin: true
    },
    {
      title: "Reporting",
      iconName: "nav-reporting-icon",
      icon: NavReportingIcon,
      mobileClick: () =>
        this.props.updateMobileMenuState(MOBILE_MENU_STATES.FIRSTMENU_OPEN),
      route: REPORTING_DISPUTE_MARKETS
    },
    {
      title: "Account",
      iconName: "nav-account-icon",
      icon: NavAccountIcon,
      route: ACCOUNT_DEPOSIT,
      requireLogin: true
    },
    {
      title: "Logout",
      iconName: "nav-logout-icon",
      icon: NavLogoutIcon,
      mobileClick: () => this.props.logout(),
      route: ACCOUNT_DEPOSIT,
      requireLogin: true,
      onlyForMobile: true
    }
  ];

  // TODO: can we refactor this out or just remove it?
  shouldComponentUpdate = shouldComponentUpdatePure;

  componentWillMount() {
    const {
      augurNode,
      env,
      ethereumNodeHttp,
      ethereumNodeWs,
      history,
      initAugur,
      location,
      updateModal,
      useWeb3Transport,
      updateCurrentBasePath
    } = this.props;
    initAugur(
      history,
      {
        ...env,
        augurNode,
        ethereumNodeHttp,
        ethereumNodeWs,
        useWeb3Transport
      },
      (err: any, res: any) => {
        if (err || (res && !res.ethereumNode) || (res && !res.augurNode)) {
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
    if (currentPath === MARKETS) {
      const selectedCategory = parseQuery(location.search)[CATEGORY_PARAM_NAME];
      if (selectedCategory) this.toggleMenuTween(SUB_MENU, true, undefined);
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);

    // Restyle all scrollbars on windows
    if (isWindows()) {
      document.body.classList.add("App--windowsScrollBars");
    }
    this.checkIsMobile();
  }

  componentWillReceiveProps(nextProps: AppProps) {
    const {
      isMobile,
      location,
      universe,
      updateCurrentBasePath,
      updateMobileMenuState
    } = this.props;
    if (isMobile !== nextProps.isMobile) {
      updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
    }

    if (!isEqual(universe.isForking, nextProps.universe.isForking)) {
      this.sideNavMenuData[1].disabled = nextProps.universe.isForking;
    }

    if (!isEqual(location, nextProps.location)) {
      const lastBasePath = parsePath(location.pathname)[0];
      const nextBasePath = parsePath(nextProps.location.pathname)[0];

      const selectedCategory = parseQuery(nextProps.location.search)[
        CATEGORY_PARAM_NAME
      ];

      if (lastBasePath !== nextBasePath) {
        updateCurrentBasePath(nextBasePath);
        this.changeMenu(nextBasePath);
      }

      if (nextBasePath === MARKETS && selectedCategory) {
        this.toggleMenuTween(SUB_MENU, true, undefined);
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

  changeMenu(nextBasePath: any) {
    const { isLogged, sidebarStatus, updateCurrentInnerNavType } = this.props;
    const oldType = sidebarStatus.currentInnerNavType
      ? navTypes[sidebarStatus.currentBasePath]
      : sidebarStatus.currentInnerNavType;
    const newType = navTypes[nextBasePath];

    // Don't show mainMenu/subMenu for Account Summary
    if (newType === AccountInnerNav) {
      return this.toggleMenuTween(SUB_MENU, false, () =>
        this.toggleMenuTween(MAIN_MENU, false, undefined)
      );
    }

    if ((newType === AccountInnerNav && !isLogged) || oldType === newType) {
      return;
    }

    const openNewMenu = () => {
      updateCurrentInnerNavType(newType);
      if (newType) this.toggleMenuTween(MAIN_MENU, true, undefined);
    };

    if (!oldType) {
      openNewMenu();
      return;
    }

    const menuExitPromise = new Promise(resolve => {
      this.toggleMenuTween(MAIN_MENU, false, () => resolve());
    });
    const submenuExitPromise = new Promise(resolve => {
      this.toggleMenuTween(SUB_MENU, false, () => resolve());
    });

    Promise.all([menuExitPromise, submenuExitPromise]).then(() => {
      switch (nextBasePath) {
        case MARKETS:
        case MY_POSITIONS:
        case REPORTING_DISPUTE_MARKETS:
        case REPORTING_REPORT_MARKETS:
        case REPORTING_RESOLVED_MARKETS:
          openNewMenu();
          break;
        default:
          updateCurrentInnerNavType(newType);
          openNewMenu();
      }
    });
  }

  openSubMenu() {
    const { updateMobileMenuState } = this.props;
    updateMobileMenuState(MOBILE_MENU_STATES.SUBMENU_OPEN);
  }

  handleWindowResize() {
    this.checkIsMobile();
  }

  checkIsMobile() {
    const { updateIsMobile, updateIsMobileSmall } = this.props;
    // This method sets up the side bar's state + calls the method to attach the touch event handler for when a user is mobile
    // CSS breakpoint sets the value when a user is mobile
    const isMobile =
      (
        window
          .getComputedStyle(document.body)
          .getPropertyValue("--is-mobile") || ""
      ).indexOf("true") !== -1;
    const isMobileSmall =
      (
        window
          .getComputedStyle(document.body)
          .getPropertyValue("--is-mobile-small") || ""
      ).indexOf("true") !== -1;

    updateIsMobile(isMobile);
    updateIsMobileSmall(isMobileSmall);
  }

  toggleAlerts() {
    const { isLogged, sidebarStatus, updateIsAlertVisible } = this.props;
    if (isLogged) {
      updateIsAlertVisible(!sidebarStatus.isAlertsVisible);
    }
  }

  toggleMenuTween(menuKey: string, forceOpen: boolean, cb: Function | undefined) {
    const { [menuKey]: key } = this.state;
    if (getValue(key, "currentTween.stop")) key.currentTween.stop();

    let nowOpen = !key.open;
    if (typeof forceOpen === "boolean") nowOpen = forceOpen;

    const setMenuState = (newState: MenuStateItem) => {
      const { [menuKey]: oldKey } = this.state;
      this.setState({
        [menuKey]: {
          ...oldKey,
          ...newState
        }
      });
    };
    const alreadyDone =
      (!nowOpen && key.scalar === 0) || (nowOpen && key.scalar === 1);
    if (alreadyDone) {
      if (cb && typeof cb === "function") cb();
    } else {
      const baseMenuState = { open: nowOpen };
      const currentTween = tween({
        from: { value: key.scalar },
        to: { value: nowOpen ? 1 : 0 },
        duration: 500,
        easing: "easeOutQuad",
        step: (newState: any) => {
          setMenuState(
            Object.assign({}, baseMenuState, { scalar: newState.value })
          );
        }
      }).then(() => {
        if (cb && typeof cb === "function") cb();
        setMenuState({ locked: false, currentTween: null });
      });
      setMenuState({ currentTween });
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

    let icon = null;
    if (menuState === MOBILE_MENU_STATES.CLOSED)
      icon = <MobileNavHamburgerIcon />;
    else if (menuState === MOBILE_MENU_STATES.SIDEBAR_OPEN)
      icon = <MobileNavCloseIcon />;
    else if (menuState >= MOBILE_MENU_STATES.FIRSTMENU_OPEN)
      icon = <MobileNavBackIcon />;
    // remove back icon for markets on mobile
    if (
      sidebarStatus.currentBasePath === MARKETS &&
      menuState !== MOBILE_MENU_STATES.CLOSED
    )
      icon = <MobileNavCloseIcon />;

    return (
      <button
        type="button"
        className={Styles["SideBar__mobile-bars"]}
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
      loginAccount,
      modal,
      universe,
      finalizeMarket,
      sidebarStatus,
      updateMobileMenuState,
      alerts
    } = this.props;

    const { mainMenu, subMenu } = this.state;
    const { unseenCount } = alerts;
    const currentPath = parsePath(location.pathname)[0];
    const InnerNav = sidebarStatus.currentInnerNavType;
    let openSubMenu;
    if (InnerNav === MarketsInnerNavContainer) {
      openSubMenu = this.openSubMenu; // eslint-disable-line prefer-destructuring
    }

    let categoriesMargin;
    let tagsMargin;

    if (!isMobile) {
      if (currentPath === CREATE_MARKET && mainMenu.scalar === 1) {
        // NOTE -- quick patch ahead of larger refactor
        categoriesMargin = -110;
      } else {
        categoriesMargin = -110 + 110 * mainMenu.scalar;
      }

      tagsMargin = 110 * subMenu.scalar;
    }

    return (
      <main>
        <Helmet
          defaultTitle="Decentralized Prediction Markets | Augur"
          titleTemplate="%s | Augur"
        />
        {Object.keys(modal).length !== 0 && <Modal />}
        <div
          className={classNames(Styles.App, {
            [Styles[`App--blur`]]: Object.keys(modal).length !== 0
          })}
        >
          <section className={Styles.App__loadingIndicator} />
          <section
            className={Styles.SideBar}
            onClick={e => this.mainSectionClickHandler(e, false)}
            role="presentation"
          >
            <div className={Styles.Logo}>
              <Link to={makePath(DEFAULT_VIEW)}>
                <Logo />
              </Link>
            </div>
            {this.renderMobileMenuButton(unseenCount)}
            <SideNav
              defaultMobileClick={() =>
                updateMobileMenuState(MOBILE_MENU_STATES.CLOSED)
              }
              isMobile={isMobile}
              isLogged={isLogged}
              mobileShow={
                sidebarStatus.mobileMenuState ===
                MOBILE_MENU_STATES.SIDEBAR_OPEN
              }
              menuScalar={subMenu.scalar}
              menuData={this.sideNavMenuData}
              currentBasePath={sidebarStatus.currentBasePath}
            />
          </section>
          <section className={Styles.Main}>
            <section
              className={classNames(Styles.TopBar, Styles.TopBar__floatAbove)}
              onClick={this.mainSectionClickHandler}
              role="presentation"
            >
              <TopBar />
            </section>
            <AlertsContainer
              alertsVisible={isLogged && sidebarStatus.isAlertsVisible}
              toggleAlerts={() => this.toggleAlerts()}
            />
            {universe.forkEndTime &&
              universe.forkEndTime !== "0" &&
              blockchain &&
              blockchain.currentAugurTimestamp && (
                <section className={Styles.TopBar}>
                  <ForkingAlert
                    location={location}
                    universe={universe}
                    currentTime={blockchain.currentAugurTimestamp}
                    doesUserHaveRep={loginAccount.rep > 0}
                    marginLeft={tagsMargin}
                    finalizeMarket={finalizeMarket}
                  />
                </section>
              )}
            <section
              className={Styles.Main__wrap}
              style={{ marginLeft: categoriesMargin }}
            >
              {InnerNav && (
                <InnerNav
                  currentBasePath={sidebarStatus.currentBasePath}
                  isMobile={isMobile}
                  location={location}
                  history={history}
                  mobileMenuState={sidebarStatus.mobileMenuState}
                  mobileMenuClick={openSubMenu}
                  subMenuScalar={subMenu.scalar}
                  openSubMenu={this.openSubMenu}
                />
              )}
              {!InnerNav && <div className="no-nav-placehold" />}
              <section
                className={Styles.Main__content}
                style={{
                  marginLeft: tagsMargin
                }}
                onClick={this.mainSectionClickHandler}
                role="presentation"
              >
                <Routes />
              </section>
            </section>
          </section>
        </div>
      </main>
    );
  }
}
