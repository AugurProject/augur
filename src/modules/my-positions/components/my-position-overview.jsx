import React, { PropTypes } from 'react';

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
  description: PropTypes.string.isRequired,
  marketLink: PropTypes.object.isRequired
};

export default PositionsMarketOverview;
