import React, { PropTypes } from 'react';
import classnames from 'classnames';

const ValueTimestamp = (p) => (
	<span className={classnames('value-timestamp', p.className)}>
		{p.full}
	</span>
);

ValueTimestamp.propTypes = {
	className: PropTypes.string,
	full: PropTypes.string
};

export default ValueTimestamp;
