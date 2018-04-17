// TODO -- this component needs to be broken up
//         all logic related to sidebar(s) need to be housed w/in a separate component

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import shouldComponentUpdatePure from 'utils/should-component-update-pure'
import debounce from 'utils/debounce'

import { tween } from 'shifty'
import { isEqual } from 'lodash'

import Modal from 'modules/modal/containers/modal-view'
import TopBar from 'modules/app/components/top-bar/top-bar'
import ForkingNotification from 'modules/forking/components/forking-notification/forking-notification'
import MarketsInnerNav from 'modules/app/components/inner-nav/markets-inner-nav'
import PortfolioInnerNav from 'modules/app/components/inner-nav/portfolio-inner-nav'
import AccountInnerNav from 'modules/app/components/inner-nav/account-inner-nav'
import ReportingInnerNav from 'modules/app/components/inner-nav/reporting-inner-nav'
import SideNav from 'modules/app/components/side-nav/side-nav'
import Origami from 'modules/app/components/origami-svg/origami-svg'
import Logo from 'modules/app/components/logo/logo'
import Routes from 'modules/routes/components/routes/routes'
import NotificationsContainer from 'modules/notifications/container'

import MobileNavHamburgerIcon from 'modules/common/components/mobile-nav-hamburger-icon'
import MobileNavCloseIcon from 'modules/common/components/mobile-nav-close-icon'
import MobileNavBackIcon from 'modules/common/components/mobile-nav-back-icon'

import NavAccountIcon from 'modules/common/components/nav-account-icon'
import NavCreateIcon from 'modules/common/components/nav-create-icon'
import NavMarketsIcon from 'modules/common/components/nav-markets-icon'
import NavPortfolioIcon from 'modules/common/components/nav-portfolio-icon'
import { AlertCircle, NavReportingIcon } from 'modules/common/components/icons'

import parsePath from 'modules/routes/helpers/parse-path'
import makePath from 'modules/routes/helpers/make-path'
import parseQuery from 'modules/routes/helpers/parse-query'

import getValue from 'utils/get-value'

import { MARKETS, ACCOUNT_DEPOSIT, ACCOUNT_WITHDRAW, ACCOUNT_REP_FAUCET, ACCOUNT_UNIVERSES, MY_MARKETS, MY_POSITIONS, FAVORITES, PORTFOLIO_TRANSACTIONS, PORTFOLIO_REPORTS, CREATE_MARKET, CATEGORIES, REPORTING_DISPUTE_MARKETS, REPORTING_REPORT_MARKETS, REPORTING_RESOLVED_MARKETS, AUTHENTICATION } from 'modules/routes/constants/views'
import { MODAL_NETWORK_CONNECT } from 'modules/modal/constants/modal-types'
import { CATEGORY_PARAM_NAME } from 'modules/filter-sort/constants/param-names'

import Styles from 'modules/app/components/app/app.styles'

export const mobileMenuStates = {
  CLOSED: 0,
  SIDEBAR_OPEN: 1,
  FIRSTMENU_OPEN: 2,
  SUBMENU_OPEN: 3,
}

const SUB_MENU = 'subMenu'
const MAIN_MENU = 'mainMenu'

const navTypes = {
  [MARKETS]: MarketsInnerNav,
  [MY_MARKETS]: PortfolioInnerNav,
  [MY_POSITIONS]: PortfolioInnerNav,
  [FAVORITES]: PortfolioInnerNav,
  [PORTFOLIO_TRANSACTIONS]: PortfolioInnerNav,
  [PORTFOLIO_REPORTS]: PortfolioInnerNav,
  [ACCOUNT_DEPOSIT]: AccountInnerNav,
  [ACCOUNT_WITHDRAW]: AccountInnerNav,
  [ACCOUNT_REP_FAUCET]: AccountInnerNav,
  [ACCOUNT_UNIVERSES]: AccountInnerNav,
  [REPORTING_DISPUTE_MARKETS]: ReportingInnerNav,
  [REPORTING_REPORT_MARKETS]: ReportingInnerNav,
  [REPORTING_RESOLVED_MARKETS]: ReportingInnerNav,
}

