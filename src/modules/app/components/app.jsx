import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Hammer from 'hammerjs';
import { Helmet } from 'react-helmet';
import Routes from 'modules/app/components/routes';

import shouldComponentUpdatePure from 'utils/should-component-update-pure';
import debounce from 'utils/debounce';

import { tween } from 'shifty';

import TopBar from './new-top-bar';
import InnerNav from './new-inner-nav';
import SideNav from './new-side-nav';
import Origami from './origami-svg';
import Logo from './logo';

export const mobileMenuStates = {
  CLOSED: 0,
  SIDEBAR_OPEN: 1,
  TOPICS_OPEN: 2,
  TAGS_OPEN: 3
};

export default class AppView extends Component {
  static propTypes = {
    url: PropTypes.string,
    tags: PropTypes.array.isRequired,
    coreStats: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
    updateIsMobile: PropTypes.func.isRequired,
    selectedTopic: PropTypes.string
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
      mainMenu: { scalar: 0, open: false, currentTween: null },
      subMenu: { scalar: 0, open: false, currentTween: null },
      mobileMenuState: mobileMenuStates.CLOSED
    };

    this.shouldComponentUpdate = shouldComponentUpdatePure;

    this.handleWindowResize = debounce(this.handleWindowResize.bind(this));
    this.checkIfMobile = this.checkIfMobile.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);

    this.checkIfMobile();
    this.setSidebarAllowed(this.props.location);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) this.setSidebarAllowed(nextProps.location);
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
    } else {
      this.setState({
        isSideBarCollapsed: false,
        isSideBarPersistent: true
      });
    }
  }

  toggleMenuTween(menuKey, forceOpen, cb) {
    if (this.state[menuKey].currentTween) this.state[menuKey].currentTween.stop();

    let nowOpen = !this.state[menuKey].open;
    if ((typeof forceOpen) === 'boolean') nowOpen = forceOpen;

    const setMenuState = (newState) => {
      this.setState({
        [menuKey]: Object.assign({}, this.state[menuKey], newState)
      });
    };

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
        if (cb && (typeof cb) === 'function') cb();
        setMenuState({ locked: false, currentTween: null });
      }
    );
    setMenuState({ currentTween });
  }

  mobileMenuButtonClick() {
    const menuState = this.state.mobileMenuState;
    switch (menuState) {
      case mobileMenuStates.CLOSED:
        this.setState({ mobileMenuState: mobileMenuStates.SIDEBAR_OPEN });
        break;
      default:
        this.setState({ mobileMenuState: menuState - 1 });
        break;
    }
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

  renderMobileMenuButton() {
    const menuState = this.state.mobileMenuState;

    let iconKey = '';
    if (menuState === mobileMenuStates.CLOSED) iconKey = 'mobile_nav_hamburger';
    else if (menuState === mobileMenuStates.SIDEBAR_OPEN) iconKey = 'mobile_nav_close';
    else if (menuState >= mobileMenuStates.TOPICS_OPEN) iconKey = 'mobile_nav_back';

    const iconSVGURL = `../../assets/images/${iconKey}.svg`;

    return (
      <button
        className="mobileMenuNavButton"
        onClick={() => this.mobileMenuButtonClick()}
      >
        <img alt={iconKey} src={iconSVGURL} />
      </button>
    );
  }

  render() {
    const p = this.props;
    const s = this.state;

    const innerNavProps = {
      topics: p.topics,
      selectedTopic: p.selectedTopic,
      tags: p.tags
    };

    const { mainMenu, subMenu } = this.state;

    let marketsMargin;
    let tagsMargin;

    if (!p.isMobile) {
      marketsMargin = -110 + (110 * mainMenu.scalar);
      tagsMargin = 110 * subMenu.scalar;
    }

    return (
      <div className="app-wrap">
        <div className="side-wrap">
          <Origami
            isMobile={p.isMobile}
            menuScalar={mainMenu.scalar}
          />
          <Logo />
          {this.renderMobileMenuButton()}
          <SideNav
            isMobile={p.isMobile}
            mobileShow={s.mobileMenuState === mobileMenuStates.SIDEBAR_OPEN}
            menuScalar={subMenu.scalar}
            menuData={[
              {
                title: 'Markets',
                iconKey: 'markets',
                onClick: () => {
                  if (p.isMobile) {
                    this.setState({ mobileMenuState: mobileMenuStates.TOPICS_OPEN });
                  } else {
                    this.toggleMainMenu();
                  }
                },
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
            <TopBar
              isMobile={p.isMobile}
              stats={p.coreStats}
            />
          </div>
          <div
            className="maincontent-row"
            style={{ marginLeft: marketsMargin }}
          >
            <InnerNav
              isMobile={p.isMobile}
              mobileMenuState={s.mobileMenuState}
              subMenuScalar={subMenu.scalar}
              onSelectTopic={(...args) => {
                p.selectTopic(...args);
                if (!p.isMobile && !subMenu.open) this.toggleMenuTween('subMenu', true);
                if (p.isMobile) this.setState({ mobileMenuState: mobileMenuStates.TAGS_OPEN });
              }}
              {...innerNavProps}
            />
            <div
              className="maincontent"
              style={{ marginLeft: tagsMargin }}
            >
              <Routes
                activeView={p.activeView}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
