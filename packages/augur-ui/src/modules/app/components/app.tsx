// TODO -- this component needs to be broken up
import type { SDKConfiguration } from '@augurproject/artifacts';

import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router';
import isWindows from 'utils/is-windows';
import ModalView from "modules/modal/components/modal-view";
import TopBar from 'modules/app/components/top-bar';
import SideNav from 'modules/app/components/side-nav/side-nav';
import TopNav from 'modules/app/components/top-nav/top-nav';
import Routes from 'modules/routes/components/routes/routes';
import AlertsContainer from 'modules/alerts/components/alerts-view';
import ToastsContainer from 'modules/alerts/components/toasts-view';

import { Betslip } from 'modules/trading/betslip';
import { BetslipProvider } from 'modules/trading/store/betslip';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { initAugur } from 'modules/app/actions/init-augur';

import { MobileNavHamburgerIcon, XIcon } from 'modules/common/icons';
import {
  ACCOUNT_SUMMARY,
  CREATE_MARKET,
  DISPUTING,
  MARKET,
  MARKETS,
  MY_POSITIONS,
  REPORTING,
} from 'modules/routes/constants/views';
import makePath from 'modules/routes/helpers/make-path';
import parsePath from 'modules/routes/helpers/parse-path';
import {
  MODAL_NETWORK_CONNECT,
  MOBILE_MENU_STATES,
  TRADING_TUTORIAL,
  THEMES,
  MODAL_ERROR,
} from 'modules/common/constants';
import Styles from 'modules/app/components/app.styles.less';
import MarketsInnerNav from 'modules/app/components/inner-nav/base-inner-nav-pure';
import ForkingBanner from 'modules/reporting/forking-banner';
import parseQuery, { parseLocation } from 'modules/routes/helpers/parse-query';
import {
  MARKET_ID_PARAM_NAME,
  AFFILIATE_NAME,
} from 'modules/routes/constants/param-names';
import { ExternalLinkText } from 'modules/common/buttons';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { APP_HEAD_TAGS } from 'modules/seo/helmet-configs';
import { MyBetsInnerNav } from 'modules/portfolio/components/common/my-bets-inner-nav';
import { MyBetsProvider } from 'modules/portfolio/store/my-bets';
import { StatusErrorMessage } from 'modules/common/labels';
import { MarketsProvider } from 'modules/markets/store/markets';
import isAddress from 'modules/auth/helpers/is-address';
import { getNotifications } from 'modules/notifications/selectors/notification-state';
import { withRouter } from 'react-router-dom';
import { RewriteUrlParams } from '../hocs/rewrite-url-params/index';
import { windowRef } from 'utils/window-ref';
import { SideImages } from 'modules/trading/common';

interface AppProps {
  config: SDKConfiguration;
  location: Location;
  ethereumNodeHttp: string;
  ethereumNodeWs: string;
  sdkEndpoint: string;
}

function renderMobileMenuButton(
  mobileMenuState,
  setMobileMenuState,
  cbForMobileClick = () => {}
) {
  let icon: any = null;
  if (mobileMenuState === MOBILE_MENU_STATES.CLOSED) {
    icon = <MobileNavHamburgerIcon />;
  } else {
    if (mobileMenuState === MOBILE_MENU_STATES.FIRSTMENU_OPEN) {
      icon = null;
    } else {
      return <div />;
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
            setMobileMenuState(MOBILE_MENU_STATES.SIDEBAR_OPEN);
            break;
          default:
            setMobileMenuState(mobileMenuState - 1);
            break;
        }
      }}
    >
      {icon}
    </button>
  );
}

function checkIsMobile(setIsMobile) {
  // This method sets up the side bar's state + calls the method to attach the touch event handler for when a user is mobile
  // CSS breakpoint sets the value when a user is mobile
  const isMobile =
    (
      window.getComputedStyle(document.body).getPropertyValue('--is-mobile') ||
      ''
    ).indexOf('true') !== -1;
  setIsMobile(isMobile);
}

