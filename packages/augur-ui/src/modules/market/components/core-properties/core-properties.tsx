import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SCALAR } from 'modules/common/constants';
import Styles from 'modules/market/components/core-properties/core-properties.styles.less';
import getValue from 'utils/get-value';
import { PropertyLabel, TimeLabel } from 'modules/common/labels';
import {
  formatPercent,
  formatDai,
  formatNone,
  formatNumber,
} from 'utils/format-number';
import MarketScalarOutcomeDisplay from '../market-scalar-outcome-display/market-scalar-outcome-display';
import ChevronFlip from 'modules/common/chevron-flip';

// TODO: Get market 24 hour volume, currently just using volume
const CoreProperties = ({ market, reportingBarShowing }) => {
  const [showExtraDetails, setShowExtraDetails] = useState(false);

  return (
    <div className={Styles.CoreProperties}>
      <div>
        <div>
          <PropertyLabel
            label="Total Volume"
            value={
              (market.volumeFormatted
                ? market.volumeFormatted.formatted
                : formatDai(0).formatted) + ' DAI'
            }
          />
          <PropertyLabel
            label="Open Interest"
            value={
              (market.openInterestFormatted
                ? market.openInterestFormatted.formatted
                : formatDai(0).formatted) + ' DAI'
            }
          />
          <PropertyLabel
            label="24hr Volume"
            value={
              (market.volumeFormatted
                ? market.volumeFormatted.formatted
                : formatDai(0).formatted) + ' DAI'
            }
          />
          <PropertyLabel
            label="Estimated Fee"
            value={
              market.settlementFeePercent
                ? market.settlementFeePercent.full
                : formatPercent(market.settlementFee).full
            }
            hint={
              <>
                <h4>Trading Settlement Fee</h4>
                <p>
                  The trading settlement fee is a combination of the Market
                  Creator Fee (
                  <b>{getValue(market, 'marketCreatorFeeRatePercent.full')}</b>)
                  and the Reporting Fee (
                  <b>{getValue(market, 'reportingFeeRatePercent.full')}</b>)
                </p>
              </>
            }
          />
        </div>
        {!reportingBarShowing && (
          <div className={Styles.TimeSection}>
            <TimeLabel
              label="Date Created"
              time={market.creationTimeFormatted}
              showLocal
            />
            <TimeLabel
              label="Reporting Starts"
              time={market.endTimeFormatted}
            />
          </div>
        )}
        {reportingBarShowing && (
          <button onClick={() => setShowExtraDetails(() => !showExtraDetails)}>
            <ChevronFlip
              pointDown={showExtraDetails}
              stroke="#fff"
              filledInIcon
              quick
            />
          </button>
        )}
      </div>

      {market.marketType === SCALAR && (
        <div className={Styles.ScalarBox}>
          <MarketScalarOutcomeDisplay
            outcomes={market.outcomes}
            scalarDenomination={market.scalarDenomination}
            min={market.minPriceBigNumber}
            max={market.maxPriceBigNumber}
          />
        </div>
      )}
    </div>
  );
};

// ((reportingBarShowing && showExtraProperties) ||
// !reportingBarShowing) && (

CoreProperties.propTypes = {
  market: PropTypes.object.isRequired,
  reportingBarShowing: PropTypes.bool,
};

export default CoreProperties;
