import React from "react";
import PropTypes from "prop-types";

import Styles from "modules/common/components/value-denomination/value-denomination.styles";

const ValueDenomination = ({
  className,
  prefix,
  hidePrefix,
  formatted,
  fullPrecision,
  valueClassname,
  denomination,
  hideDenomination,
  postfix,
  hidePostfix,
  value
}) => (
  <span className={Styles[className]}>
    {prefix &&
      !hidePrefix && (
        <span className={Styles.ValueDenomination__prefix}>{prefix}</span>
      )}
    {formatted &&
      fullPrecision && (
        <span
          data-tip={fullPrecision}
          data-event="click focus"
          className={`value_${valueClassname}`}
        >
          {formatted}
        </span>
      )}
    {formatted &&
      !fullPrecision && (
        <span className={`value_${valueClassname}`}>{formatted}</span>
      )}
    {denomination &&
      !hideDenomination && (
        <span className={Styles.ValueDenomination__denomination}>
          {denomination}
        </span>
      )}
    {postfix &&
      !hidePostfix && (
        <span className={Styles.ValueDenomimntion__postfix}>{postfix}</span>
      )}
    {!value &&
      value !== 0 &&
      !formatted &&
      formatted !== "0" && <span>&mdash;</span> // null/undefined state handler
    }
  </span>
);

ValueDenomination.propTypes = {
  valueClassname: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.number,
  formatted: PropTypes.string,
  fullPrecision: PropTypes.string,
  denomination: PropTypes.string,
  hidePrefix: PropTypes.bool,
  hidePostfix: PropTypes.bool,
  prefix: PropTypes.string,
  postfix: PropTypes.string,
  hideDenomination: PropTypes.bool
};

ValueDenomination.defaultProps = {
  className: null,
  valueClassname: null,
  prefix: null,
  postfix: null,
  value: null,
  formatted: null,
  fullPrecision: null,
  denomination: null,
  hidePrefix: false,
  hidePostfix: false,
  hideDenomination: false
};

export default ValueDenomination;
