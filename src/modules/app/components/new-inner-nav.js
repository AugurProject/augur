import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class InnerMenuBar extends Component {
  static propTypes = {
    topics: PropTypes.array.isRequired,
    onSelectTopic: PropTypes.func.isRequired
  };

  renderTopicList() {
    return (
      <ul className='innermenubar'>
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
    const menuIndex = this.state.currentMenuIndex;
    return (
      <ul className='submenubar' style={{ left: (110 * this.props.subMenuScalar) }}>
        {(menuIndex !== null) && this.props.menuData[menuIndex].children &&
          this.props.menuData[menuIndex].children.map((item) => <li>{item.title}</li>)
        }
      </ul>
    );
  }

  render() {
    return (
      <div className='inner-menu-container'>
        {this.renderTopicList()}
      </div>
    );
  }
}

export default InnerMenuBar;
