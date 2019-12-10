import React, { useState } from 'react';
import { EVENT_EXPIRATION_TOOLTIP, SCALAR } from 'modules/common/constants';
import Styles from 'modules/market/components/core-properties/core-properties.styles.less';
import getValue from 'utils/get-value';
import { PropertyLabel, TimeLabel } from 'modules/common/labels';
import {
  formatPercent,
  formatDai,
  formatNone,
  formatNumber,
  formatRep,
  formatAttoRep,
} from 'utils/format-number';
import MarketScalarOutcomeDisplay from '../market-scalar-outcome-display/market-scalar-outcome-display';
import ChevronFlip from 'modules/common/chevron-flip';
import classNames from 'classnames';
import { MarketData } from 'modules/types';

interface CorePropertiesProps {
  market: MarketData;
  reportingBarShowing?: boolean;
}

// TODO: Get market 24 hour volume, currently just using volume
const CoreProperties: React.FC<CorePropertiesProps> = ({ market, reportingBarShowing }) => {
  const [showExtraDetails, setShowExtraDetails] = useState(false);

  return (
    <div
      className={classNames(Styles.CoreProperties, {
        [Styles.ReportingBarShowing]: reportingBarShowing,
      })}
    >
      <div>
        <div>
          <PropertyLabel
            label="Total Volume"
            value={
              (market.volumeFormatted
                ? market.volumeFormatted.full
                : formatDai(0).full)
            }
          />
          {reportingBarShowing && (
            <TimeLabel
              label="Event Expiration"
              time={market.endTimeFormatted}
              showLocal
              hint={
                <>
                  <h4>{EVENT_EXPIRATION_TOOLTIP.header}</h4>
                  <p>{EVENT_EXPIRATION_TOOLTIP.content}</p>
                </>
              }
            />
          )}
          {reportingBarShowing && showExtraDetails && (
            <>
              <PropertyLabel
                label="Total Dispute Stake"
                value={
                  (market.disputeInfo
                    ? formatAttoRep(market.disputeInfo.stakeCompletedTotal).full
                    : formatRep(0).full)
                }
              />
              <TimeLabel
                label="Date Created"
                time={market.creationTimeFormatted}
              />
            </>
          )}
          {(!reportingBarShowing || showExtraDetails) && (
            <>
              <PropertyLabel
                label="Open Interest"
                value={
                  (market.openInterestFormatted
                    ? market.openInterestFormatted.full
                    : formatDai(0).full)
                }
              />
              <PropertyLabel
                label="24hr Volume"
                value={
                  (market.volumeFormatted
                    ? market.volumeFormatted.full
                    : formatDai(0).full)
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
                      <b>
                        {formatPercent(Number(market.marketCreatorFeeRate) * 100).full}
                      </b>
                      ) and the Reporting Fee (
                      <b>{formatPercent(Number(market.reportingFeeRate) * 100).full}</b>)
                    </p>
                  </>
                }
              />
            </>
          )}
        </div>
        {!reportingBarShowing && (
          <div className={Styles.TimeSection}>
            <TimeLabel
              label="Date Created"
              time={market.creationTimeFormatted}
            />
            <TimeLabel
              label="Event Expiration"
              time={market.endTimeFormatted}
              showLocal
              hint={
                <>
                  <h4>{EVENT_EXPIRATION_TOOLTIP.header}</h4>
                  <p>{EVENT_EXPIRATION_TOOLTIP.content}</p>
                </>
              }
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

      {market.marketType === SCALAR &&
        (!reportingBarShowing || showExtraDetails) && (
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

export default CoreProperties;
