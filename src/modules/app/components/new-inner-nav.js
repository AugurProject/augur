import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class InnerNav extends Component {
  static propTypes = {
    topics: PropTypes.array.isRequired,
    onSelectTopic: PropTypes.func.isRequired
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
    return (
      <ul className="submenubar" style={{ left: (110 * this.props.subMenuScalar) }}>
        {this.props.tags.length === 0 &&
          <li>Loading . . .</li>
        }
        {this.props.tags.length > 0 &&
         this.props.tags.map((item) => (
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
    return (
      <div className='inner-menu-container'>
        {this.renderTopicList()}
        {this.renderSubMenu()}
      </div>
    );
  }
}

export default InnerNav;
