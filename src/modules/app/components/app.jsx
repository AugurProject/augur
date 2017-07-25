import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Hammer from 'hammerjs';

/*import Header from 'modules/app/components/header';
import Footer from 'modules/app/components/footer';
import SideBar from 'modules/app/components/side-bar';
import CoreStats from 'modules/app/components/core-stats';
import ChatView from 'modules/chat/components/chat-view';
import SidebarMask from 'modules/common/components/side-bar-mask';
*/
import Routes from 'modules/app/components/routes';

import TopBar from './new-top-bar';
import InnerNav from './new-inner-nav';
import SideNav from './new-side-nav';

//import { CREATE_MARKET } from 'modules/app/constants/views';

import shouldComponentUpdatePure from 'utils/should-component-update-pure';
import handleScrollTop from 'utils/scroll-top-on-change';
import debounce from 'utils/debounce';
import getValue from 'utils/get-value';

import { tween } from 'shifty';

export default class AppView extends Component {
  static propTypes = {
    url: PropTypes.string,
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
      isFooterCollapsed: true,
      mainMenu: { scalar: 0, open: false, currentTween: null },
      subMenu: { scalar: 0, open: false, currentTween: null }
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

  componentDidUpdate() {
    handleScrollTop(this.props.url);
  }

  // Sidebar
  setSidebarAllowed(isSideBarAllowed) {
    this.setState({ isSideBarAllowed });
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

  toggleMenuTween(menuKey, forceOpen, cb) {
    if (this.state[menuKey].currentTween) this.state[menuKey].currentTween.stop();

    let nowOpen = !this.state[menuKey].open;
    if (typeof(forceOpen) === 'boolean') nowOpen = forceOpen;

    const setMenuState = (newState) => this.setState({
      [menuKey]: Object.assign({}, this.state[menuKey], newState)
    });

    const baseMenuState = { open: nowOpen };
    const currentTween = tween({
      from: { value: this.state[menuKey].scalar },
      to: { value: (nowOpen ? 1 : 0) },
      duration: 500,
      easing: 'easeOutQuad',
      step: (newState) => {
        setMenuState(Object.assign({}, baseMenuState, { scalar: newState.value }));
      }
    }).then(
      () => {
        if (cb && typeof(cb) === 'function') cb();
        setMenuState({ locked: false, currentTween: null });
      }
    );
    setMenuState({ currentTween });
  }

  toggleMainMenu() {
    const { selectedTopic } = this.props;
    if (!this.state.mainMenu.open) {
      if (selectedTopic) this.toggleMenuTween('subMenu', true);
    } else {
      this.toggleMenuTween('subMenu', false);
    }
    this.toggleMenuTween('mainMenu');
  }

  render() {
    const p = this.props;
    const s = this.state;

    const navProps = {
      isLogged: p.isLogged,
      activeView: p.activeView,
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

    const innerNavProps = {
      topics: p.topics,
      selectedTopic: p.selectedTopic,
      tags: p.tags
    };

    const { mainMenu, subMenu } = this.state;

    return (
      <div className="app-wrap">
        <div className="side-wrap">
          <SideNav
            menuScalar={subMenu.scalar}
            menuData={[
              {
                title: 'Markets',
                iconKey: 'markets',
                onClick: () => this.toggleMainMenu(),
                onBlur: () => this.toggleMainMenu()
              },
              {
                title: 'Create',
                iconKey: 'create',
                onClick: () => {},
                onBlur: () => {}
              },
              {
                title: 'Portfolio',
                iconKey: 'portfolio',
                onClick: () => {},
                onBlur: () => {}
              },
              {
                title: 'Reporting',
                iconKey: 'reporting',
                onClick: () => {},
                onBlur: () => {}
              },
              {
                title: 'Account',
                iconKey: 'account',
                onClick: () => {},
                onBlur: () => {}
              },
            ]}
          />
        </div>
        <div className="main-wrap">
          <div className="topbar-row">
            <TopBar stats={p.coreStats} />
          </div>
          <div
            className="maincontent-row"
            style={{ marginLeft: (-110 + ((110 * mainMenu.scalar) | 0)) }}
          >
            <InnerNav
              subMenuScalar={subMenu.scalar}
              onSelectTopic={(...args) => {
                p.selectTopic(...args);
                if (!subMenu.open) this.toggleMenuTween('subMenu', true);
              }}
              {...innerNavProps}
            />
            <div
              className="maincontent"
              style={{ marginLeft: (110 * subMenu.scalar) | 0 }}
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
  }
}
