import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination';

import makePath from 'modules/app/helpers/make-path';
import makeQuery from 'modules/app/helpers/make-query';

import { MARKET } from 'modules/app/constants/views';
import { MARKET_ID_PARAM_NAME, MARKET_DESCRIPTION_PARAM_NAME } from 'modules/app/constants/param-names';

import getValue from 'utils/get-value';
import setShareDenomination from 'utils/set-share-denomination';
import shareDenominationLabel from 'utils/share-denomination-label';

import Styles from 'modules/market/components/market-properties/market-properties.styles';

const MarketProperties = (p) => {
  const shareVolumeRounded = setShareDenomination(getValue(p, 'volume.rounded'), p.selectedShareDenomination);
  const shareDenomination = shareDenominationLabel(p.selectedShareDenomination, p.shareDenominations);

  let buttonText;

  if (p.isReported) {
    buttonText = 'Reported';
  } else if (p.isMissedReport) {
    buttonText = 'Missed Report';
  } else if (p.isPendingReport) {
    buttonText = 'Report';
  } else if (!p.isOpen) {
    buttonText = 'View';
  } else {
    buttonText = 'Trade';
  }

  return (
    <article className={Styles.MarketProperties}>
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
        { !!p.id && p.formattedDescription &&
          <Link
            className={Styles.MarketProperties__trade}
            to={{
              pathname: makePath(MARKET),
              search: makeQuery({
                [MARKET_DESCRIPTION_PARAM_NAME]: p.formattedDescription,
                [MARKET_ID_PARAM_NAME]: p.id
              })
            }}
          >
            { buttonText }
          </Link>
        }
      </div>
    </article>
  );
};

export default MarketProperties;