const AppView = ({
  ethereumNodeHttp = null,
  ethereumNodeWs = null,
  sdkEndpoint = null,
  location: locationProp,
}: AppProps) => {
  const {
    universe: { forkEndTime, forkingInfo },
    blockchain: { currentAugurTimestamp },
    mobileMenuState,
    modal,
    env,
    isMobile,
    betslipMinimized,
    actions: {
      setIsMobile,
      setMobileMenuState,
      setCurrentBasePath,
      setModal,
      updateLoginAccount,
    },
  } = useAppStatusStore();
  const notifications = getNotifications();
  const history = useHistory();
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
      title: 'Account Summary',
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
      {
        ...env,
        ethereumNodeHttp,
        ethereumNodeWs,
        sdkEndpoint,
      },
      (error: any, res: any) => {
        if (error) {
          setModal({
            type: MODAL_ERROR,
            error,
            config: res.config,
          });
        }
      }
    );
    // we only want this to run the first mount, so we set the things to look at to a static value.
  }, [false]);

  useEffect(() => {
    function handleRezize() {
      checkIsMobile(setIsMobile);
    }
    window.addEventListener('resize', handleRezize);
    if (isWindows()) {
      document.body.classList.add('App--windowsScrollBars');
    }
    checkIsMobile(setIsMobile);
    return () => {
      window.removeEventListener('resize', handleRezize);
    };
  }, []);

  useEffect(() => {
    // weirdly location and the passed location prop are both needed, this uses the standard location object.
    const affiliate = parseLocation(location.href)[AFFILIATE_NAME];
    if (affiliate && isAddress(affiliate)) {
      updateLoginAccount({ affiliate });
    }
  }, [location]);

  useEffect(() => {
    if (mobileMenuState !== MOBILE_MENU_STATES.CLOSED && !isMobile) {
      // make sure to close sidenav if we aren't in mobile view.
      setMobileMenuState(MOBILE_MENU_STATES.CLOSED);
    }
    if (!betslipMinimized) {
      window.scrollTo(0, 0);
    }
    setCurrentBasePath(currentPath);
    if (mobileMenuState === MOBILE_MENU_STATES.FIRSTMENU_OPEN || !betslipMinimized) {
      document.body.classList.add('App--noScroll');
    } else {
      document.body.classList.remove('App--noScroll');
    }
  }, [mobileMenuState, isMobile, currentPath, betslipMinimized]);

  function mainSectionClickHandler(e: any, testSideNav = true) {
    if (
      testSideNav &&
      isMobile &&
      mobileMenuState !== MOBILE_MENU_STATES.CLOSED
    ) {
      setMobileMenuState(MOBILE_MENU_STATES.CLOSED);
    }
  }

  return (
    <main>
      <HelmetTag {...APP_HEAD_TAGS} />
      {ModalShowing && <ModalView />}
      <ToastsContainer onTradingTutorial={onTradingTutorial} />
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
            renderMobileMenuButton={renderMobileMenuButton}
            mainSectionClickHandler={mainSectionClickHandler}
            navShowing={navShowing}
            sideNavMenuData={sideNavMenuData}
          />
          <AlertsContainer />
          {forkEndTime !== '0' &&
            currentAugurTimestamp &&
            currentPath !== ACCOUNT_SUMMARY && (
              <section className={Styles.TopBar} />
            )}
          <section
            className={classNames(Styles.Wrap, {
              [Styles.WrapMarkets]: currentPath === MARKETS,
              [Styles.TopBarOpen]: navShowing,
            })}
          >
            {currentPath === MARKETS && <MarketsInnerNav />}
            <MyBetsProvider>
              {currentPath === MY_POSITIONS && <MyBetsInnerNav />}
              {currentPath !== MARKETS && currentPath !== MY_POSITIONS && (
                <div className="no-nav-placehold" />
              )}
              <MainAppContent
                onTradingTutorial={onTradingTutorial}
                ModalShowing={ModalShowing}
                navShowing={navShowing}
                currentPath={currentPath}
                mainSectionClickHandler={mainSectionClickHandler}
              />
            </MyBetsProvider>
          </section>
        </section>
      </div>
    </main>
  );
};

export default withRouter(RewriteUrlParams(windowRef, AppView));

const SideBarSection = ({
  renderMobileMenuButton,
  mainSectionClickHandler,
  navShowing,
  sideNavMenuData,
}) => {
  const {
    mobileMenuState,
    isLogged,
    restoredAccount,
    theme,
    actions: { closeAppMenus, setMobileMenuState },
  } = useAppStatusStore();
  sideNavMenuData[1].title =
    theme !== THEMES.TRADING ? 'My Account' : 'Account Summary';
  sideNavMenuData[2].title = theme !== THEMES.TRADING ? 'My Bets' : 'Portfolio';

  return (
    <section
      className={Styles.SideBar}
      onClick={e => {
        mainSectionClickHandler(e, false);
        closeAppMenus();
      }}
      role="presentation"
    >
      <div>
        {renderMobileMenuButton(
          mobileMenuState,
          setMobileMenuState,
          closeAppMenus
        )}
      </div>
      {/* HIDDEN ON DESKTOP */}
      <SideNav
        showNav={navShowing}
        isLogged={isLogged || restoredAccount}
        menuData={sideNavMenuData}
      />
      {/* HIDDEN ON MOBILE */}
      <TopNav
        isLogged={isLogged || restoredAccount}
        menuData={sideNavMenuData}
      />
    </section>
  );
};

const MainAppContent = ({
  onTradingTutorial,
  ModalShowing,
  navShowing,
  currentPath,
  mainSectionClickHandler,
}) => {
  const {
    isLogged,
    restoredAccount,
    actions: { closeAppMenus },
  } = useAppStatusStore();
  const hideBetslip = !currentPath?.includes(MARKET);
  return (
    <section
      className={classNames(Styles.Content, {
        [Styles.Tutorial]: onTradingTutorial,
        [Styles.ModalShowing]: ModalShowing,
        [Styles.SideNavOpen]: navShowing,
        [Styles.HideBetslip]: hideBetslip,
      })}
      onClick={e => {
        mainSectionClickHandler(e);
        closeAppMenus();
      }}
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
        <MarketsProvider>
          <ForkingBanner />
          <Routes isLogged={isLogged || restoredAccount} />
          <div className={Styles.Betslip}>
            <Betslip />
            <SideImages />
          </div>
          <StatusErrorMessage />
        </MarketsProvider>
      </BetslipProvider>
    </section>
  );
};
