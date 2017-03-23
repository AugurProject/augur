import React from 'react';

import Link from 'modules/link/components/link';
import ValueDenomination from 'modules/common/components/value-denomination';

const PositionsMarketOverview = p => (
  <article className="my-positions-market-overview">
    <Link
      href={p.marketLink.href}
      onClick={p.marketLink.onClick}
    >
      <span className="my-positions-market-description">{p.description}</span>
    </Link>
    <div className="my-position-group">
      <div className="my-position-pair realized-net">
        <span className="title">total realized P/L</span>
        <ValueDenomination {...p.realizedNet} />
      </div>
      <div className="my-position-pair unrealized-net">
        <span className="title">total unrealized P/L</span>
        <ValueDenomination {...p.unrealizedNet} />
      </div>
      <div className="my-position-pair total-net">
        <span className="title">total P/L</span>
        <ValueDenomination {...p.totalNet} />
      </div>
    </div>
  </article>
);

PositionsMarketOverview.propTypes = {
  description: React.PropTypes.string.isRequired,
  unrealizedNet: React.PropTypes.object.isRequired,
  realizedNet: React.PropTypes.object.isRequired
};

export default PositionsMarketOverview;
