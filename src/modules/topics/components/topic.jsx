import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';

import TopicIcon from 'modules/topics/components/topic-icon';

import debounce from 'utils/debounce';
import fitText from 'utils/fit-text';

import { TOPIC_VOLUME_INCREASED, TOPIC_VOLUME_DECREASED } from 'modules/topics/constants/topic-popularity-change';

export default class Topic extends Component {
  static propTypes = {
    popularity: PropTypes.number
  }

  constructor(props) {
    super(props);

    this.state = {
      popularityChange: null
    };

    this.handleFitText = debounce(this.handleFitText.bind(this));
  }
  componentDidMount() {
    fitText(this.topicNameContainer, this.topicName);

    window.addEventListener('resize', this.handleFitText);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.popularity !== nextProps.popularity) {
      const popularityChange = nextProps.popularity > this.props.popularity ? TOPIC_VOLUME_INCREASED : TOPIC_VOLUME_DECREASED;

      this.setState({ popularityChange });
    }
  }

  componentDidUpdate() {
    fitText(this.topicNameContainer, this.topicName);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleFitText);
  }

  handleFitText() {
    fitText(this.topicNameContainer, this.topicName);
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <button
        key={`${p.topic}-${p.popularity}`}
        ref={(topicNameContainer) => { this.topicNameContainer = topicNameContainer; }}
        className={classNames('unstyled topic-button', { isHero: p.isHero, 'is-spacer-topic': p.isSpacer, 'search-result': p.isSearchResult })}
        onClick={() => p.selectTopic(p.topic)}
      >
        {!p.isSpacer &&
          <div className="topic-content">
            <TopicIcon
              topic={p.topic}
              fontAwesomeClasses={p.fontAwesomeClasses}
              icoFontClasses={p.icoFontClasses}
            />
            <div className="topic-popularity">
              <span
                className={classNames({
                  'bounce-up-and-flash': s.popularityChange === TOPIC_VOLUME_INCREASED,
                  'bounce-down-and-flash': s.popularityChange === TOPIC_VOLUME_DECREASED
                })}
                data-tip data-for="topic-volume-tooltip"
              >
                {Math.floor(p.popularity).toLocaleString()}
              </span>
            </div>
            <div className="topic-name" >
              <span ref={(topicName) => { this.topicName = topicName; }}>
                {p.topic.toUpperCase()}
              </span>
            </div>
          </div>
        }
        <ReactTooltip id="topic-volume-tooltip" type="light" effect="solid" place="top">
          <span className="tooltip-text">Total Market Volume</span>
        </ReactTooltip>
      </button>
    );
  }
}