export default class AppView extends Component {
  static propTypes = {
    blockchain: PropTypes.object.isRequired,
    categories: PropTypes.any,
    connection: PropTypes.object.isRequired,
    coreStats: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    initAugur: PropTypes.func.isRequired,
    isLogged: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isMobileSmall: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    loginAccount: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    marketsFilteredSorted: PropTypes.array,
    modal: PropTypes.object.isRequired,
    selectedCategory: PropTypes.string,
    universe: PropTypes.object.isRequired,
    updateIsMobile: PropTypes.func.isRequired,
    updateIsMobileSmall: PropTypes.func.isRequired,
    updateModal: PropTypes.func.isRequired,
    url: PropTypes.string,
    isLoading: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      mainMenu: { scalar: 0, open: false, currentTween: null },
      subMenu: { scalar: 0, open: false, currentTween: null },
      mobileMenuState: mobileMenuStates.CLOSED,
      currentBasePath: null,
      currentInnerNavType: null,
      isNotificationsVisible: false,
    }

    this.sideNavMenuData = [
      {
        title: 'Markets',
        icon: NavMarketsIcon,
        mobileClick: () => this.setState({ mobileMenuState: mobileMenuStates.FIRSTMENU_OPEN }),
        route: MARKETS,
      },
      {
        title: 'Create',
        iconName: 'nav-create-icon',
        icon: NavCreateIcon,
        route: CREATE_MARKET,
        requireLogin: true,
        disabled: this.props.universe.isForking,
      },
      {
        title: 'Portfolio',
        iconName: 'nav-portfolio-icon',
        icon: NavPortfolioIcon,
        mobileClick: () => this.setState({ mobileMenuState: mobileMenuStates.FIRSTMENU_OPEN }),
        route: MY_POSITIONS,
        requireLogin: true,
      },
      {
        title: 'Reporting',
        iconName: 'nav-reporting-icon',
        icon: NavReportingIcon,
        mobileClick: () => this.setState({ mobileMenuState: mobileMenuStates.FIRSTMENU_OPEN }),
        route: REPORTING_REPORT_MARKETS,
        requireLogin: true,
      },
      {
        title: 'Account',
        iconName: 'nav-account-icon',
        icon: NavAccountIcon,
        mobileClick: () => this.setState({ mobileMenuState: mobileMenuStates.FIRSTMENU_OPEN }),
        route: ACCOUNT_DEPOSIT,
      },
    ]

    this.shouldComponentUpdate = shouldComponentUpdatePure

