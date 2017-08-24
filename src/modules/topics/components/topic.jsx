import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

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
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.popularity !== nextProps.popularity) {
      const popularityChange = nextProps.popularity > this.props.popularity ? TOPIC_VOLUME_INCREASED : TOPIC_VOLUME_DECREASED;

      this.setState({ popularityChange });
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    const flooredPop = Math.floor(p.popularity);
    let popString = ' SHARES';
    if (flooredPop > 1000) {
      const thousands = flooredPop / 1000;
      const truncatedThousands = thousands.toString().split('').slice(0, 3).join('');
      popString = truncatedThousands + 'K ' + popString;
    } else {
      popString = flooredPop + popString;
    }

    return (
      <Link
        to={{
          pathname: makePath(MARKETS),
          search: `?${TOPIC_PARAM_NAME}=${encodeURIComponent(p.topic)}`
        }}
        key={`${p.topic}-${p.popularity}`}
        className="unstyled button topic-button"
      >
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
              {popString}
            </span>
          </div>
        </div>
      </Link>
    );
  }
}
