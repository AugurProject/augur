import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Hammer from 'hammerjs';
import { Helmet } from 'react-helmet';

/*import Header from 'modules/app/components/header';
import Footer from 'modules/app/components/footer';
import SideBar from 'modules/app/components/side-bar';
import CoreStats from 'modules/app/components/core-stats';
import Routes from 'modules/app/components/routes';
import SidebarMask from 'modules/common/components/side-bar-mask';
*/
import Routes from 'modules/app/components/routes';

import TopBar from './new-top-bar';
import InnerNav from './new-inner-nav';
import SideNav from './new-side-nav';

import shouldComponentUpdatePure from 'utils/should-component-update-pure';
import handleScrollTop from 'utils/scroll-top-on-change';
import debounce from 'utils/debounce';
import getValue from 'utils/get-value';
import parsePath from 'modules/app/helpers/parse-path';

import { CREATE_MARKET, MARKETS, FAVORITES } from 'modules/app/constants/views';

import { tween } from 'shifty';

export default class AppView extends Component {
  static propTypes = {
    url: PropTypes.string,
    children: PropTypes.node,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    marketsFilteredSorted: PropTypes.array.isRequired,
    // tags: PropTypes.array.isRequired,
    // coreStats: PropTypes.array.isRequired,
    // isMobile: PropTypes.bool.isRequired,
    updateIsMobile: PropTypes.func.isRequired,
    // headerHeight: PropTypes.number.isRequired,
    // footerHeight: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isSideBarAllowed: false,
      isSideBarCollapsed: false,
      isSideBarPersistent: true,
      doScrollTop: false,
      currentRoute: null,
      footerPush: 0,
      isFooterCollapsed: true,
      mainMenu: { scalar: 0, open: false, locked: false },
      subMenu: { scalar: 0, open: false, locked: false }
    };

    this.shouldComponentUpdate = shouldComponentUpdatePure;

