/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance as order remains the same

import React from 'react';
import classNames from 'classnames';

import MarketProperties from 'modules/market/components/market-properties';
import Link from 'modules/link/components/link';

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
        {p.loginAccount && p.loginAccount.address && p.onClickToggleFavorite &&
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

    {p.marketLink ?
      <Link
        {...p.marketLink}
        onClick={p.marketLink.onClick}
        className="market-description"
      >
        {p.description}
      </Link> :
      <span className="market-description">{p.description}</span>
    }

    <MarketProperties {...p} />
  </article>
);

export default MarketBasics;
