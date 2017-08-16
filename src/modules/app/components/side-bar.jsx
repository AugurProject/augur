import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import Checkbox from 'modules/common/components/checkbox';
import NullStateMessage from 'modules/common/components/null-state-message';

import parseQuery from 'modules/app/helpers/parse-query';
import parseStringToArray from 'modules/app/helpers/parse-string-to-array';
import makeQuery from 'modules/app/helpers/make-query';

import { TAGS_PARAM_NAME } from 'modules/app/constants/param-names';

// import Checkbox from 'modules/common/components/checkbox';
// import NullStateMessage from 'modules/common/components/null-state-message';

// This is a funky special case for how filtering works, normally this would directly employ the filter-sort components

// NOTE --
// Take in filteredMarkets + markets

// From that data, re-calc the tags + counts
// Toggling tags will directly update the query params, which will trigger an update to the filters

export default class SideBar extends Component {
  static propTypes = {
    markets: PropTypes.array.isRequired,
    marketsFilteredSorted: PropTypes.array.isRequired,
    headerHeight: PropTypes.number.isRequired,
    footerHeight: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      filteredMarkets: [],
      filteredTags: []
    };

    this.updateFilteredMarketTags = this.updateFilteredMarketTags.bind(this);
    this.toggleTag = this.toggleTag.bind(this);
  }

  componentWillMount() {
    this.updateFilteredMarketTags(this.props.markets, this.props.marketsFilteredSorted, this.props.location);
  }

  componentWillReceiveProps(nextProps) {
    if (
      !isEqual(this.props.markets, nextProps.markets) ||
      !isEqual(this.props.marketsFilteredSorted, nextProps.marketsFilteredSorted) ||
      !isEqual(this.props.location.search, nextProps.location.search)
    ) {
      this.updateFilteredMarketTags(nextProps.markets, nextProps.marketsFilteredSorted, nextProps.location);
    }
  }

  toggleTag(tag) {
    let searchParams = parseQuery(this.props.location.search);

    if (searchParams[TAGS_PARAM_NAME] == null || !searchParams[TAGS_PARAM_NAME].length) {
      searchParams[TAGS_PARAM_NAME] = [encodeURIComponent(tag)];
      searchParams = makeQuery(searchParams);

      return this.props.history.push({
        ...this.props.location,
        search: searchParams
      });
    }

    const tags = parseStringToArray(decodeURIComponent(searchParams[TAGS_PARAM_NAME]), '+');

    if (tags.indexOf(tag) !== -1) { // Remove Tag
      tags.splice(tags.indexOf(tag), 1);
    } else { // add tag
      tags.push(tag);
    }

    if (tags.length) {
      searchParams[TAGS_PARAM_NAME] = tags.join('+');
    } else {
      delete searchParams[TAGS_PARAM_NAME];
    }

    searchParams = makeQuery(searchParams);

    this.props.history.push({
      ...this.props.location,
      search: searchParams
    });
  }

  updateFilteredMarketTags(markets, marketsFilteredSorted, location) {
    const tagCounts = {};

    // count matches for each filter and tag
    markets.forEach((market, i) => {
      if (marketsFilteredSorted.indexOf(i) !== -1) {
        market.tags.forEach((tag) => {
          tagCounts[tag] = tagCounts[tag] || 0;
          tagCounts[tag] += 1;
        });
      }
    });

    // make sure all selected tags are displayed, even if markets haven't loaded yet
    const selectedTags = parseStringToArray(decodeURIComponent(parseQuery(location.search)[TAGS_PARAM_NAME] || ''), '+');

    selectedTags.forEach((selectedTag) => {
      if (!tagCounts[selectedTag]) {
        tagCounts[selectedTag] = 0;
      }
    });

    const filteredTags = Object.keys(tagCounts)
      .filter(tag => tagCounts[tag] > 0 || selectedTags.indexOf(tag) !== -1)
      .sort((a, b) => (tagCounts[b] - tagCounts[a]) || (a < b ? -1 : 1))
      .slice(0, 50)
      .map((tag) => {
        const obj = {
          name: tag,
          numMatched: tagCounts[tag],
          isSelected: (selectedTags || []).indexOf(tag) !== -1
        };
        return obj;
      });

    this.setState({ filteredTags });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <aside
        className="side-bar"
        style={{
          top: p.headerHeight,
          bottom: p.footerHeight
        }}
      >
        <h3>All Tags</h3>
        <div className="tags">
          {s.filteredTags.length ?
            s.filteredTags.map(tag =>
              <Checkbox
                key={tag.name}
                className="tag"
                text={tag.name}
                text2={`(${tag.numMatched})`}
                isChecked={tag.isSelected}
                onClick={() => this.toggleTag(tag.name)}
              />
            ) :
            <NullStateMessage message="No Tags Available" />
          }
        </div>
      </aside>
    );
  }
}
