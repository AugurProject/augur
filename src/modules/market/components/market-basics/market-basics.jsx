/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance as order remains the same

import React from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
// import classNames from 'classnames';

// import MarketProperties from 'modules/market/components/market-properties';

// import makePath from 'modules/app/helpers/make-path';
// import makeQuery from 'modules/app/helpers/make-query';

// import { MARKET } from 'modules/app/constants/views';
// import { MARKET_ID_PARAM_NAME, MARKET_DESCRIPTION_PARAM_NAME } from 'modules/app/constants/param-names';

import Styles from 'modules/market/components/market-basics/styles.less';

const MarketBasics = p => (
  <article className={Styles.MarketBasics}>
    <div className={Styles.MarketBasics__header}>
      <ul className={Styles.MarketBasics__tags}>
        <li>Tags</li>
        {(p.tags || []).map((tag, i) => (
          <li key={i}>
            {tag.name ? tag.name : tag}
          </li>
        ))}
      </ul>

      <span>{/* p.isOpen ? (p.isResported ? 'reported' : 'open') : 'closed' */}</span>
    </div>

    <h1>{ p.description }</h1>

    <div className={Styles.MarketBasics__footer}>
      <ul className={Styles.MarketBasics__meta}>
        <li>
          <span>Volume</span>
          <span>84K Shares</span>
        </li>
        <li>
          <span>Fee</span>
          <span>2.8%</span>
        </li>
        <li>
          <span>Expires</span>
          <span>June 9, 2017, 7:00 AM</span>
        </li>
      </ul>
      <div>
        <span>star</span>
        <button className="button--purple">Trade</button>
      </div>
    </div>

    {/* <div className="market-basics-header-actions">
      {p.isLogged && p.toggleFavorite &&
        <button
          className={classNames('button unstyled favorite-button', { on: p.isFavorite })}
          onClick={() => p.toggleFavorite(p.id)}
        >
          <i
            className={classNames('fa', {
              'fa-star': p.isFavorite,
              'fa-star-o': !p.isFavorite
            })}
          />
        </button>
      }
    </div> */}

    {/*
    {p.id && p.formattedDescription ?
      <Link
        to={{
          pathname: makePath(MARKET),
          search: makeQuery({
            [MARKET_DESCRIPTION_PARAM_NAME]: p.formattedDescription,
            [MARKET_ID_PARAM_NAME]: p.id
          })
        }}
        className="market-description"
      >
        {p.description}
      </Link> :
      <span className="market-description">{p.description}</span>
    }

    <MarketProperties {...p} /> */}
  </article>
);

MarketBasics.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func
};

export default MarketBasics;
