import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MarketPreview from 'modules/market/components/market-preview';
import Paginator from 'modules/common/components/paginator';
import NullStateMessage from 'modules/common/components/null-state-message';

import getValue from 'utils/get-value';

export default class MarketsList extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    markets: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    scalarShareDenomination: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      lowerBound: null,
      upperBound: null,
      boundedLength: null
    };

    this.setSegment = this.setSegment.bind(this);
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, upperBound, boundedLength });
  }

  // NOTE -- You'll notice the odd method used for rendering the previews, this is done for optimization reasons
  render() {
    const p = this.props;
    const s = this.state;

    const marketsLength = p.marketsFiltered.length;
    const shareDenominations = getValue(p, 'scalarShareDenomination.denominations');

    return (
      <article className="markets-list">
        {marketsLength && s.boundedLength ?
          [...Array(s.boundedLength)].map((unused, i) => {
            const item = p.marketsFiltered[(s.lowerBound - 1) + i];
            const market = p.markets[item];
            const selectedShareDenomination = market ? getValue(p, `scalarShareDenomination.markets.${market.id}`) : null;

            if (market && market.id) {
              return (
                <MarketPreview
                  key={market.id}
                  isLogged={p.isLogged}
                  {...market}
                  selectedShareDenomination={selectedShareDenomination}
                  shareDenominations={shareDenominations}
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
