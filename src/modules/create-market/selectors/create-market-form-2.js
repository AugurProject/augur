import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';
import { DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH, CATEGORICAL_OUTCOMES_MIN_NUM, CATEGORICAL_OUTCOMES_MAX_NUM, CATEGORICAL_OUTCOME_MAX_LENGTH } from '../../create-market/constants/market-values-constraints';
import { FAILED } from '../../transactions/constants/statuses';

import store from '../../../store';

export default function() {
	var { createMarketInProgress } = store.getState();
	switch (createMarketInProgress.type) {
		case BINARY:
			return selectBinary(createMarketInProgress);
		case CATEGORICAL:
			return selectCategorical(createMarketInProgress);
		case SCALAR:
			return selectScalar(createMarketInProgress);
		case COMBINATORIAL:
			return selectCombinatorial(createMarketInProgress);
	}
}

export const selectBinary = function(formState) {
	return {
		descriptionPlaceholder: 'Will "Batman v Superman: Dawn of Justice" take more than $150 million box in office receipts opening weekend?',
		descriptionMinLength: DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
		errors: selectStep2ErrorMessages(formState)
	};
};

export const selectCategorical = function(formState) {
	return {
		descriptionPlaceholder: 'Who will win the Four Nations Rugby Championship in 2016?',
		descriptionMinLength: DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
		categoricalOutcomesMinNum: CATEGORICAL_OUTCOMES_MIN_NUM,
		categoricalOutcomesMaxNum: CATEGORICAL_OUTCOMES_MAX_NUM,
		categoricalOutcomeMaxLength: CATEGORICAL_OUTCOME_MAX_LENGTH,
		errors: selectStep2ErrorMessages(formState)
	};
};

export const selectScalar = function(formState) {
	return {
		descriptionPlaceholder: 'What will the temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?',
		descriptionMinLength: DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
		scalarSmallNum: formState.scalarSmallNum,
		scalarBigNum: formState.scalarBigNum,
		errors: selectStep2ErrorMessages(formState)
	};
};

export const selectCombinatorial = function(formState) {
	return {
		descriptionPlaceholder: 'Combinatorial',
		descriptionMinLength: DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
		errors: selectStep2ErrorMessages(formState)
	};
};

export const isValidStep2 = function(formState) {
	if (validateDescription(formState.description)) {
		return false;
	}

	if (validateEndDate(formState.endDate)) {
		return false;
	}

	switch (formState.type) {
		case CATEGORICAL:
			if (validateCategoricalOutcomes(formState.categoricalOutcomes).some(error => !!error)) {
				return false;
			}
			break;
		case SCALAR:
			if (validateScalarSmallNum(formState.scalarSmallNum, formState.scalarBigNum)) {
				return false;
			}
			if (validateScalarBigNum(formState.scalarSmallNum, formState.scalarBigNum)) {
				return false;
			}
			break;
		case COMBINATORIAL:
			break;
	}

	return true;
};

export const selectStep2ErrorMessages = function(formState) {
	var errors = {};

	if (formState.description !== undefined) {
		errors.description = validateDescription(formState.description);
	}

	if (formState.endDate !== undefined) {
		errors.endDate = validateEndDate(formState.endDate);
	}

	switch (formState.type) {
		case CATEGORICAL:
			if (formState.categoricalOutcomes && formState.categoricalOutcomes.some(val => !!val)) {
				errors.categoricalOutcomes = validateCategoricalOutcomes(formState.categoricalOutcomes);
			}
			break;
		case SCALAR:
			if (formState.scalarSmallNum !== undefined) {
				errors.scalarSmallNum = validateScalarSmallNum(formState.scalarSmallNum, formState.scalarBigNum);
			}
			if (formState.scalarBigNum !== undefined) {
				errors.scalarBigNum = validateScalarBigNum(formState.scalarSmallNum, formState.scalarBigNum);
			}
			break;
		case COMBINATORIAL:
			break;
	}

	return errors;
};

export const validateDescription = function(description) {
	if (!description || !description.length) {
		return 'Please enter your question';
	}

	if (description.length < DESCRIPTION_MIN_LENGTH) {
		return 'Text must be a minimum length of ' + DESCRIPTION_MIN_LENGTH;
	}

	if (description.length > DESCRIPTION_MAX_LENGTH) {
		return 'Text exceeds the maximum length of ' + DESCRIPTION_MAX_LENGTH;
	}
};

export const validateEndDate = function(endDate) {
	if (!endDate) {
		return 'Please choose an end date';
	}
};

export const validateScalarSmallNum = function(scalarSmallNum, scalarBigNum) {
	var parsedSmall = parseFloat(scalarSmallNum);
	if (!scalarSmallNum) {
		return 'Please provide a minimum value';
	}
	if (parsedSmall != scalarSmallNum) {
		return 'Minimum value must be a number';
	}
	if (parseFloat(scalarBigNum) == scalarBigNum && parsedSmall >= parseFloat(scalarBigNum)) {
		return 'Minimum must be less than maximum';
	}
};

export const validateScalarBigNum = function(scalarSmallNum, scalarBigNum) {
	var parsedBig = parseFloat(scalarBigNum);
	if (!scalarBigNum) {
		return 'Please provide a maximum value';
	}
	if (parsedBig != scalarBigNum) {
		return 'Maximum value must be a number';
	}
	if (parseFloat(scalarSmallNum) == scalarSmallNum && parsedBig <= parseFloat(scalarSmallNum)) {
		return 'Maximum must be greater than minimum';
	}
};

export const validateCategoricalOutcomes = function(categoricalOutcomes) {
	var errors;

	if (!categoricalOutcomes || !categoricalOutcomes.length) {
		return [];
	}

	errors = Array(categoricalOutcomes.length);
	errors.fill('');

	categoricalOutcomes.forEach((outcome, i) => {
		if (!outcome.length ) {
			errors[i] = 'Answer cannot be blank';
		}
	});

	return errors;
};
