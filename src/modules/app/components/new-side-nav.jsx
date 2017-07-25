import React, { Component } from 'react';
import Origami from './origami-svg';
import Logo from './logo';
import classNames from 'classnames';

class SideBar extends Component {

  constructor() {
    super();
    this.state = {
      selectedItem: null,
      itemKey: null
    };
  }

  isCurrentItem(item) {
    const selected = (this.state.selectedKey &&
                      this.state.selectedKey === item.title);
    return selected;
  }

  itemClick(item) {
    if (this.isCurrentItem(item)) return;
    const clickCallback = item.onClick;
    if (clickCallback && typeof clickCallback === 'function') {
      clickCallback();
    }
    if (this.state.selectedItem &&
        this.state.selectedItem.onBlur &&
        typeof this.state.selectedItem.onBlur === 'function') {
      this.state.selectedItem.onBlur();
    }

    // set title as key for equality check 
    // because the state item de-syncs with
    // this.props.menuData's instance
    this.setState({ selectedItem: item, selectedKey: item.title });
  }

  renderSidebarMenu() {
    return (
      <ul className="sidebar-menu">
        {this.props.menuData.map((item) => {
          const iconName = `nav-${item.iconKey}`;
          const selected = this.isCurrentItem(item);

          return (
            <li
              className={classNames({ selected })}
              onClick={() => this.itemClick(item)}
            >
              <img
                alt={iconName}
                className={iconName}
                src={`../../assets/images/${iconName}.svg`}
              />
              <span className="item-title">{item.title}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <div className="sidebar">
        <Origami menuScalar={this.props.menuScalar} />
        <Logo />
        {this.renderSidebarMenu()}
      </div>
    );
  }
}

export default SideBar;
