import React, { PropTypes } from 'react';
import classnames from 'classnames';

const ValueDate = p => (
	<span className={classnames('value-date', p.className)}>
		{p.formatted}
	</span>
);

ValueDate.propTypes = {
	className: PropTypes.string,
	value: PropTypes.object,
	formatted: PropTypes.string
};

export default ValueDate;
