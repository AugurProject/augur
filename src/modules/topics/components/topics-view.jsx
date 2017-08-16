import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import NullStateMessage from 'modules/common/components/null-state-message';
import TopicRows from 'modules/topics/components/topic-rows';
import Paginator from 'modules/common/components/paginator';
import Branch from 'modules/branch/components/branch';
import FilterSort from 'modules/filter-sort/container';

import parseQuery from 'modules/app/helpers/parse-query';
import makePath from 'modules/app/helpers/make-path';
import getValue from 'utils/get-value';

import { PAGINATION_PARAM_NAME } from 'modules/app/constants/param-names';
import { CREATE_MARKET } from 'modules/app/constants/views';

import GraphBG from 'modules/common/components/graph-background';

export default class TopicsView extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isLogged: PropTypes.bool.isRequired,
    topics: PropTypes.array,
    branch: PropTypes.object,
    loginAccount: PropTypes.object
  }

  constructor(props) {
    super(props);

    // Adjust these to change topic layout
    this.topicsConfig = {
      numberOfRows: 3,
      topicsPerHeroRow: 2,
      topicsPerRow: 4,
    };

    this.searchKeys = ['topic'];

    this.state = {
      lowerBound: null,
      upperBound: null,
      boundedLength: null,
      currentPage: null,
      itemsPerPage: 0,
      filteredTopics: [],
      filteredTopicsLength: 0,
      hasKeywords: false,
      paginatedTopics: [],
      pagination: {},
      fontAwesomeClasses: [],
      icoFontClasses: []
    };

    this.setCurrentPage = this.setCurrentPage.bind(this);
    this.setItemsPerPage = this.setItemsPerPage.bind(this);
    this.setSegment = this.setSegment.bind(this);
    this.filterOutIconClassesFromStylesheets = this.filterOutIconClassesFromStylesheets.bind(this);
    this.updateFilteredItems = this.updateFilteredItems.bind(this);
  }

  componentWillMount() {
    this.setCurrentPage(this.props.location);
    this.setItemsPerPage(this.state.currentPage, this.state.hasKeywords);
  }

  componentDidMount() {
    this.filterOutIconClassesFromStylesheets();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) this.setCurrentPage(nextProps.location);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.currentPage !== nextState.currentPage ||
      this.state.hasKeywords !== nextState.hasKeywords
    ) {
      this.setItemsPerPage(nextState.currentPage, nextState.hasKeywords);
    }
  }

  setCurrentPage(location) {
    const currentPage = parseInt(parseQuery(location.search)[PAGINATION_PARAM_NAME] || 1, 10);

    this.setState({ currentPage });
  }

  setItemsPerPage(currentPage, hasKeywords) {
    let itemsPerPage;
    if ((currentPage === null || currentPage === 1) && !hasKeywords) {
      itemsPerPage = ((this.topicsConfig.numberOfRows - 1) * this.topicsConfig.topicsPerRow) + this.topicsConfig.topicsPerHeroRow;
    } else {
      itemsPerPage = this.topicsConfig.numberOfRows * this.topicsConfig.topicsPerRow;
    }

    this.setState({ itemsPerPage });
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, upperBound, boundedLength });
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

  updateFilteredItems(filteredTopics) {
    this.setState({
      filteredTopics,
      filteredTopicsLength: filteredTopics.length,
      hasKeywords: filteredTopics.length !== getValue(this.props, 'topics.length') // Inferred
    });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <section id="topics_view">
        <GraphBG />
        <div id="topics_container">
          {!!p.loginAccount && !!p.loginAccount.rep && !!p.loginAccount.rep.value && !!p.branch.id &&
            <Branch {...p.branch} />
          }
          <div className="topics-header">
            <div className={classNames('topics-search', { 'only-search': !p.isLogged })}>
              <FilterSort
                items={p.topics}
                updateFilteredItems={this.updateFilteredItems}
                searchPlaceholder="Search Topics"
                searchKeys={this.searchKeys}
                filterBySearch
              />
            </div>
            {p.loginAccount && p.loginAccount.address &&
              <Link
                to={makePath(CREATE_MARKET)}
                className="link button imperative navigational"
                disabled={!p.loginAccount.address}
              >
                + Create New Market
              </Link>
            }
          </div>
          {s.filteredTopicsLength && s.boundedLength ?
            <div className="topics">
              <TopicRows
                topics={p.topics}
                filteredTopics={s.filteredTopics}
                numberOfRows={this.topicsConfig.numberOfRows}
                topicsPerRow={this.topicsConfig.topicsPerRow}
                topicsPerHeroRow={this.topicsConfig.topicsPerHeroRow}
                hasHeroRow={s.currentPage === 1}
                lowerBound={s.lowerBound}
                boundedLength={s.boundedLength}
                hasKeywords={s.hasKeywords}
                fontAwesomeClasses={s.fontAwesomeClasses}
                icoFontClasses={s.icoFontClasses}
              />
            </div> :
            <NullStateMessage message={'No Topics Available'} />
          }
          {!!s.filteredTopicsLength &&
            <Paginator
              itemsLength={s.filteredTopicsLength}
              itemsPerPage={s.itemsPerPage}
              location={p.location}
              history={p.history}
              setSegment={this.setSegment}
            />
          }
        </div>
      </section>
    );
  }
}
