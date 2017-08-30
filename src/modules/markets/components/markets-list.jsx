import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MarketPreview from 'modules/market/components/market-preview/market-preview';
import Paginator from 'modules/common/components/paginator/paginator';
import NullStateMessage from 'modules/common/components/null-state-message';

import parseQuery from 'modules/app/helpers/parse-query';
import parseStringToArray from 'modules/app/helpers/parse-string-to-array';
import makeQuery from 'modules/app/helpers/make-query';

import getValue from 'utils/get-value';
import isEqual from 'lodash/isEqual';

import debounce from 'utils/debounce';

import { TAGS_PARAM_NAME } from 'modules/app/constants/param-names';

export default class MarketsList extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    isLogged: PropTypes.bool.isRequired,
    markets: PropTypes.array.isRequired,
    filteredMarkets: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    scalarShareDenomination: PropTypes.object.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfo: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      lowerBound: null,
      boundedLength: null,
      marketIDsMissingInfo: [] // This is ONLY the currently displayed markets that are missing info
    };

    this.setSegment = this.setSegment.bind(this);
    this.setMarketIDsMissingInfo = this.setMarketIDsMissingInfo.bind(this);
    this.loadMarketsInfo = debounce(this.loadMarketsInfo.bind(this));
    this.toggleTag = this.toggleTag.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.lowerBound !== nextState.lowerBound ||
      this.state.boundedLength !== nextState.boundedLength ||
      !isEqual(this.props.filteredMarkets, nextProps.filteredMarkets)
    ) {
      this.setMarketIDsMissingInfo(nextProps.markets, nextProps.filteredMarkets, nextState.lowerBound, nextState.boundedLength);
    }

    if (!isEqual(this.state.marketIDsMissingInfo, nextState.marketIDsMissingInfo)) this.loadMarketsInfo(nextState.marketIDsMissingInfo);
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, boundedLength });
  }

  setMarketIDsMissingInfo(markets, filteredMarkets, lowerBound, boundedLength) {
    const marketIDsMissingInfo = [];
    if (filteredMarkets.length && boundedLength) {
      [...Array(boundedLength)].forEach((unused, i) => {
        const item = filteredMarkets[(lowerBound - 1) + i];
        const market = markets[item];
        if (market && !market.isLoadedMarketInfo && !market.isMarketLoading) marketIDsMissingInfo.push(market.id);
      });
    }

    this.setState({ marketIDsMissingInfo });
  }

  loadMarketsInfo(marketIDs) {
    this.props.loadMarketsInfo(marketIDs);
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

  // NOTE -- You'll notice the odd method used for rendering the previews, this is done for optimization reasons
  render() {
    const p = this.props;
    const s = this.state;

    const marketsLength = p.filteredMarkets.length;
    const shareDenominations = getValue(p, 'scalarShareDenomination.denominations');

    return (
      <article className="markets-list">
        {marketsLength && s.boundedLength ?
          [...Array(s.boundedLength)].map((unused, i) => {
            const item = p.filteredMarkets[(s.lowerBound - 1) + i];
            const market = p.markets[item];
            const selectedShareDenomination = market ? getValue(p, `scalarShareDenomination.markets.${market.id}`) : null;

            if (market && market.id) {
              return (
                <MarketPreview
                  {...market}
                  key={`${market.id} - ${market.outcomes}`}
                  isLogged={p.isLogged}
                  selectedShareDenomination={selectedShareDenomination}
                  shareDenominations={shareDenominations}
                  toggleFavorite={p.toggleFavorite}
                  toggleTag={this.toggleTag}
                />
              );
            }

            return null;
          }) :
          <NullStateMessage message={'No Markets Available'} /> }
        {!!marketsLength &&
          <Paginator
            itemsLength={marketsLength}
            itemsPerPage={10}
            location={p.location}
            history={p.history}
            setSegment={this.setSegment}
          />
        }
      </article>
    );
  }
}
