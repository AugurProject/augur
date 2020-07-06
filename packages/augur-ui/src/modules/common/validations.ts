import {
  OUTCOME_MAX_LENGTH,
  SATURDAY_DAY_OF_WEEK,
  SUNDAY_DAY_OF_WEEK,
} from 'modules/create-market/constants';
import isAddress from 'modules/auth/helpers/is-address';
import { createBigNumber } from 'utils/create-big-number';
import { ZERO, INVALID_OUTCOME_COMPARE } from './constants';
import { NewMarketPropertiesValidations } from 'modules/types';
import type {
  UserInputDateTime,
  TemplateInput,
} from '@augurproject/templates'
import {
  tellOnHoliday,
  TemplateInputType,
  ValidationType,
  ValidationTemplateInputType,
  isValidYearYearRangeInQuestion
} from '@augurproject/templates';
import moment from 'moment';
import { datesOnSameDay } from 'utils/format-date';

export function isFilledString(value, readable, message) {
  if (value && value.trim().length > 0 && value !== '') return '';
  return message ? message : readable + ' is required';
}

export function isMaxLength(value, maxLength) {
  return maxLength && value.length > maxLength;
}

export function isFilledNumber(value, readable, message) {
  if (value !== null && !checkValidNumber(value)) return '';
  return message ? message : readable + ' is required';
}

export function isBetween(value, readable, min, max) {
  if (!checkValidNumbers([value])) {
    return '';
  }

  if (createBigNumber(value).gt(createBigNumber(max))) {
    return readable + ' must be less than ' + max;
  } else if (createBigNumber(value).lt(createBigNumber(min))) {
    return readable + ' must be more than ' + min;
  }
  return '';
}

export function isLessThan(value, readable, target, message) {
  if (!checkValidNumbers([value, target])) {
    return '';
  }

  if (target !== null && createBigNumber(value).gte(createBigNumber(target))) {
    return message ? message : 'Must be less than ' + target;
  }
  return '';
}

export function isValidFee(value, readable, fee) {
  if (!checkValidNumbers([value, fee])) {
    return '';
  }

  if (createBigNumber(value).eq(ZERO) && createBigNumber(fee).gt(ZERO)) {
    return 'Market creator fee must be greater than 0% when affiliate fee is greater than 0%';
  }
  return '';
}

export function dividedBy(value, readable, min, max) {
  if (!checkValidNumbers([value, min, max])) {
    return '';
  }

  const range = createBigNumber(max).minus(createBigNumber(min));
  if (range.mod(value).eq(ZERO)) {
    return '';
  }
  return `Price range needs to be divisible by ${readable.toLowerCase()}`;
}

export function isMoreThan(value, readable, target) {
  if (!checkValidNumbers([value, target])) {
    return '';
  }

  if (target !== null && createBigNumber(value).lte(createBigNumber(target))) {
    return 'Max can\'t be lower than min';
  }
  return '';
}

export function dateGreater(value, target, message) {
  if (!checkValidNumbers([value, target])) {
    return '';
  }

  if (value !== null && createBigNumber(value).lt(createBigNumber(target))) {
    return message;
  }
  return '';
}

export function checkCategoriesArray(value) {
  let errors = ['', '', ''];
  if (value[0] === '') {
    errors[0] = 'Enter a category';
  }
  if (value[1] === '') {
    errors[1] = 'Enter a sub-category';
  }

  if (errors[0] !== '' || errors[1] !== '') {
    return errors;
  } else {
    return '';
  }
}

export function moreThanDecimals(value, decimals) {
  if (Math.floor(value) === value) return '';
  const splitValue = String(value).split('.');
  const decimalsValue = splitValue.length > 1 ? splitValue[1].length : 0;
  if (decimalsValue > decimals)
    return "Can't enter more than " + decimals + ' decimal points';
  return '';
}

export function checkAddress(value) {
  if (!isAddress(value)) return 'Enter a valid address';
  return '';
}

export function isCheckWholeNumber(value) {
  let message = ''
  if (moreThanDecimals(value, 0)) {
    message = 'Value must be a whole number';
  }
  return message;
}