    this.handleWindowResize = debounce(this.handleWindowResize.bind(this))
    this.checkIsMobile = this.checkIsMobile.bind(this)
    this.toggleNotifications = this.toggleNotifications.bind(this)
  }

  componentWillMount() {
    const {
      history,
      initAugur,
      location,
      updateModal,
    } = this.props
    initAugur(history, (err, res) => {
      if (err || (res && !res.ethereumNode) || (res && !res.augurNode)) {
        updateModal({
          type: MODAL_NETWORK_CONNECT,
          isInitialConnection: true,
        })
      }
    })

    const currentPath = parsePath(location.pathname)[0]
    this.setState({ currentBasePath: currentPath })

    this.changeMenu(currentPath)
    if (currentPath === MARKETS) {
      const selectedCategory = parseQuery(location.search)[CATEGORY_PARAM_NAME]
      if (selectedCategory) this.toggleMenuTween(SUB_MENU, true)
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize)

    this.checkIsMobile()
  }

  componentWillReceiveProps(nextProps) {
    const {
      isMobile,
      location,
      universe,
    } = this.props
    if (isMobile !== nextProps.isMobile) {
      this.setState({
        mobileMenuState: mobileMenuStates.CLOSED,
      })
    }

    if (!isEqual(universe.isForking, nextProps.universe.isForking)) {
      this.sideNavMenuData[1].disabled = nextProps.universe.isForking
    }

    if (!isEqual(location, nextProps.location)) {
      const lastBasePath = parsePath(location.pathname)[0]
      const nextBasePath = parsePath(nextProps.location.pathname)[0]

      const selectedCategory = parseQuery(nextProps.location.search)[CATEGORY_PARAM_NAME]

      if (lastBasePath !== nextBasePath) {
        this.setState({ currentBasePath: nextBasePath })
        this.changeMenu(nextBasePath)
      }

      if (nextBasePath === MARKETS && selectedCategory) {
        this.toggleMenuTween(SUB_MENU, true)
      }
    }
  }

  changeMenu(nextBasePath) {
    const { isLogged } = this.props
    const oldType = this.state.currentInnerNavType
    const newType = navTypes[nextBasePath]

    if (
      (newType === AccountInnerNav && !isLogged) ||
      oldType === newType
    ) {
      return
    }

    const openNewMenu = () => {
      this.setState({ currentInnerNavType: newType })
      if (newType) this.toggleMenuTween(MAIN_MENU, true)
    }

    if (!oldType) {
      openNewMenu()
      return
    }

    const menuExitPromise = new Promise((resolve) => {
      this.toggleMenuTween(MAIN_MENU, false, () => resolve())
    })
    const submenuExitPromise = new Promise((resolve) => {
      this.toggleMenuTween(SUB_MENU, false, () => resolve())
    })

    Promise.all([menuExitPromise, submenuExitPromise]).then(() => {
      switch (nextBasePath) {
        case MARKETS:
        case MY_MARKETS:
        case MY_POSITIONS:
        case FAVORITES:
        case ACCOUNT_DEPOSIT:
        case ACCOUNT_WITHDRAW:
        case ACCOUNT_REP_FAUCET:
        case REPORTING_DISPUTE_MARKETS:
        case REPORTING_REPORT_MARKETS:
        case REPORTING_RESOLVED_MARKETS:
          openNewMenu()
          break
        default:
          this.setState({ currentInnerNavType: newType })
          openNewMenu()
      }
    })
  }

  handleWindowResize() {
    this.checkIsMobile()
  }

  checkIsMobile() {
    const {
      updateIsMobile,
      updateIsMobileSmall,
    } = this.props
    // This method sets up the side bar's state + calls the method to attach the touch event handler for when a user is mobile
    // CSS breakpoint sets the value when a user is mobile
    const isMobile = window.getComputedStyle(document.body).getPropertyValue('--is-mobile').indexOf('true') !== -1
    const isMobileSmall = window.getComputedStyle(document.body).getPropertyValue('--is-mobile-small').indexOf('true') !== -1

    updateIsMobile(isMobile)
    updateIsMobileSmall(isMobileSmall)
  }

  toggleNotifications() {
    this.setState({ isNotificationsVisible: !this.state.isNotificationsVisible })
  }

  toggleMenuTween(menuKey, forceOpen, cb) {
    if (getValue(this.state[menuKey], 'currentTween.stop')) this.state[menuKey].currentTween.stop()

    let nowOpen = !this.state[menuKey].open
    if ((typeof forceOpen) === 'boolean') nowOpen = forceOpen

    const setMenuState = (newState) => {
      this.setState({
        [menuKey]: {
          ...this.state[menuKey],
          ...newState,
        },
      })
    }

    const alreadyDone = ((!nowOpen && (this.state[menuKey].scalar === 0)) ||
                          (nowOpen && (this.state[menuKey].scalar === 1)))
    if (alreadyDone) {
      if (cb && (typeof cb) === 'function') cb()
    } else {
      const baseMenuState = { open: nowOpen }
      const currentTween = tween({
        from: { value: this.state[menuKey].scalar },
        to: { value: (nowOpen ? 1 : 0) },
        duration: 500,
        easing: 'easeOutQuad',
        step: (newState) => {
          setMenuState(Object.assign({}, baseMenuState, { scalar: newState.value }))
        },
      }).then(() => {
        if (cb && (typeof cb) === 'function') cb()
        setMenuState({ locked: false, currentTween: null })
      })
      setMenuState({ currentTween })
    }
  }

  mobileMenuButtonClick() {
    const menuState = this.state.mobileMenuState

    switch (menuState) {
      case mobileMenuStates.CLOSED:
        this.setState({ mobileMenuState: mobileMenuStates.SIDEBAR_OPEN })
        break
      default:
        this.setState({ mobileMenuState: menuState - 1 })
        break
    }
  }

  renderMobileMenuButton(unseenCount) {
    const menuState = this.state.mobileMenuState

    let icon = null
    if (menuState === mobileMenuStates.CLOSED) icon = <MobileNavHamburgerIcon />
    else if (menuState === mobileMenuStates.SIDEBAR_OPEN) icon = <MobileNavCloseIcon />
    else if (menuState >= mobileMenuStates.FIRSTMENU_OPEN) icon = <MobileNavBackIcon />

    return (
      <button
        className={Styles['SideBar__mobile-bars']}
        onClick={() => this.mobileMenuButtonClick()}
      >
        {icon}
        {menuState === mobileMenuStates.CLOSED && !!unseenCount &&
          AlertCircle(Styles['SideBar__mobile-bars-unseen'])
        }
      </button>
    )
  }

  render() {
    const {
      blockchain,
      categories,
      coreStats,
      history,
      isLogged,
      isMobile,
      location,
      loginAccount,
      markets,
      marketsFilteredSorted,
      modal,
      universe,
      isLoading,
    } = this.props
    const s = this.state

    const { mainMenu, subMenu } = this.state
    const unseenCount = getValue(this.props, 'notifications.unseenCount')

    const InnerNav = this.state.currentInnerNavType
    let innerNavMenuMobileClick
    if (InnerNav === MarketsInnerNav) {
      innerNavMenuMobileClick = () => {
        this.setState({ mobileMenuState: mobileMenuStates.SUBMENU_OPEN })
      }
    }

    let categoriesMargin
    let tagsMargin
    let origamiScalar = 0

    const mainSectionClickHandler = () => {
      const stateUpdate = {}
      let updateState = false

      if (isMobile && this.state.mobileMenuState !== mobileMenuStates.CLOSED) {
        stateUpdate.mobileMenuState = mobileMenuStates.CLOSED
        updateState = true
      }

      if (this.state.isNotificationsVisible) {
        stateUpdate.isNotificationsVisible = false
        updateState = true
      }

      if (updateState) {
        this.setState(stateUpdate)
      }
    }

    if (!isMobile) {
      if (parsePath(location.pathname)[0] === AUTHENTICATION) { // NOTE -- quick patch ahead of larger refactor
        categoriesMargin = -110
      } else {
        categoriesMargin = -110 + (110 * mainMenu.scalar)
      }

      tagsMargin = 110 * subMenu.scalar

      // ensure origami fold-out moves perfectly with submenu
      origamiScalar = Math.max(0, (subMenu.scalar + mainMenu.scalar) - 1)
    }

    return (
      <main>
        <Helmet
          defaultTitle="Decentralized Prediction Markets | Augur"
          titleTemplate="%s | Augur"
        />
        {Object.keys(modal).length !== 0 &&
          <Modal />
        }
        <div
          className={classNames(
            Styles.App,
            {
              [Styles[`App--blur`]]: Object.keys(modal).length !== 0,
            },
          )}
        >
          <section className={Styles.SideBar}>
            <Origami
              isMobile={isMobile}
              menuScalar={origamiScalar}
            />
            <Link to={makePath(CATEGORIES)}>
              <Logo
                isLoading={isLoading}
              />
            </Link>
            {this.renderMobileMenuButton(unseenCount)}
            <SideNav
              defaultMobileClick={() => this.setState({ mobileMenuState: mobileMenuStates.CLOSED })}
              isMobile={isMobile}
              isLogged={isLogged}
              mobileShow={s.mobileMenuState === mobileMenuStates.SIDEBAR_OPEN}
              menuScalar={subMenu.scalar}
              menuData={this.sideNavMenuData}
              unseenCount={unseenCount}
              toggleNotifications={this.toggleNotifications}
              stats={coreStats}
              currentBasePath={this.state.currentBasePath}
            />
          </section>
          <section className={Styles.Main}>
            <section className={Styles.TopBar}>
              <TopBar
                isMobile={isMobile}
                isLogged={isLogged}
                stats={coreStats}
                unseenCount={unseenCount}
                toggleNotifications={this.toggleNotifications}
                isLoading={isLoading}
              />
            </section>
            {isLogged && s.isNotificationsVisible &&
              <NotificationsContainer
                toggleNotifications={() => this.toggleNotifications()}
              />
            }
            {universe.forkEndTime && universe.forkEndTime !== '0' && blockchain && blockchain.currentAugurTimestamp &&
              <section className={Styles.TopBar}>
                <ForkingNotification
                  location={location}
                  forkingMarket={universe.forkingMarket}
                  forkEndTime={universe.forkEndTime}
                  currentTime={blockchain.currentAugurTimestamp}
                />
              </section>
            }
            <section
              className={Styles.Main__wrap}
              style={{ marginLeft: categoriesMargin }}
            >
              {InnerNav &&
                <InnerNav
                  currentBasePath={this.state.currentBasePath}
                  isMobile={isMobile}
                  mobileMenuState={s.mobileMenuState}
                  mobileMenuClick={innerNavMenuMobileClick}
                  subMenuScalar={subMenu.scalar}
                  categories={categories}
                  markets={markets}
                  marketsFilteredSorted={marketsFilteredSorted}
                  openSubMenu={() => this.setState({ mobileMenuState: mobileMenuStates.SUBMENU_OPEN })}
                  privateKey={loginAccount.privateKey}
                  location={location}
                  history={history}
                />
              }
              {!InnerNav &&
                <div className="no-nav-placehold" />
              }
              <section
                className={Styles.Main__content}
                style={{ marginLeft: tagsMargin }}
                onClick={mainSectionClickHandler}
                role="presentation"
              >
                <Routes />
              </section>
            </section>
          </section>
        </div>
      </main>
    )
  }
}
