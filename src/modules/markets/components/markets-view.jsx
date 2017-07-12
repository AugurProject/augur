import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import MarketsHeaders from 'modules/markets/components/markets-headers';
import MarketsList from 'modules/markets/components/markets-list';
import Branch from 'modules/branch/components/branch';

const MarketsView = p => (
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

MarketsView.propTypes = {
  className: PropTypes.string,
  filterSort: PropTypes.object,
  marketsHeader: PropTypes.object,
  markets: PropTypes.array,
  pagination: PropTypes.object,
  keywords: PropTypes.string,
  onChangeKeywords: PropTypes.func,
  branch: PropTypes.object,
  loginAccount: PropTypes.object,
  scalarShareDenomination: PropTypes.object
};

export default MarketsView;
