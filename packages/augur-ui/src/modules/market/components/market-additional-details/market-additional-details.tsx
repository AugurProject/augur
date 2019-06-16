import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "utils/custom-prop-types";
import Styles from "modules/market/components/market-additional-details/market-additional-details.style";
import { SCALAR } from "modules/common/constants";
import MarkdownRenderer from "modules/common/markdown-renderer";

const MarketAdditonalDetails = ({
  details,
  resolutionSource = "General knowledge",
  marketType,
  minPrice,
  maxPrice,
  scalarDenomination
}) => {
  const denomination = scalarDenomination ? ` ${scalarDenomination}` : "";
  return (
    <div className={Styles.AdditionalDetails}>
      <h4>Resolution Source:</h4>
      <span>{resolutionSource}</span>
      {details && (
        <MarkdownRenderer
          text={details}
          className={Styles.Text}
        />
      )}
      {marketType === SCALAR && (
        <p>
          If the real-world outcome for this market is above this
          market&#39;s maximum value, the maximum value (
          {maxPrice.toNumber()}
          {denomination}) should be reported. If the real-world outcome for
          this market is below this market&#39;s minimum value, the minimum
          value ({minPrice.toNumber()}
          {denomination}) should be reported.
        </p>
      )}
    </div>
  );
};

MarketAdditonalDetails.propTypes = {
  details: PropTypes.string,
  resolutionSource: PropTypes.string,
  scalarDenomination: PropTypes.string,
  marketType: PropTypes.string.isRequired,
  minPrice: CustomPropTypes.bigNumber.isRequired,
  maxPrice: CustomPropTypes.bigNumber.isRequired
};

MarketAdditonalDetails.defaultProps = {
  resolutionSource: "General knowledge",
  details: null,
  scalarDenomination: null
};

export default MarketAdditonalDetails;
