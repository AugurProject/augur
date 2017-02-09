import React, { Component } from 'react';

import NullStateMessage from 'modules/common/components/null-state-message';
import Topic from 'modules/topics/components/topic';

export default class TopicsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nullMessage: 'No Topics Available',
      page: 1
    };
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <section id="topics_view">
        {p.topics && p.topics.length ?
          <article>
            {p.topics.map((topic, i) => {
              return <Topic />;
            })}
          </article> :
          <NullStateMessage message={s.nullMessage} />
        }
      </section>
    );
  }
}
