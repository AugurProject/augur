import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Hammer from 'hammerjs';
import { Helmet } from 'react-helmet';

import Header from 'modules/app/components/header';
import Footer from 'modules/app/components/footer';
import SideBar from 'modules/app/components/side-bar';
import CoreStats from 'modules/app/components/core-stats';
// import Routes from 'modules/app/components/routes';
import ChatView from 'modules/chat/components/chat-view';
import SidebarMask from 'modules/common/components/side-bar-mask';

import makePath from 'modules/app/helpers/make-path';
import shouldComponentUpdatePure from 'utils/should-component-update-pure';
import handleScrollTop from 'utils/scroll-top-on-change';
import debounce from 'utils/debounce';
import getValue from 'utils/get-value';

import { CREATE_MARKET, MARKETS } from 'modules/app/constants/views';

export default class AppView extends Component {
  static propTypes = {
    url: PropTypes.string,
    history: PropTypes.any,
    children: PropTypes.node,
    currentPath: PropTypes.array.isRequired,
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
      isChatCollapsed: true,
      doScrollTop: false,
      currentRoute: null,
      footerPush: 0,
      isFooterCollapsed: true
    };

    this.shouldComponentUpdate = shouldComponentUpdatePure;

    this.toggleChat = this.toggleChat.bind(this);
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
  }

  componentWillUpdate(nextProps) {
    if (this.props.currentPath !== nextProps.currentPath) this.setSidebarAllowed(nextProps.currentPath);
  }

  componentDidUpdate() {
    handleScrollTop(this.props.url);
  }

  // Sidebar
  setSidebarAllowed(currentPath) {
    if (currentPath[0] === MARKETS) {
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

  // Chat
  toggleChat() {
    this.setState({ isChatCollapsed: !this.state.isChatCollapsed });
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

  render() {
    const p = this.props;
    const s = this.state;

    const navProps = {
      isLogged: p.isLogged,
      isSideBarAllowed: s.isSideBarAllowed,
      isSideBarCollapsed: s.isSideBarCollapsed,
      isSideBarPersistent: s.isSideBarPersistent,
      toggleSideBar: () => { this.toggleSideBar(); },
      marketsInfo: p.marketsHeader,
      portfolioTotals: getValue(p, 'portfolio.totals'),
      numFavorites: getValue(p, 'marketsHeader.numFavorites'),
      numPendingReports: getValue(p, 'marketsHeader.numPendingReports'),
      marketsLink: getValue(p, 'links.marketsLink'),
      allMarketsLink: getValue(p, 'links.allMarketsLink'),
      favoritesLink: getValue(p, 'links.favoritesLink'),
      pendingReportsLink: getValue(p, 'links.pendingReportsLink'),
      transactionsLink: getValue(p, 'links.transactionsLink'),
      authLink: getValue(p, 'links.authLink'),
      accountLink: getValue(p, 'links.accountLink'),
      myPositionsLink: getValue(p, 'links.myPositionsLink'),
      topicsLink: getValue(p, 'links.topicsLink'),
      notifications: p.notifications
    };

    const sideBarProps = {
      tags: p.tags,
      headerHeight: p.headerHeight,
      footerHeight: p.footerHeight
    };

    // NOTE -- A few implementation details:
    // An attention has been paid to avoid JS manipulation of app layout
    // As a result, you'll notice that both the `Header` + `CortStats` + `Footer` components are duplicated -- this is for layout purposes only in order to better preserve responsiveness w/out manual calculations
    // The duplicated components are `visibility: hidden` so that page flow is preserved since the actual elements are pulled from page flow via `position: fixed`
    return (
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
                    <SideBar {...sideBarProps} />
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
            {!s.isChatCollapsed &&
              <ChatView
                {...p.chat.augur}
                toggleChat={() => { this.toggleChat(); }}
              />
            }
            <button id="chat-button" onClick={() => { this.toggleChat(); }}>
              Chat
            </button>
            <Footer
              {...navProps}
              isFooterCollapsed={s.isFooterCollapsed}
              updateFooterHeight={p.updateFooterHeight}
              updateIsFooterCollapsed={this.updateIsFooterCollapsed}
            />
          </div>
        }
      </main>
    );
  }
}
