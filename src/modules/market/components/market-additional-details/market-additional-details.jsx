import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "utils/custom-prop-types";
import Styles from "modules/market/components/market-additional-details/market-additional-details.style";
import { SCALAR } from "modules/markets/constants/market-types";

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
    <article>
      <div className={Styles[`MarketAdditionalDetails__details-wrapper`]}>
        <div className={Styles[`MarketAdditionalDetails__details-container`]}>
          <h4>Resolution Source:</h4>
          <span>{resolutionSource}</span>
          {details && (
            <label
              className={
                Styles[`MarketAdditionalDetails__details-details-text`]
              }
            >
              {details}
            </label>
          )}
          {marketType === SCALAR && (
            <p
              className={Styles[`MarketAdditionalDetails__details-helper-text`]}
            >
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
      </div>
    </article>
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
