import React, { Component } from 'react';
import classNames from 'classnames';

import TopicIcon from 'modules/topics/components/topic-icon';

// import debounce from 'utils/debounce';
import fitText from 'utils/fit-text';

export default class Topic extends Component {
  constructor(props) {
    super(props);

    // console.log('initial props -- ', props);
  }

  componentDidMount() {
    fitText(this.topicNameContainer, this.topicName);

    window.addEventListener('resize', () => { fitText(this.topicNameContainer, this.topicName); });
  }

  componentWilUnmount() {
    window.removeEventListener('resize', () => { fitText(this.topicNameContainer, this.topicName); });
  }

  render() {
    const p = this.props;

    return (
      <button
        key={`${p.topic}-${p.popularity}`}
        ref={(topicNameContainer) => { this.topicNameContainer = topicNameContainer; }}
        className={classNames('unstyled topic-button', { isHero: p.isHero })}
      >
        <div className="topic-content">
          <TopicIcon {...p} />
          <span className="topic-popularity">
            {Math.floor(p.popularity).toLocaleString()}
          </span>
          <div className="topic-name" >
            <span ref={(topicName) => { this.topicName = topicName; }}>
              {p.topic.toUpperCase()}
            </span>
          </div>
        </div>
      </button>
    );
  }
}
