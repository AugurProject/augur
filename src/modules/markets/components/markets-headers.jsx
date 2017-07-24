import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MarketsFilterSort from 'modules/markets/components/markets-filter-sort';
import EmDash from 'modules/common/components/em-dash';

import makePath from 'modules/app/helpers/make-path';

import { CREATE_MARKET } from 'modules/app/constants/views';

const MarketsHeaders = p => (
  <article>
    <div className="view-header">
      <div className="view-header-group">
        <h2>
          Markets
          {p.marketsHeader.selectedMarketsHeader &&
            <span className="capitalized-header"> <EmDash /> {p.marketsHeader.selectedMarketsHeader} </span>
          }
        </h2>
      </div>
      <div className="view-header-group">
        {p.loginAccount && p.loginAccount.address &&
          <Link
            to={makePath(CREATE_MARKET)}
            className="button imperative navigational"
            disabled={!p.loginAccount.address}
          >
            + Create New Market
          </Link>
        }
      </div>
    </div>
    <MarketsFilterSort
      keywords={p.keywords}
      onChangeKeywords={p.onChangeKeywords}
      {...p.filterSort}
    />
  </article>
);

MarketsHeaders.propTypes = {
  className: PropTypes.string,
  loginAccount: PropTypes.object,
  marketsHeader: PropTypes.object,
  filterSort: PropTypes.object,
  keywords: PropTypes.string,
  onChangeKeywords: PropTypes.func
};

export default MarketsHeaders;
