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
      filteredTopics: props.topics,
      paginatedTopics: [],
      topicsPerHeroRow: 2,
      topicsPerRow: 3,
      keywords: ''
    };

    this.updatePagination = this.updatePagination.bind(this);
    this.filterByKeywords = this.filterByKeywords.bind(this);
    this.paginateFilteredTopics = this.paginateFilteredTopics.bind(this);
  }

  componentWillMount() {
    this.updatePagination(this.props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.topics !== nextProps.topics) {
      this.setState({ filteredTopics: nextProps.topics });
    }
    if (this.state.keywords !== nextState.keywords) {
      this.filterByKeywords(nextProps.topics, nextState);
    }
    if (
      this.state.filteredTopics !== nextState.filteredTopics ||
      this.state.currentPage !== nextState.currentPage
    ) {
      this.updatePagination(nextProps, nextState);
    }
    if (this.state.pagination !== nextState.pagination) {
      this.paginateFilteredTopics(nextState);
    }
  }

  filterByKeywords(topics, s) {
    let filteredTopics = topics;

    // Filter Based on Keywords
    if (s.keywords) {
      filteredTopics = (topics || []).filter(topic => topic.topic.toLowerCase().indexOf(s.keywords.toLowerCase()) >= 0);
    }

    if (filteredTopics !== s.filteredTopics) {
      this.setState({
        currentPage: 1, // Reset pagination
        filteredTopics
      });
    }
  }

  paginateFilteredTopics(s) {
    // Filter Based on Pagination
    const paginatedTopics = s.filteredTopics.slice(s.lowerIndex, s.upperIndex === s.filteredTopics.length - 1 ? undefined : s.upperIndex + 1);

    if (paginatedTopics !== s.paginatedTopics) {
      this.setState({ paginatedTopics });
    }
  }

  updatePagination(p, s) {
    const range = s.currentPage === 1 && !s.keywords ? 4 : 5;
    const keywordsLowerBump = (s.keywords && s.currentPage === 2) ? 1 : 0;
    const lowerBump = s.currentPage < 3 ? keywordsLowerBump : (s.currentPage - 2);
    const lowerIndex = ((s.currentPage - 1) * range) + lowerBump;
    const upperIndex = s.filteredTopics.length - 1 >= lowerIndex + range ?
      lowerIndex + range :
      s.filteredTopics.length - 1;

    this.setState({
      lowerIndex,
      upperIndex,
      pagination: {
        ...s.pagination,
        startItemNum: lowerIndex + 1,
        endItemNum: upperIndex + 1,
        numUnpaginated: s.filteredTopics.length,
        previousPageNum: s.currentPage > 1 ? s.currentPage - 1 : null,
        previousPageLink: {
          onClick: () => {
            if (s.currentPage > 1) {
              this.setState({ currentPage: s.currentPage - 1 });
            }
          }
        },
        nextPageNum: upperIndex < s.filteredTopics.length - 1 ? s.currentPage + 1 : null,
        nextPageLink: {
          onClick: () => {
            if (upperIndex < s.filteredTopics.length - 1) {
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
        {s.filteredTopics.length ?
          <div className="topics">
            <TopicRows
              topics={s.paginatedTopics}
              topicsPerRow={s.topicsPerRow}
              hasHeroRow={s.currentPage === 1}
              topicsPerHeroRow={s.topicsPerHeroRow}
              selectTopic={p.selectTopic}
              isSearchResult={!!s.keywords}
            />
          </div> :
          <NullStateMessage message={s.nullMessage} />
        }
        {!!s.filteredTopics.length &&
          <Paginator pagination={s.pagination} />
        }
      </section>
    );
  }
}
