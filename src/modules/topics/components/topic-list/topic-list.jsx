/* eslint react/no-array-index-key: 0 */  // Trying to accomodate the data structure

import React from 'react';
import PropTypes from 'prop-types';

import Topic from 'modules/topics/components/topic/topic';

import Styles from 'modules/topics/components/topic-list/topic-list.styles';

const TopicList = (p) => {
  const topics = [];

  for (let i = (p.lowerBound - 1); i < p.upperBound; i++) {
    const topicIndex = i;
    const topic = p.topics ? p.topics[i] : null;

    topics.push(
      <div
        className={Styles.TopicList__topicwrap}
        key={topic !== null ? JSON.stringify(topic) : `${JSON.stringify(topic)}${topicIndex}`}
      >
        <Topic
          topic={topic !== null ? topic.topic : ''}
          popularity={topic !== null ? topic.popularity : 0}
        />
      </div>
    );
  }

  return (
    <div>
      {topics}
    </div>
  );
};

TopicList.propTypes = {
  topics: PropTypes.array.isRequired,
  lowerBound: PropTypes.number,
  boundedLength: PropTypes.number
};

export default TopicList;
