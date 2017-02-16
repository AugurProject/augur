import React, { Component, PropTypes } from 'react';

import NullStateMessage from 'modules/common/components/null-state-message';
import TopicRows from 'modules/topics/components/topic-rows';
import Paginator from 'modules/common/components/paginator';
import Input from 'modules/common/components/input';

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
      pagination: {},
      filteredTopics: [],
      topicsPerHeroRow: 2,
      topicsPerRow: 3,
      keywords: ''
    };

    this.updatePagination = this.updatePagination.bind(this);
    this.updateFilteredTopics = this.updateFilteredTopics.bind(this);
  }

  componentWillMount() {
    this.updatePagination(this.props, this.state);
    this.updateFilteredTopics(this.props.topics, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.currentPage !== nextState.currentPage ||
        this.props.topics !== nextProps.topics
    ) {
      this.updatePagination(nextProps, nextState);
    }

    if (this.state.pagination !== nextState.pagination ||
      this.state.keywords !== nextState.keywords
    ) {
      this.updateFilteredTopics(nextProps.topics, nextState);
    }
  }

  updateFilteredTopics(topics, s) {
    let filteredTopics = topics;

    // Filter Based on Keywords
    if (s.keywords) {
      filteredTopics = (topics || []).filter(topic => topic.topic.toLowerCase().indexOf(s.keywords.toLowerCase()) >= 0);
    }

    // Filter Based on Pagination
    filteredTopics = filteredTopics.slice(s.lowerIndex, s.upperIndex === filteredTopics.length - 1 ? undefined : s.upperIndex + 1);

    this.setState({ filteredTopics });
  }

  updatePagination(p, s) {
    const range = s.currentPage === 1 ? 4 : 5;
    const lowerBump = s.currentPage < 3 ? 0 : (s.currentPage - 2);
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
        <div className="topics-search" >
          <Input
            isSearch
            isClearable
            placeholder="Search Topics"
            onChange={keywords => this.setState({ keywords })}
          />
        </div>
        {s.filteredTopics && s.filteredTopics.length ?
          <div className="topics">
            <TopicRows
              topics={s.filteredTopics}
              topicsPerRow={s.topicsPerRow}
              hasHeroRow={s.currentPage === 1}
              topicsPerHeroRow={s.topicsPerHeroRow}
              selectTopic={p.selectTopic}
            />
          </div> :
          <NullStateMessage message={s.nullMessage} />
        }
        {p.topics.length > 5 &&
          <Paginator pagination={s.pagination} />
        }
      </section>
    );
  }
}
