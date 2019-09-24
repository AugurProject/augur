import React from "react";
import { SCALAR } from "modules/common/constants";
import Styles from "modules/market/components/core-properties/core-properties.styles.less";
import getValue from "utils/get-value";
import { PropertyLabel } from "modules/common/labels";
import { formatPercent, formatDai, formatNone, formatNumber } from "utils/format-number";

interface CorePropertiesProps {
  market: Object;
}

// TODO: Get market 24 hour volume, currently just using volume
const CoreProperties = ({ market }: CorePropertiesProps) => (
  <div className={Styles.CoreProperties}>
    <PropertyLabel
      label="Total Volume"
      value={(market.volumeFormatted ? market.volumeFormatted.formatted : formatDai(0).formatted) + ' DAI'}
    />
    <PropertyLabel
      label="Open Interest"
      value={(market.openInterestFormatted ? market.openInterestFormatted.formatted : formatDai(0).formatted) + ' DAI'}
    />
    <PropertyLabel
      label="24hr Volume"
      value={(market.volumeFormatted ? market.volumeFormatted.formatted : formatDai(0).formatted) + ' DAI'}
    />
    <PropertyLabel
      label="Estimated Fee"
      value={market.settlementFeePercent ? market.settlementFeePercent.full : formatPercent(market.settlementFee).full}
      hint={
        <>
          <h4>Trading Settlement Fee</h4>
          <p>
            The trading settlement fee is a combination of the Market Creator
            Fee (<b>{getValue(market, "marketCreatorFeeRatePercent.full")}</b>)
            and the Reporting Fee (
            <b>{getValue(market, "reportingFeeRatePercent.full")}</b>)
          </p>
        </>
      }
    />
    {getValue(market, "marketType") === SCALAR && (
      <PropertyLabel
        label="Denominated In"
        value={`${market.scalarDenomination || "N/A"}`}
      />
    )}
    {getValue(market, "marketType") === SCALAR && (
      <PropertyLabel
        label="Numeric Range"
        value={`${market.minPrice} to ${market.maxPrice}`}
      />
    )}
  </div>
);

export default CoreProperties;
