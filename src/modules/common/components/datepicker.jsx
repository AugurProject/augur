import React, { PropTypes } from 'react';
import Datetime from 'react-datetime';

const DatePicker = (p) => {
	const yesterday = Datetime.moment().subtract(1, 'day');
	const valid = (current) => current.isAfter(yesterday);

	return (
		<Datetime
			isValidDate={valid}
			dateFormat="YYYY/MM/DD"
			timeFormat="hh:mm:ss a"
			onChange={(date) => p.onValuesUpdated({ endDate: new Date(date) })}
			value={p.endDate}
			defaultValue={new Date()}
			open
		/>
	);
};

DatePicker.propTypes = {
	onValuesUpdated: PropTypes.func,
	endDate: PropTypes.object
};

DatePicker.defaultProps = {
	endDate: new Date()
};

export default DatePicker;
