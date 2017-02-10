import React, { Component, PropTypes } from 'react';

import NullStateMessage from 'modules/common/components/null-state-message';
import Topic from 'modules/topics/components/topic';
import Paginator from 'modules/common/components/paginator';

export default class TopicsView extends Component {
  static propTypes = {
    topics: PropTypes.array
  }

  constructor(props) {
    super(props);

    this.state = {
      nullMessage: 'No Topics Available',
      currentPage: 1,
      lowerIndex: 0,
      upperIndex: 4,
      pagination: {}
    };

    this.updatePaginationObject = this.updatePaginationObject.bind(this);
  }

  componentWillMount() {
    this.updatePaginationObject(this.props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.currentPage !== nextState.currentPage || this.props.topics !== nextProps.topics) {
      this.updatePaginationObject(nextProps, nextState);
    }
  }

  updatePaginationObject(p, s) {
    const range = s.currentPage === 1 ? 4 : 5;
    const lowerBump = s.currentPage < 3 ? 0 : 1;
    const lowerIndex = ((s.currentPage - 1) * range) + lowerBump;
    const upperIndex = p.topics.length - 1 >= lowerIndex + range ?
      lowerIndex + range :
      p.topics.length - 1;

    this.setState({
      lowerIndex,
      upperIndex,
      pagination: {
        ...s.pagination,
        startItemNum: lowerIndex + 1,
        endItemNum: upperIndex + 1,
        numUnpaginated: p.topics.length,
        previousPageNum: s.currentPage > 1 ? s.currentPage - 1 : null,
        previousPageLink: {
          onClick: () => {
            if (s.currentPage > 1) {
              this.setState({ currentPage: s.currentPage - 1 });
            }
          }
        },
        nextPageNum: upperIndex < p.topics.length - 1 ? s.currentPage + 1 : null,
        nextPageLink: {
          onClick: () => {
            if (upperIndex < p.topics.length - 1) {
              this.setState({ currentPage: s.currentPage + 1 });
            }
          }
        }
      }
    });
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
            {p.topics.length > 5 &&
              <Paginator pagination={s.pagination} />
            }
          </div> :
          <NullStateMessage message={s.nullMessage} />
        }
      </section>
    );
  }
}
