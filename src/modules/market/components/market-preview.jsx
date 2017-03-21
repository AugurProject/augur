import React from 'react';
import classnames from 'classnames';

import MarketBasics from 'modules/market/components/market-basics';
import MarketPreviewOutcomes from 'modules/market/components/market-preview-outcomes';
import Link from 'modules/link/components/link';

const MarketPreview = p => (
  <article className="market-preview">
    <div className="market-preview-details">
      <MarketBasics {...p} />

      {!!p.marketLink &&
        <div className="market-link">
          <Link
            {...p.marketLink}
            className={classnames('button', p.marketLink.className)}
          >
            {p.marketLink.text}
          </Link>
        </div>
      }
    </div>
    <MarketPreviewOutcomes outcomes={p.outcomes} />
  </article>
);

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
