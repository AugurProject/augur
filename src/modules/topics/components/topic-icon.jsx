import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AugurLogoIcon from 'modules/common/components/augur-logo-icon';

import iconTopics from 'modules/topics/constants/icon-topics';

export default class TopicIcon extends Component {
  static propTypes = {
    topic: PropTypes.string,
    fontAwesomeClasses: PropTypes.array,
    icoFontClasses: PropTypes.array
  }

  constructor(props) {
    super(props);

    this.state = {
      hasIcon: false,
      className: null
    };

    this.determineAppropriateIcon = this.determineAppropriateIcon.bind(this);
  }

  componentDidMount() {
    this.determineAppropriateIcon();
  }

  determineAppropriateIcon() {
    // NOTE --  The icon selection is as follows:
    //  > If a topic matches an existing Font Awesome classname, use that; otherwise,
    //  > If a topic matches an existing Icofont classname, use that; otherwise,
    //  > If a topic matches a pre-defined mapping, use that; otherwise,
    //  > use Augur logo

    // Font Awesome match
    const faClass = this.props.fontAwesomeClasses.find(faClass => faClass === `fa-${this.props.topic.toLowerCase()}`);
    if (faClass) {
      this.setState({
        hasIcon: true,
        className: `fa ${faClass}`
      });
      return;
    }

    // Icofont match
    const icoClass = this.props.icoFontClasses.find(icoClass => icoClass === `icofont-${this.props.topic.toLowerCase()}`);
    if (icoClass) {
      this.setState({
        hasIcon: true,
        className: `icofont ${icoClass}`
      });
      return;
    }

    // Predefined match
    const matchedTopic = Object.keys(iconTopics).find((icon) => {
      if (typeof iconTopics[icon] === 'string') {
        if (iconTopics[icon] === this.props.topic.toLowerCase()) {
          return true;
        }
        return false;
      }

      const arrayIconCheck = iconTopics[icon].indexOf(this.props.topic.toLowerCase());

      if (arrayIconCheck > -1) {
        return icon;
      }

      return false;
    });

    if (matchedTopic) {
      if (matchedTopic.indexOf('fa-') !== -1) {
        this.setState({
          hasIcon: true,
          className: `fa ${matchedTopic}`
        });
      }
      if (matchedTopic.indexOf('icofont-') !== -1) {
        this.setState({
          hasIcon: true,
          className: `icofont ${matchedTopic}`
        });
      }
    }
  }

  render() {
    const s = this.state;

    return (
      <article className={classNames('topic-icon', { 'augur-logo': !s.hasIcon })} >
        {s.hasIcon ?
          <i
            ref={(topicIcon) => { this.topicIcon = topicIcon; }}
            className={s.className}
          /> :
          <AugurLogoIcon />
        }
      </article>
    );
  }
}
