import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';

import TopicIcon from 'modules/topics/components/topic-icon';

import debounce from 'utils/debounce';
import fitText from 'utils/fit-text';
import makePath from 'modules/app/helpers/make-path';

import { TOPIC_VOLUME_INCREASED, TOPIC_VOLUME_DECREASED } from 'modules/topics/constants/topic-popularity-change';
import { MARKETS } from 'modules/app/constants/views';
import { TOPIC_PARAM_NAME } from 'modules/app/constants/param-names';

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
      <Link
        to={{
          pathname: makePath(MARKETS),
          search: `?${TOPIC_PARAM_NAME}=${encodeURIComponent(p.topic)}`
        }}
        key={`${p.topic}-${p.popularity}`}
        className={classNames('unstyled button topic-button', { isHero: p.isHero, 'is-spacer-topic': p.isSpacer, 'search-result': p.isSearchResult })}
      >
        {!p.isSpacer &&
          <div
            className="topic-content"
            ref={(topicNameContainer) => { this.topicNameContainer = topicNameContainer; }}
          >
            <div className="topic-name" >
              <span ref={(topicName) => { this.topicName = topicName; }}>
                {p.topic.toUpperCase()}
              </span>
            </div>
            <div className="separator-bar" />
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
          </div>
        }
      </Link>
    );
  }
}
