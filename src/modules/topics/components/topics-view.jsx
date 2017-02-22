import React, { Component, PropTypes } from 'react';

import NullStateMessage from 'modules/common/components/null-state-message';
import TopicRows from 'modules/topics/components/topic-rows';
import Paginator from 'modules/common/components/paginator';
import Input from 'modules/common/components/input';
import Branch from 'modules/branch/components/branch';

export default class TopicsView extends Component {
  static propTypes = {
    topics: PropTypes.array,
    branch: PropTypes.object,
    loginAccount: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      nullMessage: 'No Topics Available',
      keywords: '',
      currentPage: 1,
      lowerIndex: 0,
      upperIndex: 4,
      // Adjust these to change topic layout
      numberOfRows: 3,
      topicsPerHeroRow: 2,
      topicsPerRow: 4,
      // ---
      filteredTopics: props.topics,
      paginatedTopics: [],
      pagination: {},
      fontAwesomeClasses: [],
      icoFontClasses: []
    };

    this.updatePagination = this.updatePagination.bind(this);
    this.filterByKeywords = this.filterByKeywords.bind(this);
    this.paginateFilteredTopics = this.paginateFilteredTopics.bind(this);
    this.filterOutIconClassesFromStylesheets = this.filterOutIconClassesFromStylesheets.bind(this);
  }

  componentWillMount() {
    this.updatePagination(this.props, this.state);
  }

  componentDidMount() {
    console.log('### component DID mount');

    this.filterOutIconClassesFromStylesheets();
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
    const range = s.currentPage === 1 && !s.keywords ? (((s.numberOfRows - 1) * s.topicsPerRow) + s.topicsPerHeroRow) - 1 : (s.numberOfRows * s.topicsPerRow) - 1;
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
    }, () => {
      this.paginateFilteredTopics(this.state);
    });
  }

  filterOutIconClassesFromStylesheets() {
    // Get all classes from stylesheets for Font Awesome + Icofont
    const fontAwesomeClasses = [];
    const icoFontClasses = [];

    const styleSheets = window.document.styleSheets;

    for (let sI = 0; sI < styleSheets.length; sI++) {
      try {
        const sheet = styleSheets[sI];
        const ruleLength = sheet.cssRules ? sheet.cssRules.length : 0;
        for (let rI = 0; rI < ruleLength; rI++) {
          const rule = sheet.cssRules[rI];

          // Filter out Font Awesome icon classes
          if (rule.selectorText && rule.selectorText.indexOf('fa-') !== -1) {
            const selectors = rule.selectorText.split(/([: ,.])/);
            selectors.forEach((selector) => {
              if (selector.indexOf('fa-') !== -1) {
                fontAwesomeClasses.push(selector);
              }
            });
          }

          // Filter out Icofont icon classes
          if (rule.selectorText && rule.selectorText.indexOf('icofont-') !== -1) {
            const selectors = rule.selectorText.split(/([: ,.])/);
            selectors.forEach((selector) => {
              if (selector.indexOf('icofont-') !== -1) {
                icoFontClasses.push(selector);
              }
            });
          }
        }
      } catch (e) {
        // Silently Fail --
        //  Mixed protocols can cause 'cssRules' to be inaccesible
        //  Stylesheets pulled remotely are not needed for our purposes here, so silently failing
      }
    }

    this.setState({ fontAwesomeClasses, icoFontClasses });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <section id="topics_view">
        <div id="topics_container">
          {!!p.loginAccount.rep && !!p.loginAccount.rep.value && !!p.branch.id &&
            <Branch {...p.branch} />
          }
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
                fontAwesomeClasses={s.fontAwesomeClasses}
                icoFontClasses={s.icoFontClasses}
              />
            </div> :
            <NullStateMessage message={s.nullMessage} />
          }
          {!!s.filteredTopics.length &&
            <Paginator pagination={s.pagination} />
          }
        </div>
      </section>
    );
  }
}
