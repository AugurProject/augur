import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import MarketBasics from 'modules/market/components/market-basics';
import MarketPreviewOutcomes from 'modules/market/components/market-preview-outcomes';

import makePath from 'modules/app/helpers/make-path';
import makeQuery from 'modules/app/helpers/make-query';

import { listWordsUnderLength } from 'utils/list-words-under-length';

import { MARKET } from 'modules/app/constants/views';
import { MARKET_ID_PARAM_NAME, MAKRET_DESCRIPTION_PARAM_NAME } from 'modules/app/constants/param-names';

const MarketPreview = (p) => {
  let buttonText;
  let buttonClass;

  const formattedDescription = listWordsUnderLength(p.description, 100).map(word => encodeURIComponent(word.toLowerCase())).join('_');

  if (p.isReported) {
    buttonText = 'Reported';
    buttonClass = 'reported';
  } else if (p.isMissedReport) {
    buttonText = 'Missed Report';
    buttonClass = 'missed-report';
  } else if (p.isPendingReport) {
    buttonText = 'Report';
    buttonClass = 'report';
  } else if (!p.isOpen) {
    buttonText = 'View';
    buttonClass = 'view';
  } else {
    buttonText = 'Trade';
    buttonClass = 'trade';
  }

  return (
    <article className="market-preview">
      <div className="market-preview-details">
        <MarketBasics
          {...p}
          formattedDescription={formattedDescription}
        />

        {!!p.id && formattedDescription &&
          <div className="market-link">
            <Link
              to={{
                pathname: makePath(MARKET),
                search: makeQuery({
                  [MAKRET_DESCRIPTION_PARAM_NAME]: formattedDescription,
                  [MARKET_ID_PARAM_NAME]: p.id
                })
              }}
              className={classNames('button', buttonClass)}
            >
              {buttonText}
            </Link>
          </div>
        }
      </div>
      <MarketPreviewOutcomes outcomes={p.outcomes} />
    </article>
  );
};

MarketPreview.propTypes = {
  isLogged: PropTypes.bool.isLogged
};

// MarketPreview.propTypes = {
//   className: PropTypes.string,
//   description: PropTypes.string,
//   outcomes: PropTypes.array,
//   isOpen: PropTypes.bool,
//   isFavorite: PropTypes.bool,
//   isPendingReport: PropTypes.bool,
//   endDate: PropTypes.object,
//   tradingFeePercent: PropTypes.object,
//   volume: PropTypes.object,
//   tags: PropTypes.array,
//   marketLink: PropTypes.object,
//   onClickToggleFavorite: PropTypes.func
// };

export default MarketPreview;
