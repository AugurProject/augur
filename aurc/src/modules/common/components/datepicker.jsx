import React from 'react';
import Datetime from 'react-datetime';

const DatePicker = (p) => {
	const yesterday = Datetime.moment().subtract(1, 'day');
	const valid = current => current.isAfter(yesterday);
	const defaultValue = p.endDate ? p.endDate : null;

	return (
		<Datetime
			isValidDate={valid}
			dateFormat="YYYY/MM/DD"
			timeFormat="hh:mm:ss a"
			defaultValue={defaultValue}
			onChange={date => p.onValuesUpdated({ endDate: new Date(date) })}
			open
			inputProps={{ placeholder: 'YYYY/MM/DD hh:mm:ss a' }}
		/>
	);
};

// TODO -- Prop Validations
// DatePicker.propTypes = {
// 	onValuesUpdated: PropTypes.func,
// 	endDate: PropTypes.object
// };

export default DatePicker;
