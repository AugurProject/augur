import { INVALID_OUTCOME, OUTCOME_MAX_LENGTH } from 'modules/create-market/constants';
import isAddress from 'modules/auth/helpers/is-address';
import { createBigNumber } from 'utils/create-big-number';
import { ZERO } from './constants';
import { NewMarketPropertiesValidations } from 'modules/types';
import { ValidationType, TemplateInputType } from '@augurproject/artifacts';

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

export function checkOutcomesArray(value) {
  const validOutcomes = value.filter(outcome => outcome && outcome.trim() !== '');
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
      outcome => outcome && outcome.trim().toLowerCase() === INVALID_OUTCOME.toLowerCase()
    );
    if (invalid !== -1)
      errors[invalid] = ['Can\'t enter "Market is Invalid" as an outcome'];

    let dupes = {};
    value.forEach((outcome, index) => {
      dupes[outcome.trim().toLowerCase()] = dupes[outcome.trim().toLowerCase()] || [];
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
    })
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

export function checkForUserInputFilled(inputs, endTimeFormatted) {
  const errors = inputs.map(input => {
    if (
      (input.validationType === ValidationType.WHOLE_NUMBER &&
        moreThanDecimals(input.userInput, 0)) ||
      isPositive(input.userInput)
    ) {
      return 'Must be a whole positive number';
    } else if (
      input.validationType === ValidationType.NUMBER &&
      checkValidNumber(input.userInput)
    ) {
      return 'Must enter a valid number';
    } else if (
      (input.type === TemplateInputType.TEXT ||
        input.type === TemplateInputType.USER_DESCRIPTION_OUTCOME ||
        input.type === TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME ||
        input.type === TemplateInputType.DATEYEAR ||
        input.type === TemplateInputType.DATESTART ||
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
          (
            (possibleDupeInput.type === TemplateInputType.TEXT ||
              input.type === TemplateInputType.DROPDOWN) &&
              (possibleDupeInput.userInput && input.userInput && possibleDupeInput.userInput.toUpperCase() ===
              input.userInput.toUpperCase()) && input.id !== possibleDupeInput.id
          )
      );
      if (possibleDupes.length > 0) {
        return 'No repeats allowed';
      } else {
        return '';
      }
    } else if (input.type === TemplateInputType.DATESTART) {
      if (input.setEndTime === null) {
        return 'Choose a date'
      } else if (
        endTimeFormatted && endTimeFormatted.timestamp &&
        input.setEndTime &&
        input.setEndTime >=
          endTimeFormatted.timestamp
      ) {
        return 'Date must be before event expiration time';
      }
      return '';
    } else if (
      input.type === TemplateInputType.DATETIME ||
      input.type === TemplateInputType.ESTDATETIME
    ) {
      if (input.userInputObject) {
        let validations: NewMarketPropertiesValidations = {};
        if (input.userInputObject.hour === null) {
          validations.hour = 'Choose a time';
        }

        if (input.userInputObject.endTime === null) {
          validations.setEndTime = 'Choose a date';
        } else if (
          endTimeFormatted && endTimeFormatted.timestamp &&
          input.userInputObject.endTimeFormatted &&
          input.userInputObject.endTimeFormatted.timestamp >=
            endTimeFormatted.timestamp
        ) {
          validations.setEndTime = 'Date must be before event expiration time';
        }

        return validations;
      } else {
        return '';
      }
    } else return '';
  });

  return errors;
}
