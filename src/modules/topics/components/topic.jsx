import React, { PropTypes, Component } from 'react';

import AugurLogoIcon from 'modules/common/components/augur-logo-icon';

import topicIcons from 'modules/topics/constants/topic-icons';

export default class Topic extends Component {
  static propTypes = {
    topic: PropTypes.string,
    popularity: PropTypes.number
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
    if (!window.getComputedStyle(this.topicIcon, '::before').content) {
      const matchedTopic = Object.keys(topicIcons).find((topic) => {
        if (topic === this.props.topic) {
          return true;
        }
        return false;
      });

      this.updateIconClass(matchedTopic);
    }
  }

  updateIconClass(matchedTopic) {
    if (matchedTopic) {
      this.setState({
        className: `fa ${topicIcons[matchedTopic]}`
      });
    } else {
      this.setState({
        hasIcon: false,
        className: null
      });
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <button>
        {s.hasIcon ?
          <i
            ref={(topicIcon) => { this.topicIcon = topicIcon; }}
            className={s.className}
          /> :
          <AugurLogoIcon />
        }
        <span>{p.popularity}</span>
        <span>{p.topic}</span>
      </button>
    );
  }
}
