import React, { PropTypes } from 'react';
import classNames from 'classnames';

const ValueTimestamp = p => (
  <span className={classNames('value-timestamp', p.className)}>
    {p.full}
  </span>
);

ValueTimestamp.propTypes = {
  className: PropTypes.string,
  full: PropTypes.string
};

export default ValueTimestamp;
