import React from 'react';
import ReactTooltip from 'react-tooltip';

import ValueDate from 'modules/common/components/value-date';
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination';

import getValue from 'utils/get-value';
import setShareDenomination from 'utils/set-share-denomination';
import shareDenominationLabel from 'utils/share-denomination-label';

import Styles from 'modules/market/components/market-properties/market-properties.styles';

const MarketProperties = (p) => {
  const shareVolumeRounded = setShareDenomination(getValue(p, 'volume.rounded'), p.selectedShareDenomination);
  const shareVolumeFormatted = getValue(p, 'volume.formatted');
  const shareDenomination = shareDenominationLabel(p.selectedShareDenomination, p.shareDenominations);

  return (
    <article>
      <ul className={Styles.MarketProperties__meta}>
        <li>
          <span>Volume</span>
          <ValueDenomination formatted={shareVolumeRounded} denomination={shareDenomination} />
        </li>
        <li>
          <span>Fee</span>
          <ValueDenomination {...p.takerFeePercent} />
        </li>
        <li>
          <span>Expires</span>
          <span>{ p.endDate.formatted }</span>
        </li>
      </ul>
      <div>
        { p.isLogged && p.toggleFavorite &&
          <button
            className={classNames(Styles.MarketProperties__favorite, { [`${Styles.favorite}`]: p.isFavorite })}
            onClick={() => p.toggleFavorite(p.id)}
          >
            <i />
          </button>
        }
        <button className={Styles.MarketProperties__trade}>Trade</button>
      </div>
    </article>
  );
};

export default MarketProperties;
