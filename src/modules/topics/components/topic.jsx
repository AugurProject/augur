import React from 'react';
import classNames from 'classnames';

import TopicIcon from 'modules/topics/components/topic-icon';

const Topic = p => (
  <button className={classNames('unstyled topic-button', { isHero: p.isHero })}>
    <div className="topic-content">
      <TopicIcon {...p} />
      <span className="topic-popularity">
        {p.popularity}
      </span>
      <span className="topic-name">
        {p.topic.toUpperCase()}
      </span>
    </div>
  </button>
);

export default Topic;
