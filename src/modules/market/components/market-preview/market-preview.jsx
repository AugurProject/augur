import React from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
// import classNames from 'classnames';

import MarketBasics from 'modules/market/components/market-basics/market-basics';
// import MarketPreviewOutcomes from 'modules/market/components/market-preview-outcomes';

// import makePath from 'modules/app/helpers/make-path';
// import makeQuery from 'modules/app/helpers/make-query';

// import { MARKET } from 'modules/app/constants/views';
// import { MARKET_ID_PARAM_NAME, MARKET_DESCRIPTION_PARAM_NAME } from 'modules/app/constants/param-names';

import Styles from 'modules/market/components/market-preview/styles';

const MarketPreview = p => (
  // let buttonText;
  // let buttonClass;

  // if (p.isReported) {
  //   buttonText = 'Reported';
  //   buttonClass = 'reported';
  // } else if (p.isMissedReport) {
  //   buttonText = 'Missed Report';
  //   buttonClass = 'missed-report';
  // } else if (p.isPendingReport) {
  //   buttonText = 'Report';
  //   buttonClass = 'report';
  // } else if (!p.isOpen) {
  //   buttonText = 'View';
  //   buttonClass = 'view';
  // } else {
  //   buttonText = 'Trade';
  //   buttonClass = 'trade';
  // }

  <article className={Styles.MarketPreview}>
    <div className={Styles.MarketPreview__details}>
      <MarketBasics
        {...p}
        toggleFavorite={p.toggleFavorite}
      />
      {/*
      {!!p.id && p.formattedDescription &&
        <div className="market-link">
          <Link
            to={{
              pathname: makePath(MARKET),
              search: makeQuery({
                [MARKET_DESCRIPTION_PARAM_NAME]: p.formattedDescription,
                [MARKET_ID_PARAM_NAME]: p.id
              })
            }}
            className={classNames('button', buttonClass)}
          >
            {buttonText}
          </Link>
        </div>
      }
    */}
    </div>
    {/* <MarketPreviewOutcomes outcomes={p.outcomes} /> */}
  </article>
);

MarketPreview.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired
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
//   onClickToggleFavorite: PropTypes.func
// };

export default MarketPreview;
