import React from 'react';

const ReportEthics = p => (
  <span className={p.className}>
    {!!p.isUnethical &&
      <i
        className="fa fa-thumbs-down report-unethical"
        data-tip="You reported that this market is unethical"
      />
    }
  </span>
);

ReportEthics.propTypes = {
  className: React.PropTypes.string,
  isUnethical: React.PropTypes.bool
};

export default ReportEthics;
