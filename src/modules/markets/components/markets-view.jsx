import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import MarketsHeader from 'modules/markets/components/markets-header';
import MarketsList from 'modules/markets/components/markets-list';
import Branch from 'modules/branch/components/branch';

import getValue from 'utils/get-value';
import parseQuery from 'modules/app/helpers/parse-query';

import { TOPIC_PARAM_NAME } from 'modules/app/constants/param-names';

export default class MarketsView extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    loginAccount: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    canLoadMarkets: PropTypes.bool.isRequired,
    hasLoadedMarkets: PropTypes.bool.isRequired,
    hasLoadedTopic: PropTypes.object.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    loadMarketsByTopic: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    updateMarketsFilteredSorted: PropTypes.func.isRequired
    // filterSort: PropTypes.object,
    // marketsHeader: PropTypes.object,
    // pagination: PropTypes.object,
    // keywords: PropTypes.string,
    // onChangeKeywords: PropTypes.func,
    // branch: PropTypes.object,
    // scalarShareDenomination: PropTypes.object,
    // location: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      shouldDisplayBranchInfo: !!(getValue(props, 'loginAccount.rep.value') && getValue(props, 'branch.id')),
      marketsFiltered: []
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

  componentWillUpdate(nextProps, nextState) {
    if (this.state.marketsFiltered !== nextState.marketsFiltered) {
      // TODO -- update global state for tags (categories) display
      // console.log('changed!');
      // this.props.updateMarketsFilteredSorted(nextState.marketsFiltered);
    }
  }

  loadMarkets(options) {
    if (options.canLoadMarkets) {
      const topic = parseQuery(options.location.search)[TOPIC_PARAM_NAME];

      if (topic && !this.props.hasLoadedTopic[topic]) {
        options.loadMarketsByTopic(topic);
      } else if (!topic && !this.props.hasLoadedMarkets) {
        options.loadMarkets();
      }
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <section id="markets_view">
        <Helmet>
          <title>Markets</title>
        </Helmet>
        {this.state.shouldDisplayBranchInfo &&
          <Branch {...p.branch} />
        }
        <MarketsHeader
          isLogged={p.isLogged}
          location={p.location}
          history={p.history}
          markets={p.markets}
          updateFilteredItems={marketsFiltered => this.setState({ marketsFiltered })}
        />
        <MarketsList
          isLogged={p.isLogged}
          markets={p.markets}
          marketsFiltered={s.marketsFiltered}
          location={p.location}
          history={p.history}
          scalarShareDenomination={p.scalarShareDenomination}
        />
      </section>
    );
  }
}
