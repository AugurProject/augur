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
    // filterSort: PropTypes.object,
    // marketsHeader: PropTypes.object,
    // markets: PropTypes.array,
    // pagination: PropTypes.object,
    // keywords: PropTypes.string,
    // onChangeKeywords: PropTypes.func,
    // branch: PropTypes.object,
    loginAccount: PropTypes.object,
    // scalarShareDenomination: PropTypes.object,
    // location: PropTypes.object.isRequired,
    canLoadMarkets: PropTypes.bool.isRequired,
    hasLoadedMarkets: PropTypes.bool.isRequired,
    hasLoadedTopic: PropTypes.object.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    loadMarketsByTopic: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      canDisplayBranchInfo: !!(getValue(props, 'loginAccount.rep.value') && getValue(props, 'branch.id'))
    };
  }

  componentWillMount() {
    this.loadMarkets({
      canLoadMarkets: this.props.canLoadMarkets,
      location: this.props.location,
      hasLoadedTopic: this.props.hasLoadedTopic,
      hasLoadedMarkets: this.props.hasLoadedMarkets,
      loadMarkets: this.props.loadMarkets,
      loadMarketsByTopic: this.props.loadMarketsByTopic
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      (this.props.canLoadMarkets !== nextProps.canLoadMarkets && nextProps.canLoadMarkets) ||
      this.props.location !== nextProps.location ||
      this.props.hasLoadedTopic !== nextProps.hasLoadedTopic ||
      (this.props.hasLoadedMarkets !== nextProps.hasLoadedMarkets && !nextProps.hasLoadedMarkets)
    ) {
      this.loadMarkets({
        canLoadMarkets: nextProps.canLoadMarkets,
        location: nextProps.location,
        hasLoadedTopic: nextProps.hasLoadedTopic,
        hasLoadedMarkets: nextProps.hasLoadedMarkets,
        loadMarkets: nextProps.loadMarkets,
        loadMarketsByTopic: nextProps.loadMarketsByTopic
      });
    }

    if (
      getValue(this.props, 'loginAccount.rep.value') !== getValue(nextProps, 'loginAccount.rep.value') ||
      getValue(this.props, 'branch.id') !== getValue(nextProps, 'branch.id')
    ) {
      this.setState({
        canDisplayBranchInfo: !!(getValue(nextProps, 'loginAccount.rep.value') && getValue(nextProps, 'branch.id'))
      });
    }
  }

  loadMarkets(options) {
    if (options.canLoadMarkets) {
      const topic = parseSearch(options.location.search)[TOPIC_PARAM_NAME];

      if (topic && !this.props.hasLoadedTopic[topic]) {
        options.loadMarketsByTopic(topic);
      } else if (!this.props.hasLoadedMarkets) {
        options.loadMarkets();
      }
    }
  }

  render() {
    const p = this.props;

    return (
      <section id="markets_view">
        <Helmet>
          <title>Markets</title>
        </Helmet>
        {this.state.canDisplayBranchInfo &&
          <Branch {...p.branch} />
        }
        <MarketsHeaders
          loginAccount={p.loginAccount}
          marketsHeader={p.marketsHeader}
          filterSort={p.filterSort}
          keywords={p.keywords}
          onChangeKeywords={p.onChangeKeywords}
        />
      </section>
    );
  }
}


// <MarketsList
//   loginAccount={p.loginAccount}
//   markets={p.markets}
//   pagination={p.pagination}
//   scalarShareDenomination={p.scalarShareDenomination}
// />
