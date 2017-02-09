import React, { Component } from 'react';

import NullStateMessage from 'modules/common/components/null-state-message';
import Topic from 'modules/topics/components/topic';

export default class TopicsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nullMessage: 'No Topics Available',
      page: 1,
      lowerIndex: 0,
      upperIndex: 4
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.page !== nextState.page) {
      const range = nextState.page === 1 ? 4 : 5;
      const lowerBump = nextState.page < 3 ? 0 : 1;
      const lowerIndex = ((nextState.page - 1) * range) + lowerBump;
      const upperIndex = lowerIndex + range;

      this.setState({
        lowerIndex,
        upperIndex
      });
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <section id="topics_view">
        {p.topics && p.topics.length ?
          <div>
            {p.topics.map((topic, i) => {
              if (i >= s.lowerIndex && i <= s.upperIndex) {
                return (
                  <Topic
                    key={`topic-${i}`}
                    topic={topic.topic}
                    popularity={topic.popularity}
                  />
                );
              }

              return false;
            })}
          </div> :
          <NullStateMessage message={s.nullMessage} />
        }
      </section>
    );
  }
}
