import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import MarketsHeaders from 'modules/markets/components/markets-headers';
import MarketsList from 'modules/markets/components/markets-list';
import Branch from 'modules/branch/components/branch';

import getValue from 'utils/get-value';
import parseSearch from 'modules/app/helpers/parse-search';

import { TOPIC_PARAM_NAME } from 'modules/app/constants/param-names';

export default class MarketsView extends Component {
  static propTypes = {
    filterSort: PropTypes.object,
    marketsHeader: PropTypes.object,
    markets: PropTypes.array,
    pagination: PropTypes.object,
    keywords: PropTypes.string,
    onChangeKeywords: PropTypes.func,
    branch: PropTypes.object,
    loginAccount: PropTypes.object,
    scalarShareDenomination: PropTypes.object,
    location: PropTypes.object.isRequired,
    hasLoadedMarkets: PropTypes.bool.isRequired,
    hasLoadedTopic: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log('wil -- ', this.props);

    const searchParams = parseSearch(this.props.location.search);
    console.log('searchParams -- ', searchParams);

    if (searchParams.TOPIC_PARAM_NAME) {
      if (!this.props.hasLoadedTopic[searchParams.TOPIC_PARAM_NAME]) {
        // Load Markets By Topic
      }
    } else if (!this.props.hasLoadedMarkets) {
      // Load Markets
    }
  }

  render() {
    const p = this.props;

    return (
      <section id="markets_view">
        <Helmet>
          <title>Markets</title>
        </Helmet>
        {!!p.loginAccount.rep && !!p.loginAccount.rep.value && !!p.branch.id &&
          <Branch {...p.branch} />
        }
        <MarketsHeaders
          createMarketLink={p.createMarketLink}
          loginAccount={p.loginAccount}
          marketsHeader={p.marketsHeader}
          filterSort={p.filterSort}
          keywords={p.keywords}
          onChangeKeywords={p.onChangeKeywords}
        />
        <MarketsList
          loginAccount={p.loginAccount}
          markets={p.markets}
          pagination={p.pagination}
          scalarShareDenomination={p.scalarShareDenomination}
        />
      </section>
    );
  }
}
