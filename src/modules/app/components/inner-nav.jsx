import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mobileMenuStates } from 'modules/app/components/app';

class InnerNav extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired,
    keywords: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
    mobileMenuState: PropTypes.number.isRequired,
    selectedCategory: PropTypes.string.isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    subMenuScalar: PropTypes.number.isRequired
  };

  renderTopicList() {
    return (
      <ul className="innermenubar">
        {this.props.categories.map((item, index) => {
          const clickSelect = () => this.props.onSelectCategory(item.topic);
          const isSelected = item.topic === this.props.selectedCategory;
          return (
            <li
              className={classNames({ selected: isSelected })}
              onClick={clickSelect}
              key={item.topic}
            >
              {item.topic}
            </li>
          );
        })}
      </ul>
    );
  }

  renderSubMenu() {
    const showKeywords = this.props.mobileMenuState === mobileMenuStates.KEYWORDS_OPEN;
    let animatedStyle;
    if (!this.props.isMobile) {
      animatedStyle = { left: (110 * this.props.subMenuScalar) };
    }

    return (
      <ul
        className={classNames({ submenubar: true, mobileShow: showKeywords })}
        style={animatedStyle}
      >
        {this.props.keywords.length === 0 &&
          <li>Loading . . .</li>
        }
        {this.props.keywords.length > 0 &&
        this.props.keywords.map((item, index) => (
          <li
            className={classNames({ selected: item.isSelected })}
            onClick={item.onClick}
            key={item.name}
          >
            {item.name}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const showCategories = this.props.mobileMenuState >= mobileMenuStates.CATEGORIES_OPEN;
    return (
      <aside className={classNames({ [`inner-menu-container`]: true, mobileShow: showCategories })}>
        {this.renderTopicList()}
        {this.renderSubMenu()}
      </aside>
    );
  }
}

export default InnerNav;
