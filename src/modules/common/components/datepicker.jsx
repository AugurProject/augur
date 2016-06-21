import React, { PropTypes } from 'react';
import { Calendar, DateField } from 'react-date-picker';

// endDate isn't required but should be passed to props
const DatePicker = (p) => {
	return (
		<DateField
			forceValidDate
			showClock
			expanded={true}
			minDate={new Date()}
			dateFormat="YYYY/MM/DD hh:mm:ss a"
			date={p.endDate}
			footer={false}
			clearButton={false}
			highlightWeekends={false}
			onChange={(dateText, dateMoment) => {
				console.log(dateMoment);
				p.onValuesUpdated({ endDate: new Date(dateText) }); }}
			updateOnDateClick
		>
			<Calendar
				weekNumbers={false}
				highlightWeekends={false}
				onTimeChange={() => { console.log('onTimeChange 2'); }}
				onClockInputFocus={() => { console.log('onClockInputFocus 2'); }}
			/>
		</DateField>
	);
}

DatePicker.propTypes = {
	onValuesUpdated: PropTypes.func
};

export default DatePicker;
