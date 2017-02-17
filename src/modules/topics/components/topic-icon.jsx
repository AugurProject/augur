import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import AugurLogoIcon from 'modules/common/components/augur-logo-icon';

import iconTopics from 'modules/topics/constants/icon-topics';

// NOTE --  The icon selection is as follows:
//          > If a topic matches an existing font awesome classname, use that; otherwise,
//          > If a topic matches a pre-defined mapping, use that; otherwise,
//          > use Augur logo
export default class TopicIcon extends Component {
  static propTypes = {
    topic: PropTypes.string
  }

  constructor(props) {
    super(props);

    const faFormattedTopic = `fa-${props.topic.split(' ').join('-')}`;

    this.state = {
      hasIcon: true,
      className: `fa ${faFormattedTopic}`
    };

    this.updateIconClass = this.updateIconClass.bind(this);
  }

  componentDidMount() {
    const content = window.getComputedStyle(this.topicIcon, '::before').content;

    if (!content || content === 'none') { // 'none' is FF specific fix
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

      this.updateIconClass(matchedTopic);
    }
  }

  updateIconClass(matchedTopic) {
    if (matchedTopic) {
      this.setState({
        className: `fa ${matchedTopic}`
      });
    } else {
      this.setState({
        hasIcon: false,
        className: null
      });
    }
  }

  render() {
    // const p = this.props;
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
