import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mobileMenuStates } from './app';

class InnerNav extends Component {
  static propTypes = {
    topics: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
    mobileMenuState: PropTypes.number.isRequired,
    selectedTopic: PropTypes.string.isRequired,
    onSelectTopic: PropTypes.func.isRequired,
    subMenuScalar: PropTypes.number.isRequired
  };

  renderTopicList() {
    return (
      <ul className="innermenubar">
        {this.props.topics.map((item) => {
          const clickSelect = () => this.props.onSelectTopic(item.topic);
          const isSelected = item.topic === this.props.selectedTopic;
          return (
            <li
              className={classNames({ selected: isSelected })}
              onClick={clickSelect}
            >
              {item.topic}
            </li>
          );
        })}
      </ul>
    );
  }

  renderSubMenu() {
    const showTags = this.props.mobileMenuState === mobileMenuStates.TAGS_OPEN;
    let animatedStyle;
    if (!this.props.isMobile) {
      animatedStyle = { left: (110 * this.props.subMenuScalar) };
    }

    return (
      <ul
        className={classNames({ submenubar: true, mobileShow: showTags })}
        style={animatedStyle}
      >
        {this.props.tags.length === 0 &&
          <li>Loading . . .</li>
        }
        {this.props.tags.length > 0 &&
        this.props.tags.map(item => (
          <li
            className={classNames({ selected: item.isSelected })}
            onClick={item.onClick}
          >
            {item.name}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const showTopics = this.props.mobileMenuState >= mobileMenuStates.TOPICS_OPEN;
    return (
      <div className={classNames({ innerMenuContainer: true, mobileShow: showTopics })}>
        {this.renderTopicList()}
        {this.renderSubMenu()}
      </div>
    );
  }
}

export default InnerNav;
