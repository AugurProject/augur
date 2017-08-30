import React, { Component } from 'react'
import PropTypes from 'prop-types'

import shouldComponentUpdatePure from 'utils/should-component-update-pure'
import debounce from 'utils/debounce'

import { tween } from 'shifty'

import TopBar from 'modules/app/components/top-bar/top-bar'
import InnerNav from 'modules/app/components/inner-nav/inner-nav'
import SideNav from 'modules/app/components/side-nav/side-nav'
import Origami from 'modules/app/components/origami-svg/origami-svg'
import Logo from 'modules/app/components/logo/logo'

import MobileNavHamburgerIcon from 'modules/common/components/mobile-nav-hamburger-icon'
import MobileNavCloseIcon from 'modules/common/components/mobile-nav-close-icon'
import MobileNavBackIcon from 'modules/common/components/mobile-nav-back-icon'

import NavAccountIcon from 'modules/common/components/nav-account-icon'
import NavCreateIcon from 'modules/common/components/nav-create-icon'
import NavMarketsIcon from 'modules/common/components/nav-markets-icon'
import NavPortfolioIcon from 'modules/common/components/nav-portfolio-icon'

import Styles from 'modules/app/components/app/app.styles'

import { MARKETS, ACCOUNT, MY_POSITIONS, CREATE_MARKET } from 'modules/app/constants/views'

export const mobileMenuStates = { // TODO -- move to a constants file
  CLOSED: 0,
  SIDEBAR_OPEN: 1,
  CATEGORIES_OPEN: 2,
  KEYWORDS_OPEN: 3
}

export default class AppView extends Component {
  static propTypes = {
    url: PropTypes.string,
    coreStats: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
    updateIsMobile: PropTypes.func.isRequired,
    selectedCategory: PropTypes.string
  };

  constructor(props) {
    super(props)

    this.state = {
      mainMenu: { scalar: 0, open: false, currentTween: null },
      subMenu: { scalar: 0, open: false, currentTween: null },
      keywordState: { loaded: false, openOnLoad: false },
      mobileMenuState: mobileMenuStates.CLOSED
    }

    this.sideNavMenuData = [
      {
        title: 'Markets',
        icon: NavMarketsIcon,
        route: MARKETS
      },
      {
        title: 'Account',
        iconName: 'nav-account-icon',
        icon: NavAccountIcon,
        route: ACCOUNT
      },
      {
        title: 'Create',
        iconName: 'nav-create-icon',
        icon: NavCreateIcon,
        route: CREATE_MARKET,
        requireLogin: true
      },
      {
        title: 'Portfolio',
        iconName: 'nav-portfolio-icon',
        icon: NavPortfolioIcon,
        route: MY_POSITIONS,
        requireLogin: true
      }
    ]

    this.shouldComponentUpdate = shouldComponentUpdatePure

    this.handleWindowResize = debounce(this.handleWindowResize.bind(this), 25)
    this.checkIfMobile = this.checkIfMobile.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize)

