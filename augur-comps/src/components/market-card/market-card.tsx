import React from 'react';
import Styles from './market-card.styles.less';

export const LoadingMarketCard = () => {
    return (<article className={Styles.LoadingMarketCard}>
      <div>
        <div />
        <div />
        <div />
      </div>
      <div>
        <div />
        <div />
        <div />
      </div>
      <div>
        <div />
        <div />
        <div />
      </div>
    </article>);
}