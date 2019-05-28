import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";

import makePath from "modules/routes/helpers/make-path";
import ConnectAccount from "modules/auth/containers/connect-account";
import GasPriceEdit from "modules/app/containers/gas-price-edit";

import { MARKETS } from "modules/routes/constants/views";
import Styles from "modules/app/components/side-nav/side-nav.styles";

export default class SideNav extends Component {
  static propTypes = {
    defaultMobileClick: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isLogged: PropTypes.bool.isRequired,
    menuData: PropTypes.array.isRequired,
    mobileShow: PropTypes.bool.isRequired,
    currentBasePath: PropTypes.string
  };

  static defaultProps = {
    currentBasePath: null
  };

  constructor() {
    super();
    this.state = {
      selectedItem: null,
      selectedKey: null
    };
  }

  componentWillReceiveProps(newProps) {
    const { isMobile } = this.props;
    if (
      isMobile !== newProps.isMobile ||
      newProps.currentBasePath === MARKETS
    ) {
      this.setState({ selectedItem: null, selectedKey: null });
    }
  }

  isCurrentItem(item) {
    const { currentBasePath } = this.props;
    const selected =
      (this.state.selectedKey && this.state.selectedKey === item.title) ||
      item.route === currentBasePath;
    return selected;
  }

  itemClick(item) {
    const { isMobile } = this.props;
    const mobile = isMobile;
    if (!mobile && this.isCurrentItem(item)) return;
    const clickCallback = item.onClick;
    if (clickCallback && typeof clickCallback === "function") {
      clickCallback();
    }
    if (
      this.state.selectedItem &&
      this.state.selectedItem.onBlur &&
      typeof this.state.selectedItem.onBlur === "function"
    ) {
      this.state.selectedItem.onBlur();
    }

    // don't modify selected item if mobile
    // mobile menu state works differently
    if (mobile) return;

    // set title as key for equality check
    // because the state item de-syncs with
    // this.props.menuData's instance
    this.setState({ selectedItem: item, selectedKey: item.title });
  }

  render() {
    const {
      isMobile,
      isLogged,
      defaultMobileClick,
      menuData,
      mobileShow
    } = this.props;

    const accessFilteredMenu = menuData.filter(
      item =>
        !(item.requireLogin && !isLogged) && !(item.onlyForMobile && !isMobile)
    );

    return (
      <aside
        className={classNames(Styles.SideNav, {
          [`${Styles.mobileShow}`]: mobileShow
        })}
      >
        <div className={Styles.SideNav__container}>
          <ul className={Styles.SideNav__nav}>
            {accessFilteredMenu.map((item, index) => {
              const Icon = item.icon;
              const selected = !isMobile && this.isCurrentItem(item);

              const linkClickHandler = () => {
                if (isMobile) {
                  if (item.mobileClick) {
                    item.mobileClick();
                  } else {
                    defaultMobileClick();
                  }
                } else {
                  this.itemClick(item);
                }
              };

              return (
                <li
                  className={classNames(
                    { [Styles["SideNav__item--selected"]]: selected },
                    item.disabled ? Styles.disabled : ""
                  )}
                  key={item.title}
                  id="side-nav-items"
                >
                  <Link
                    to={item.route ? makePath(item.route) : null}
                    onClick={linkClickHandler}
                    disabled={item.disabled}
                  >
                    <Icon />
                    <span className={Styles["item-title"]}>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {isLogged && (
            <div className={Styles.SideNav__hideForMidScreens}>
              <GasPriceEdit />
              <div className={Styles.SideNav__amt}>
                <div className={Styles.SideNav__nav__separator} />
              </div>
              <ConnectAccount />
            </div>
          )}
        </div>
      </aside>
    );
  }
}