export function checkOutcomesArray(value) {
  const validOutcomes = value.filter(
    outcome => outcome && outcome.trim() !== ''
  );
  if (validOutcomes.length < 2) {
    if (!validOutcomes.length) {
      return ['Enter an outcome', 'Enter an outcome'];
    } else if (validOutcomes.length === 1 && (!value[0] || value[0] === '')) {
      return ['Enter an outcome'];
    } else {
      return ['', 'Enter an outcome'];
    }
  } else {
    const errors = Array(value.length).fill('');
    const invalid = value.findIndex(
      outcome =>
        outcome &&
        outcome.trim().toLowerCase() === INVALID_OUTCOME_COMPARE.toLowerCase()
    );
    if (invalid !== -1)
      errors[invalid] = ['Can\'t enter "Market is Invalid" as an outcome'];

    let dupes = {};
    value.forEach((outcome, index) => {
      dupes[outcome.trim().toLowerCase()] =
        dupes[outcome.trim().toLowerCase()] || [];
      dupes[outcome.trim().toLowerCase()].push(index);
    });
    Object.keys(dupes).map(key => {
      if (dupes[key].length > 1) {
        errors[dupes[key][dupes[key].length - 1]] =
          "Can't enter a duplicate outcome";
      }
    });
    value.forEach((v, i) => {
      if (v.length > OUTCOME_MAX_LENGTH && !errors[i]) {
        errors[i] = ['Outcome can not be more than 32 characters'];
      }
    });
    if (errors.filter(error => error !== '').length > 0) return errors;
    return '';
  }
}

export function isPositive(value) {
  if (value && value < 0) return "Can't enter negative number";
  return '';
}

export function checkValidNumber(value) {
  return isNaN(value) || value === '' || value === '-';
}

function checkValidNumbers(values) {
  let valid = true;
  values.map(value => {
    if (checkValidNumber(value)) valid = false;
  });
  return valid;
}

