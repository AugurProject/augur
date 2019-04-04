import React from "react";
import PropTypes from "prop-types";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import InputDropdown from "modules/common/components/input-dropdown/input-dropdown";
import { SingleDatePicker } from "react-dates";
import {
  ChevronLeft,
  ChevronRight,
  ExclamationCircle as InputErrorIcon
} from "modules/common/components/icons";
import Styles from "modules/create-market/components/create-market-form-define/create-market-form-define.styles";
import moment from "moment";
import { formatDate } from "utils/format-date";
import StylesForm from "modules/create-market/components/create-market-form/create-market-form.styles";

export const MarketCreateFormTime = ({
  validateField,
  currentTimestamp,
  newMarket,
  validateNumber,
  isMobileSmall,
  keyPressed,
  hours,
  minutes,
  ampm,
  date,
  updateState,
  focused
}) => (
  <div>
    <label htmlFor="cm__input--date">
      <span>Reporting Starts Date</span>
    </label>
    <SingleDatePicker
      id="cm__input--date"
      date={date}
      placeholder="Date"
      onDateChange={date => {
        updateState({ date });
        if (!date) return validateField("setEndTime", "");
        validateField("setEndTime", formatDate(date.toDate()));
      }}
      isOutsideRange={day =>
        day.isAfter(moment(currentTimestamp).add(6, "M")) ||
        day.isBefore(moment(currentTimestamp))
      }
      focused={focused}
      onFocusChange={({ focused }) => {
        if (date == null) {
          const date = moment(currentTimestamp);
          updateState({
            date
          });
          validateField("setEndTime", formatDate(date.toDate()));
        }
        updateState({ focused });
      }}
      displayFormat="MMM D, YYYY"
      numberOfMonths={1}
      navPrev={ChevronLeft}
      navNext={ChevronRight}
    />
    <label htmlFor="cm__input--time">
      <span>Reporting Starts Time (UTC -0)</span>
      {newMarket.validations[newMarket.currentStep].hour && (
        <span className={StylesForm.CreateMarketForm__error}>
          {InputErrorIcon}
          {newMarket.validations[newMarket.currentStep].hour}
        </span>
      )}
      {newMarket.validations[newMarket.currentStep].minute && (
        <span className={StylesForm.CreateMarketForm__error}>
          {InputErrorIcon}
          {newMarket.validations[newMarket.currentStep].minute}
        </span>
      )}
    </label>
    <div id="cm__input--time" className={Styles.CreateMarketDefine__time}>
      <InputDropdown
        label="Hour"
        options={hours}
        default={newMarket.hour}
        className={Styles.CreateMarketDefine_delay_time_sub}
        onChange={value => validateNumber("hour", value, "hour", 1, 12, 0)}
        isMobileSmall={isMobileSmall}
        onKeyPress={e => keyPressed(e)}
      />
      <InputDropdown
        label="Minute"
        options={minutes}
        default={newMarket.minute}
        className={Styles.CreateMarketDefine_delay_time_sub}
        onChange={value => validateNumber("minute", value, "minute", 0, 59, 0)}
        isMobileSmall={isMobileSmall}
        onKeyPress={e => keyPressed(e)}
      />
      <InputDropdown
        label="AM/PM"
        default={newMarket.meridiem || ""}
        options={ampm}
        className={Styles.CreateMarketDefine_delay_time_sub}
        onChange={value => validateField("meridiem", value)}
        isMobileSmall={isMobileSmall}
        onKeyPress={e => keyPressed(e)}
      />
    </div>
    <label htmlFor="cm__input--time">
      <span>Delay Reporting by</span>
    </label>
    <div id="cm__input--time" className={Styles.CreateMarketDefine_delay_time}>
      <InputDropdown
        label="Days"
        options={Array.from(new Array(31), (val, index) => index)}
        default={newMarket.delayDays || ""}
        onChange={value =>
          validateNumber("delayDays", value, "delayDays", 0, 30, 0)
        }
        isMobileSmall={isMobileSmall}
        onKeyPress={e => keyPressed(e)}
      />
      <InputDropdown
        label="Hours"
        options={Array.from(new Array(25), (val, index) => index)}
        default={newMarket.delayHours || ""}
        onChange={value =>
          validateNumber("delayHours", value, "delayHours", 0, 24, 0)
        }
        isMobileSmall={isMobileSmall}
        onKeyPress={e => keyPressed(e)}
      />
    </div>
  </div>
);

MarketCreateFormTime.propTypes = {
  validateField: PropTypes.func.isRequired,
  newMarket: PropTypes.object.isRequired,
  keyPressed: PropTypes.func.isRequired,
  validateNumber: PropTypes.func.isRequired,
  isMobileSmall: PropTypes.bool.isRequired,
  currentTimestamp: PropTypes.number.isRequired,
  hours: PropTypes.array.isRequired,
  minutes: PropTypes.array.isRequired,
  ampm: PropTypes.array.isRequired,
  date: PropTypes.object,
  updateState: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired
};

MarketCreateFormTime.defaultProps = {
  date: null
};
