import React from 'react';

import Link from 'modules/link/components/link';

const PositionsMarketOverview = p => (
  <article className="my-positions-overview portfolio-market-overview">
    <Link
      href={p.marketLink.href}
      onClick={p.marketLink.onClick}
    >
      <span className="my-positions-market-description">{p.description}</span>
    </Link>
  </article>
);

PositionsMarketOverview.propTypes = {
  description: React.PropTypes.string.isRequired
};

export default PositionsMarketOverview;
