import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default class SideBar extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
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

    return (
      <ul className="sidebar-menu">
        {this.props.menuData.map((item, index) => {
          const Icon = item.icon;
          const selected = !mobile && this.isCurrentItem(item);

          return (
            <li
              className={classNames({ selected })}
              key={item.title}
            >
              <button onClick={() => this.itemClick(item)}>
                <Icon />
                <span className="item-title">{item.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <aside className={classNames({ sidebar: true, mobileShow: this.props.mobileShow })}>
        {this.renderSidebarMenu()}
      </aside>
    );
  }
}
