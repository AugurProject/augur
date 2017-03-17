import React from 'react';
import Datetime from 'react-datetime';

import { formatDate } from 'utils/format-date';

const DatePicker = (p) => {
  const yesterday = Datetime.moment().subtract(1, 'day');
  const valid = current => current.isAfter(yesterday);
  const defaultValue = Object.keys(p.endDate).length ? p.endDate : '';

  return (
    <Datetime
      open
      isValidDate={valid}
      dateFormat="YYYY/MM/DD"
      timeFormat="hh:mm:ss a"
      defaultValue={defaultValue}
      inputProps={{ placeholder: 'YYYY/MM/DD hh:mm:ss a' }}
      onChange={date => p.onValuesUpdated(formatDate(new Date(date)))}
      onBlur={() => {
        console.log('blur');
      }}
      onFocus={() => {
        console.log('focus');
      }}
    />
  );
};

// TODO -- Prop Validations
// DatePicker.propTypes = {
// 	onValuesUpdated: PropTypes.func,
// 	endDate: PropTypes.object
// };

export default DatePicker;
