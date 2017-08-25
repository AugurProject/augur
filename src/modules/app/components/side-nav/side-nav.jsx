import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import makePath from 'modules/app/helpers/make-path';

import Styles from 'modules/app/components/side-nav/side-nav.styles';

export default class SideNav extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    isLogged: PropTypes.bool,
    menuData: PropTypes.array.isRequired,
    mobileShow: PropTypes.bool.isRequired
  };

  constructor() {
    super();
    this.state = {
      selectedItem: null,
      selectedKey: null
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.isMobile !== newProps.isMobile) {
      this.setState({ selectedItem: null, selectedKey: null });
    }
  }

  isCurrentItem(item) {
    const selected = (this.state.selectedKey &&
                      this.state.selectedKey === item.title);
    return selected;
  }

  itemClick(item) {
    const mobile = this.props.isMobile;
    if (!mobile && this.isCurrentItem(item)) return;
    const clickCallback = item.onClick;
    if (clickCallback && typeof clickCallback === 'function') {
      clickCallback();
    }
    if (this.state.selectedItem &&
        this.state.selectedItem.onBlur &&
        typeof this.state.selectedItem.onBlur === 'function') {
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

  renderSidebarMenu() {
    const mobile = this.props.isMobile;
    const logged = this.props.isLogged;

    const accessFilteredMenu = this.props.menuData.filter(item => !(item.requireLogin && !logged));

    return (
      <ul className={Styles.SideNav__nav}>
        {accessFilteredMenu.map((item, index) => {
          const Icon = item.icon;
          const selected = !mobile && this.isCurrentItem(item);

          return (
            <li
              className={classNames({ [`${Styles.selected}`]: selected })}
              key={item.title}
            >
              <Link
                to={makePath(item.route)}
              >
                <Icon />
                <span className="item-title">{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <aside className={classNames(Styles.SideNav, { [`${Styles.mobileShow}`]: this.props.mobileShow })}>
        {this.renderSidebarMenu()}
      </aside>
    );
  }
}
