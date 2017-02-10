import React from 'react';

import TopicIcon from 'modules/topics/components/topic-icon';

const Topic = p => (
  <button>
    <TopicIcon {...p} />
    <span>{p.popularity}</span>
    <span>{p.topic}</span>
  </button>
);

export default Topic;