    this.checkIfMobile()
  }

  componentWillReceiveProps(newProps) {
    if (this.props.isMobile !== newProps.isMobile) {
      this.setState({
        mobileMenuState: mobileMenuStates.CLOSED,
        mainMenu: { scalar: 0, open: false },
        subMenu: { scalar: 0, open: false }
      })
    }

    // TODO: promise-ize instead of comparing states
    // if (this.props.keywords.length === 0 &&
    //     newProps.keywords.length > 0) {
    //   if (this.state.keywordState.openOnLoad) {
    //     if (this.props.isMobile) {
    //       this.setState({ mobileMenuState: mobileMenuStates.KEYWORDS_OPEN });
    //     } else {
    //       this.toggleMenuTween('subMenu', true);
    //     }
    //   }
    //   this.setState({ keywordState: { loaded: true, openOnLoad: false } });
    // }

    // if (this.props.keywords.length > 0 &&
    //     newProps.keywords.length === 0) {
    //   if (!this.props.isMobile) {
    //     this.toggleMenuTween('subMenu', false);
    //   }
    //   this.setState({ keywordState: { loaded: false, openOnLoad: true } });
    // }

  }

  handleWindowResize() {
    this.checkIfMobile()
  }

  checkIfMobile() {
    // This method sets up the side bar's state + calls the method to attach the touch event handler for when a user is mobile
    // CSS breakpoint sets the value when a user is mobile
    const isMobile = window.getComputedStyle(document.body).getPropertyValue('--is-mobile').indexOf('true') !== -1

    this.props.updateIsMobile(isMobile)
  }

  toggleMenuTween(menuKey, forceOpen, cb) {
    if (this.state[menuKey].currentTween) this.state[menuKey].currentTween.stop()

    let nowOpen = !this.state[menuKey].open
    if ((typeof forceOpen) === 'boolean') nowOpen = forceOpen

    const setMenuState = (newState) => {
      this.setState({
        [menuKey]: Object.assign({}, this.state[menuKey], newState)
      })
    }

    const baseMenuState = { open: nowOpen }
    const currentTween = tween({
      from: { value: this.state[menuKey].scalar },
      to: { value: (nowOpen ? 1 : 0) },
      duration: 500,
      easing: 'easeOutQuad',
      step: (newState) => {
        setMenuState(Object.assign({}, baseMenuState, { scalar: newState.value }))
      }
    }).then(
      () => {
        if (cb && (typeof cb) === 'function') cb()
        setMenuState({ locked: false, currentTween: null })
      }
    )
    setMenuState({ currentTween })
  }

  toggleMainMenu() {
    const { selectedCategory } = this.props
    if (!this.state.mainMenu.open && selectedCategory && this.state.keywordState.loaded) {
      this.toggleMenuTween('subMenu', true)
    } else {
      this.toggleMenuTween('subMenu', false)
    }
    this.toggleMenuTween('mainMenu')
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

  renderMobileMenuButton() {
    const menuState = this.state.mobileMenuState

    let icon = null
    if (menuState === mobileMenuStates.CLOSED) icon = <MobileNavHamburgerIcon />
    else if (menuState === mobileMenuStates.SIDEBAR_OPEN) icon = <MobileNavCloseIcon />
    else if (menuState >= mobileMenuStates.CATEGORIES_OPEN) icon = <MobileNavBackIcon />

    return (
      <button
        className={Styles['SideBar__mobile-bars']}
        onClick={() => this.mobileMenuButtonClick()}
      >
        {icon}
      </button>
    )
  }

  render() {
    const p = this.props
    const s = this.state

    const innerNavProps = {
      categories: p.categories,
      selectedCategory: p.selectedCategory,
      keywords: p.keywords
    }

    const { mainMenu, subMenu } = this.state

    let categoriesMargin
    let keywordsMargin
    let origamiScalar = 0

    if (!p.isMobile) {
      categoriesMargin = -110 + (110 * mainMenu.scalar)
      keywordsMargin = 110 * subMenu.scalar

      // ensure origami fold-out moves perfectly with submenu
      origamiScalar = Math.max(0, (subMenu.scalar + mainMenu.scalar) - 1)
    }

    return (
      <main className={Styles.App}>
        <section className={Styles.SideBar}>
          <Origami
            isMobile={p.isMobile}
            menuScalar={origamiScalar}
          />
          <Logo />
          {this.renderMobileMenuButton()}
          <SideNav
            isMobile={p.isMobile}
            isLogged={p.isLogged}
            mobileShow={s.mobileMenuState === mobileMenuStates.SIDEBAR_OPEN}
            menuScalar={subMenu.scalar}
            menuData={this.sideNavMenuData}
          />
        </section>
        <section className={Styles.Main}>
          <section>
            <TopBar
              isMobile={p.isMobile}
              stats={p.coreStats}
            />
          </section>
          <section
            className={Styles.Main__wrap}
            style={{ marginLeft: categoriesMargin }}
          >
            <InnerNav
              isMobile={p.isMobile}
              mobileMenuState={s.mobileMenuState}
              subMenuScalar={subMenu.scalar}
              onSelectCategory={(...args) => {
                p.selectCategory(...args)
                const { loaded } = this.state.keywordState
                this.setState({ keywordState: { openOnLoad: true, loaded } })
              }}
              {...innerNavProps}
            />
            <section
              className={Styles.Main__content}
              style={{ marginLeft: keywordsMargin }}
            >
              {p.children}
            </section>
          </section>
        </section>
      </main>
    )
  }
}