    this.setSidebarAllowed = this.setSidebarAllowed.bind(this);
    this.attachTouchHandler = this.attachTouchHandler.bind(this);
    this.handleSwipeEvent = this.handleSwipeEvent.bind(this);
    this.handleWindowScroll = debounce(this.handleWindowScroll.bind(this));
    this.handleWindowResize = debounce(this.handleWindowResize.bind(this));
    this.updateIsFooterCollapsed = this.updateIsFooterCollapsed.bind(this);
    this.checkIfMobile = this.checkIfMobile.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleWindowScroll);
    window.addEventListener('resize', this.handleWindowResize);

    this.checkIfMobile();
    this.setSidebarAllowed(this.props.location);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) this.setSidebarAllowed(nextProps.location);
  }

  componentDidUpdate() {
    handleScrollTop(this.props.url);
  }

  // Sidebar
  setSidebarAllowed(location) {
    const path = parsePath(location.pathname)[0];

    if (path === MARKETS || path === FAVORITES) {
      this.setState({ isSideBarAllowed: true });
    } else {
      this.setState({ isSideBarAllowed: false });
    }
  }

  toggleSideBar() {
    this.setState({ isSideBarCollapsed: !this.state.isSideBarCollapsed });
  }

  //	Footer
  updateIsFooterCollapsed(isFooterCollapsed) {
    this.setState({ isFooterCollapsed });
  }

  handleWindowScroll() {
    if (!this.state.isFooterCollapsed) {
      this.updateIsFooterCollapsed(true);
    }
  }

  handleWindowResize() {
    this.checkIfMobile();
  }

  checkIfMobile() {
    // This method sets up the side bar's state + calls the method to attach the touch event handler for when a user is mobile
    // CSS breakpoint sets the value when a user is mobile
    const isMobile = window.getComputedStyle(document.body).getPropertyValue('--is-mobile').indexOf('true') !== -1;

    this.props.updateIsMobile(isMobile);

    if (isMobile) {
      this.setState({
        isSideBarCollapsed: true,
        isSideBarPersistent: false
      });
      this.attachTouchHandler();
    } else {
      this.setState({
        isSideBarCollapsed: false,
        isSideBarPersistent: true
      });
    }
  }

  // Touch Events
  attachTouchHandler() {
    delete Hammer.defaults.cssProps.userSelect; // Allows for text selection

    const options = {
      dragLockToAxis: true,
      dragBlockHorizontal: true,
      preventDefault: true
    };

    const hammer = new Hammer(this.main, options);

    hammer.on('swipe', (e) => { this.handleSwipeEvent(e); });
  }

  handleSwipeEvent(swipe) {
    if (this.state.isSideBarAllowed && !this.state.isSideBarPersistent) {
      if (swipe.deltaX > 0) {
        this.setState({ isSideBarCollapsed: false });
      } else {
        this.setState({ isSideBarCollapsed: true });
      }
    }
  }

  toggleMenuTween(menuKey, forceOpen, cb) {
    let nowOpen = !this.state[menuKey].open;
    if (typeof(forceOpen) === 'boolean') nowOpen = forceOpen;

    const setMenuState =  (newState) => this.setState({
        [menuKey]: Object.assign({}, this.state[menuKey], newState)
    });

    const baseMenuState = { open: nowOpen, locked: true };
    tween({
      from: { value: this.state[menuKey].scalar },
      to: { value: (nowOpen ? 1 : 0) },
      duration: 500,
      easing: "easeOutQuad",
      step: (newState) => setMenuState(Object.assign({}, baseMenuState, { scalar: newState.value }))
    }).then(
      () => {
        if (cb && typeof(cb) === 'function') cb();
        setMenuState({ locked: false });
      }
    );
  }

  toggleMainMenu() {
    if (!this.state.mainMenu.locked) {
      if (this.state.mainMenu.open) this.toggleMenuTween('subMenu', false);
      this.toggleMenuTween('mainMenu');
    }
  }

  cycleSubMenu(menuSwitchCb) {
    if (!this.state.subMenu.locked) {
      const openNewMenu = () => {
        const reopen = menuSwitchCb();
        if (reopen) this.toggleMenuTween('subMenu', true);
      };

      if (this.state.subMenu.open) {
        this.toggleMenuTween('subMenu', false, () => {
          openNewMenu();
        });
      } else {
        openNewMenu();
      }
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    const navProps = {
      isLogged: p.isLogged,
      isSideBarAllowed: s.isSideBarAllowed,
      isSideBarCollapsed: s.isSideBarCollapsed,
      isSideBarPersistent: s.isSideBarPersistent,
      toggleSideBar: () => { this.toggleSideBar(); },
      activeView: p.activeView,
      marketsInfo: p.marketsHeader,
      portfolioTotals: getValue(p, 'portfolio.totals'),
      numFavorites: getValue(p, 'marketsHeader.numFavorites'),
      numPendingReports: getValue(p, 'marketsHeader.numPendingReports'),
      notifications: p.notifications
    };

    const innerNavProps = {
      topics: p.topics,
      tags: p.tags
    };


    const { mainMenu, subMenu } = this.state;

    return (
      <div className='app-wrap'>
        <div className='side-wrap'>
          <SideNav
            onClick={() => this.toggleMainMenu()}
            menuScalar={subMenu.scalar}
          />
        </div>
        <div className='main-wrap'>
          <div className='topbar-row'>
            <TopBar />
          </div>
          <div
            className='maincontent-row'
            style={{ marginLeft: (-110 + (110 * mainMenu.scalar)) }}
          >
            <InnerNav
              onCycleSubMenu={(menuSwitchCb) => this.cycleSubMenu(menuSwitchCb)}
              subMenuOpen={subMenu.open}
              subMenuScalar={subMenu.scalar}
              menuData={p.topics}
            />
            <div
              className='maincontent'
              style={{ paddingLeft: (-110 + (110 * subMenu.scalar)) }}
            >
              {/* TODO: remove sidebar-related stuff from Routes */}
              <Routes
                activeView={p.activeView}
                isSideBarAllowed={s.isSideBarAllowed}
                setSidebarAllowed={this.setSidebarAllowed}
              />
            </div>
          </div>
        </div>
      </div>
    );

    // NOTE -- A few implementation details:
    // An attention has been paid to avoid JS manipulation of app layout
    // As a result, you'll notice that both the `Header` + `CortStats` + `Footer` components are duplicated -- this is for layout purposes only in order to better preserve responsiveness w/out manual calculations
    // The duplicated components are `visibility: hidden` so that page flow is preserved since the actual elements are pulled from page flow via `position: fixed`
    /*return (
      <main id="main_responsive_state" ref={(main) => { this.main = main; }}>
        <Helmet
          defaultTitle="Decentralized Prediction Markets | Augur"
          titleTemplate="%s | Augur"
        />
        {p &&
          <div id="app_container" >
            {s.isSideBarAllowed && !s.isSideBarCollapsed &&
              <SidebarMask
                style={{
                  top: p.headerHeight,
                  bottom: p.footerHeight
                }}
              />
            }
            <div id="app_header">
              <Header
                {...navProps}
                updateHeaderHeight={p.updateHeaderHeight}
              />
              <div className={classNames('sub-header', { 'logged-out': !p.isLogged })} >
                {s.isSideBarAllowed && !s.isSideBarCollapsed &&
                  <div className="core-stats-bumper" />
                }
                {p.isLogged &&
                  <CoreStats
                    coreStats={p.coreStats}
                    location={p.location}
                  />
                }
              </div>
            </div>
            <div id="app_views" >
              <Header {...navProps} />
              <div id="app_view_container">
                {s.isSideBarAllowed && !s.isSideBarCollapsed &&
                  <div id="side_bar" >
                    <SideBar
                      markets={p.markets}
                      marketsFilteredSorted={p.marketsFilteredSorted}
                      headerHeight={p.headerHeight}
                      footerHeight={p.footerHeight}
                      location={p.location}
                      history={p.history}
                    />
                  </div>
                }
                <div id="app_view">
                  {s.isSideBarAllowed && !s.isSideBarCollapsed &&
                    <div className="core-stats-bumper" />
                  }
                  <div className={classNames('sub-header', { 'logged-out': !p.isLogged })} >
                    {p.isLogged &&
                      <CoreStats
                        coreStats={p.coreStats}
                        location={p.location}
                      />
                    }
                  </div>
                  {p.children}
                  {p.location.pathname !== makePath(CREATE_MARKET) &&
                    <Footer {...navProps} />
                  }
                </div>
              </div>
            </div>
            <Footer
              {...navProps}
              isFooterCollapsed={s.isFooterCollapsed}
              updateFooterHeight={p.updateFooterHeight}
              updateIsFooterCollapsed={this.updateIsFooterCollapsed}
            />
          </div>
        }
      </main>
    );*/
  }
}
