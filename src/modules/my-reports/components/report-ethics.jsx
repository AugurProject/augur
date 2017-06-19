import React from 'react';
import PropTypes from 'prop-types';

const ReportEthics = p => (
  <span>
    {!!p.isUnethical &&
      <i
        className="fa fa-thumbs-down report-unethical"
        data-tip="Unethical"
      />
    }
  </span>
);

ReportEthics.propTypes = {
  isUnethical: PropTypes.bool
};

export default ReportEthics;
