import React, { Component } from 'react';
import classNames from 'classnames';

import TopicIcon from 'modules/topics/components/topic-icon';

import debounce from 'utils/debounce';
import fitText from 'utils/fit-text';

export default class Topic extends Component {
  constructor(props) {
    super(props);

    this.handleFitText = debounce(this.handleFitText.bind(this));
  }
  componentDidMount() {
    this.handleFitText();

    window.addEventListener('resize', this.handleFitText);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleFitText);
  }

  handleFitText() {
    fitText(this.topicNameContainer, this.topicName);
  }

  render() {
    const p = this.props;

    return (
      <button
        key={`${p.topic}-${p.popularity}`}
        ref={(topicNameContainer) => { this.topicNameContainer = topicNameContainer; }}
        className={classNames('unstyled topic-button', { isHero: p.isHero, 'is-spacer-topic': p.isSpacer, 'search-result': p.isSearchResult })}
        onClick={() => p.selectTopic(p.topic)}
      >
        {!p.isSpacer &&
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
        }
      </button>
    );
  }
}
