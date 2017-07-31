import React from 'react';
import classNames from 'classnames';

import Topic from 'modules/topics/components/topic';

const TopicRows = (p) => {
  const rows = [];
  let offset = 0;

  for (let row = 0; row < p.numberOfRows; row++) {
    rows[row] = [];

    const rowBound = p.hasHeroRow && row === 0 && !p.hasKeywords ? p.topicsPerHeroRow : p.topicsPerRow;

    for (let item = 0; item < rowBound; item++) {
      if (offset < p.boundedLength) {
        rows[row].push((p.lowerBound - 1) + offset);
      } else {
        rows[row].push(null);
      }

      offset += 1;
    }
  }

  return (
    <div className="topic-rows">
      {
        rows.map((row, rowIndex) => (
          <div
            key={`${JSON.stringify(row)}${rowIndex}`}
            className={classNames('topic-row', { 'hero-row': p.hasHeroRow && rowIndex === 0, 'search-result': p.hasKeywords })}
          >
            {rows[rowIndex].map((topic, topicIndex) => (
              <Topic
                key={topic === null ? Math.random() : topic}
                isSpacer={topic === null}
                isHero={p.hasHeroRow && rowIndex === 0}
                topic={topic && p.topics && p.topics[topic] ? p.topics[topic].topic : ''}
                popularity={topic && p.topics && p.topics[topic] ? p.topics[topic].popularity : 0}
                hasKeywords={p.hasKeywords}
                fontAwesomeClasses={p.fontAwesomeClasses}
                icoFontClasses={p.icoFontClasses}
              />
            ))}
          </div>
        ))
      }
    </div>
  );
};

export default TopicRows;

// topic={topic === null ? '' : p.topics[topic].topic}
// popularity={topic === null ? 0 : p.topics[topic].popularity}
