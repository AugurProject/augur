import React from 'react';
import classNames from 'classnames';

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

    if (i === p.topics.length - 1 && accum[row].length < p.topicsPerRow && (row !== 0 || p.isSearchResult || !p.hasHeroRow)) {
      const pushEmptyTopic = () => {
        accum[row].push({});
        if (accum[row].length < p.topicsPerRow) {
          pushEmptyTopic();
        }
      };

      pushEmptyTopic();

      return accum;
    }

    if ((p.hasHeroRow && itemCount === p.topicsPerHeroRow && row === 0 && !p.isSearchResult) || itemCount === p.topicsPerRow) {
      row += 1;
      itemCount = 0;
    }

    return accum;
  }, {});

  return (
    <div className="topic-rows">
      {Object.keys(rowItems).map((row, rowIndex) => (
        <div
          key={row}
          className={classNames('topic-row', { 'hero-row': p.hasHeroRow && rowIndex === 0, 'search-result': p.isSearchResult })}
        >
          {rowItems[row].map((topic, topicIndex) => (
            <Topic
              key={topic}
              isSpacer={!Object.keys(topic).length}
              isHero={p.hasHeroRow && rowIndex === 0}
              topic={topic.topic}
              popularity={topic.popularity}
              selectTopic={p.selectTopic}
              isSearchResult={p.isSearchResult}
              fontAwesomeClasses={p.fontAwesomeClasses}
              icoFontClasses={p.icoFontClasses}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TopicRows;
