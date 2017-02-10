import React from 'react';
import classNames from 'classnames';

import TopicIcon from 'modules/topics/components/topic-icon';

const Topic = p => (
  <button className={classNames('unstyled topic-button', { isHero: p.isHero })}>
    <TopicIcon {...p} />
    <span>{p.popularity}</span>
    <span>{p.topic.toUpperCase()}</span>
  </button>
);

export default Topic;
