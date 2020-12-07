import React from 'react';
import * as Styles from 'modules/markets/markets-view.styles.less';
import makePath from 'modules/routes/helpers/make-path';
import { MARKET } from 'modules/constants';
import { Link } from 'react-router-dom';


const MarketsView = () => {
  return (
    <div className={Styles.MarketView}>
      <div>Markets View Stats Section Box thing</div>
      <ul>
        <li>filter dropdown</li>
        <li>filter dropdown</li>
        <li>filter dropdown</li>
        <li>filter dropdown</li>
      </ul>
      <section>
        <article><Link to={makePath(MARKET)}>This is a Market Card In the Markets View</Link></article>
        <article><Link to={makePath(MARKET)}>This is a Market Card In the Markets View</Link></article>
        <article><Link to={makePath(MARKET)}>This is a Market Card In the Markets View</Link></article>
      </section>
    </div>
  );
};

export default MarketsView;