export function checkForUserInputFilled(
  inputs: TemplateInput[],
  endTimeFormatted,
  currentTimestamp: number,
) {
  const errors = inputs.map(input => {
    if (
      (input.validationType === ValidationType.WHOLE_NUMBER &&
        moreThanDecimals(input.userInput, 0)) ||
      isPositive(input.userInput)
    ) {
      return 'Must be a whole positive number';
    } else if (
      (input.validationType === ValidationType.NUMBER || input.validationType === ValidationType.NUMBER_ONE_DECIMAL) && input.numberRange &&
      (checkValidNumber(input.userInput) || Number(input.userInput) < input.numberRange[0] || Number(input.userInput) > input.numberRange[1])
    ) {
      return `value range is ${input.numberRange[0]} to ${input.numberRange[1]}`;
    } else if (
      (input.validationType === ValidationType.NUMBER || input.validationType === ValidationType.NUMBER_ONE_DECIMAL) &&
      checkValidNumber(input.userInput)
    ) {
      return 'Must enter a valid number';
    } else if (
      input.validationType === ValidationType.NUMBER_ONE_DECIMAL &&
      moreThanDecimals(input.userInput, 1)
    ) {
      return 'Must have only one or fewer digits after the decimal';
    }else if (input.type === TemplateInputType.DATEYEAR) {
      if (!input.userInput) return 'Input is required';
      if (input.dateAfterId) {
        const source = inputs.find(i => i.id === input.dateAfterId);
        if (source && input.setEndTime <= source.setEndTime) {
          return 'Date has to be after open date';
        }
      }
      // day can not be a weekend
      if (input.validationType === ValidationType.NOWEEKEND_HOLIDAYS) {
        let holidayPresent = '';
        if (input.setEndTime) {
          const dayOfWeek = moment.unix(input.setEndTime).weekday();
          if (
            dayOfWeek === SATURDAY_DAY_OF_WEEK ||
            dayOfWeek === SUNDAY_DAY_OF_WEEK
          ) {
            return 'Weekday is required';
          }

          // check if on holiday
          const closing = inputs.find(
            i => i.type === TemplateInputType.DATEYEAR_CLOSING
          );
          if (closing) {
            const extraInfoInputs = inputs.map(i => ({id: i.id, value: i.userInput, type: i.type}));
            const extraInput = ({id: input.id, timestamp: String(input.setEndTime), type: input.type, value: input.userInput});
            const dateDep = ({ inputDateYearId: closing.inputDateYearId, inputSourceId: closing.inputSourceId, holidayClosures: closing.holidayClosures, inputTimeOffset: closing.inputTimeOffset})
            const holiday = tellOnHoliday(extraInfoInputs, extraInput, dateDep);
            if (holiday) {
              return `Holiday ${holiday.holiday} not allowed`;
            }
          }
        }
        if (
          endTimeFormatted &&
          endTimeFormatted.timestamp &&
          input.setEndTime &&
          input.setEndTime >= endTimeFormatted.timestamp
        ) {
          return 'Date must be before event expiration time';
        }
        return '';
      }
    } else if (
      (input.type === TemplateInputType.TEXT ||
        input.type === TemplateInputType.USER_DESCRIPTION_OUTCOME ||
        input.type === TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME ||
        input.type === TemplateInputType.DATEYEAR ||
        input.type === TemplateInputType.DROPDOWN ||
        input.type === TemplateInputType.DROPDOWN_QUESTION_DEP ||
        input.type === TemplateInputType.DENOMINATION_DROPDOWN) &&
      (!input.userInput || input.userInput === '')
    ) {
      return 'Input is required';
    } else if (
      input.type === TemplateInputType.TEXT ||
      input.type === TemplateInputType.DROPDOWN
    ) {
      const possibleDupes = inputs.filter(
        possibleDupeInput =>
          (possibleDupeInput.type === TemplateInputType.TEXT ||
            input.type === TemplateInputType.DROPDOWN) &&
          (possibleDupeInput.userInput &&
            input.userInput &&
            possibleDupeInput.userInput.toUpperCase() ===
              input.userInput.toUpperCase()) &&
          input.id !== possibleDupeInput.id
      );
      let validText = true;
      const regexRule = input.validationType && ValidationTemplateInputType[input.validationType];
      if (regexRule) {
        validText = !!input.userInput.match(`^${regexRule}$`);
      }
      if (possibleDupes.length > 0) {
        return 'No repeats allowed';
      } else if (!validText) {
        return 'Input is not valid format';
      }
      const hasYearValidations = input.validationType && input.validationType === ValidationType.YEAR_YEAR_RANGE;
      if (hasYearValidations && endTimeFormatted?.timestamp) {
        return isValidYearYearRangeInQuestion(
          [{ id: input.id, value: input.userInput }],
          [input.id],
          endTimeFormatted.timestamp,
          moment().utc().unix(),
        )
          ? ''
          : 'Year(s) is outside of market timeframe';
      }
      return '';
    } else if (input.type === TemplateInputType.DATEYEAR) {
      if (input.setEndTime === null) {
        return 'Choose a date';
      } else if (
        endTimeFormatted &&
        endTimeFormatted.timestamp &&
        input.setEndTime &&
        input.setEndTime >= endTimeFormatted.timestamp ||
        datesOnSameDay(input.setEndTime, endTimeFormatted.timestamp)
      ) {
        return 'Date must be before event expiration and not same day';
      }
      return '';
    } else if (
      input.type === TemplateInputType.DATETIME ||
      input.type === TemplateInputType.ESTDATETIME
    ) {
      if (input.userInputObject) {
        let validations: NewMarketPropertiesValidations = {};
        const dateTimeInput = input.userInputObject as UserInputDateTime;
        if (dateTimeInput.hour === null) {
          validations.hour = 'Choose a time';
        }

        if (dateTimeInput.endTime === null) {
          validations.setEndTime = 'Choose a date';
        } else if (
          endTimeFormatted &&
          endTimeFormatted.timestamp &&
          dateTimeInput.endTimeFormatted &&
          dateTimeInput.endTimeFormatted.timestamp >= endTimeFormatted.timestamp
        ) {
          validations.setEndTime = 'Date must be before event expiration time';
        } else if (
          endTimeFormatted &&
          endTimeFormatted.timestamp &&
          dateTimeInput.endTimeFormatted &&
          dateTimeInput.endTimeFormatted.timestamp <= currentTimestamp
        ) {
          validations.setEndTime = 'Date and time must be in the future';
        }

        return validations;
      } else {
        return '';
      }
    }
    return '';
  });

  return errors;
}
