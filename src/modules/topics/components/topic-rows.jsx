import React from 'react';

import Topic from 'modules/topics/components/topic';

const TopicRows = (p) => {
  let row = 0;
  let itemCount = 0;
  const rowItems = p.topics.reduce((accum, topic, i) => {
    if (!accum[row]) {
      accum[row] = [];
    }

    accum[row].push(topic);

    itemCount += 1;

    if ((p.hasHeroRow && itemCount === p.topicsPerHeroRow && row === 0) || itemCount === p.topicsPerRow) {
      row += 1;
      itemCount = 0;
    }
    return accum;
  }, {});

  return (
    <div className="topic-rows">
      {Object.keys(rowItems).map((row, rowIndex) => (
        <div
          key={`topic-row-${rowIndex}`}
          className="topic-row"
        >
          {rowItems[row].map((topic, topicIndex) => (
            <Topic
              key={`${topic.topic}-${topicIndex}`}
              isHero={p.hasHeroRow && rowIndex === 0}
              topic={topic.topic}
              popularity={topic.popularity}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TopicRows;
