import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MarketPreview from 'modules/market/components/market-preview';
import Paginator from 'modules/common/components/paginator';
import NullStateMessage from 'modules/common/components/null-state-message';

import getValue from 'utils/get-value';

export default class MarketsList extends Component {
  static propTypes = {
    loginAccount: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    scalarShareDenomination: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      marketsPaginated: [] // Ultimately set by the paginator component's `setSegement` prop method
    };

    this.setMarketsPaginated = this.setMarketsPaginated.bind(this);
  }

  setMarketsPaginated(marketsPaginated) {
    this.setState({ marketsPaginated });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className="markets-list">
        {p.markets.length ?
          s.marketsPaginated.map((market) => {
            const selectedShareDenomination = getValue(p, `scalarShareDenomination.markets.${market.id}`);
            const shareDenominations = getValue(p, 'scalarShareDenomination.denominations');

            return (
              <MarketPreview
                key={market.id}
                loginAccount={p.loginAccount}
                {...market}
                selectedShareDenomination={selectedShareDenomination}
                shareDenominations={shareDenominations}
              />
            );
          }) :
          <NullStateMessage message={'No Markets Available'} /> }
        {p.markets &&
          <Paginator
            items={p.markets}
            itemsPerPage={100}
            location={p.location}
            setSegment={this.setMarketsPaginated}
          />
        }
      </article>
    );
  }
}
