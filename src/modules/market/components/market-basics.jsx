/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance as order remains the same

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import MarketProperties from 'modules/market/components/market-properties';

import makePath from 'modules/app/helpers/make-path';
import makeQuery from 'modules/app/helpers/make-query';

import { MARKET } from 'modules/app/constants/views';
import { MARKET_ID_PARAM_NAME, MAKRET_DESCRIPTION_PARAM_NAME } from 'modules/app/constants/param-names';

const MarketBasics = p => (
  <article className="market-basics">
    <div className="market-basics-header">
      <div className="market-basics-header-tags">
        <ul className="tags">
          {(p.tags || []).map((tag, i) => (
            <li
              key={i}
              className={classNames('tag pointer', { link: !!tag.name })}
            >
              <button
                className="unstyled"
                onClick={tag.onClick && tag.onClick}
              >
                {tag.name ? tag.name : tag}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="market-basics-header-actions">
        {p.isLogged && p.onClickToggleFavorite &&
          <button
            className={classNames('button unstyled favorite-button', { on: p.isFavorite })}
            onClick={p.onClickToggleFavorite}
          >
            <i
              className={classNames('fa', {
                'fa-star': p.isFavorite,
                'fa-star-o': !p.isFavorite
              })}
            />
          </button>
        }
      </div>
    </div>

    {p.id && p.formattedDescription ?
      <Link
        to={{
          pathname: makePath(MARKET),
          search: makeQuery({
            [MAKRET_DESCRIPTION_PARAM_NAME]: p.formattedDescription,
            [MARKET_ID_PARAM_NAME]: p.id
          })
        }}
        className="market-description"
      >
        {p.description}
      </Link> :
      <span className="market-description">{p.description}</span>
    }

    <MarketProperties {...p} />
  </article>
);

MarketBasics.propTypes = {
  isLogged: PropTypes.bool.isRequired
};

export default MarketBasics;
