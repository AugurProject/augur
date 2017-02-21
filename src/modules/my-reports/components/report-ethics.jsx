import React from 'react';

const ReportEthics = p => (
  <span>
    {!!p.isUnethical &&
      <i
        className="fa fa-thumbs-down report-unethical"
        data-tip="You reported that this market is unethical"
      />
    }
  </span>
);

ReportEthics.propTypes = {
  isUnethical: React.PropTypes.bool
};

export default ReportEthics;
