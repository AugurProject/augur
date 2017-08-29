import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';

import EmDash from 'modules/common/components/em-dash';

import Styles from 'modules/common/components/value-denomination/value-denomination.styles';

const ValueDenomination = p => (
  <span
    className={Styles[p.className]}
  >
    {p.prefix && !p.hidePrefix &&
      <span className={Styles.ValueDenomination__prefix}>{p.prefix}</span>
    }
    {p.formatted && p.fullPrecision &&
      <span
        data-tip={p.fullPrecision}
        data-event="click focus"
      >
        {p.formatted}
      </span>
    }
    {p.formatted && !p.fullPrecision &&
      <span>{p.formatted}</span>
    }
    {p.denomination && !p.hideDenomination &&
      <span className={Styles.ValueDenomination__denomination}>{p.denomination}</span>
    }
    {p.postfix && !p.hidePostfix &&
      <span className={Styles.ValueDenomimntion__postfix}>{p.postfix}</span>
    }
    {!p.value && p.value !== 0 && !p.formatted && p.formatted !== '0' && // null/undefined state handler
      <span><EmDash /></span>
    }
    <ReactTooltip type="light" effect="solid" place="top" />
  </span>
);

ValueDenomination.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number,
  formattedValue: PropTypes.number,
  formatted: PropTypes.string,
  fullPrecision: PropTypes.string,
  denomination: PropTypes.string,
  hidePrefix: PropTypes.bool,
  hidePostfix: PropTypes.bool,
  prefix: PropTypes.string,
  postfix: PropTypes.string,
  hideDenomination: PropTypes.bool
};

export default ValueDenomination;
