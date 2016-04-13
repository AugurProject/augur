import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../../markets/constants/market-types';
import { DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH, CATEGORICAL_OUTCOMES_MIN_NUM, CATEGORICAL_OUTCOMES_MAX_NUM, CATEGORICAL_OUTCOME_MAX_LENGTH } from '../../../create-market/constants/market-values-constraints';
import { FAILED } from '../../../transactions/constants/statuses';

import validateDescription from '../../../market/validators/validate-description';
import validateEndDate from '../../../market/validators/validate-end-date';
import validateScalarSmallNum from '../../../market/validators/validate-scalar-small-num';
import validateScalarBigNum from '../../../market/validators/validate-scalar-big-num';
import validateCategoricalOutcomes from '../../../market/validators/validate-categorical-outcomes';

export const select = function(formState) {
	switch (formState.type) {
		case BINARY:
			return selectBinary(formState);
		case CATEGORICAL:
			return selectCategorical(formState);
		case SCALAR:
			return selectScalar(formState);
		case COMBINATORIAL:
			return selectCombinatorial(formState);
	}
};

export const selectBinary = function(formState) {
	return {
		descriptionPlaceholder: 'Will "Batman v Superman: Dawn of Justice" take more than $150 million box in office receipts opening weekend?',
		descriptionMinLength: DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: DESCRIPTION_MAX_LENGTH
	};
};

export const selectCategorical = function(formState) {
	return {
		descriptionPlaceholder: 'Who will win the Four Nations Rugby Championship in 2016?',
		descriptionMinLength: DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
		categoricalOutcomesMinNum: CATEGORICAL_OUTCOMES_MIN_NUM,
		categoricalOutcomesMaxNum: CATEGORICAL_OUTCOMES_MAX_NUM,
		categoricalOutcomeMaxLength: CATEGORICAL_OUTCOME_MAX_LENGTH
	};
};

export const selectScalar = function(formState) {
	return {
		descriptionPlaceholder: 'What will the temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?',
		descriptionMinLength: DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
		scalarSmallNum: formState.scalarSmallNum,
		scalarBigNum: formState.scalarBigNum
	};
};

export const selectCombinatorial = function(formState) {
	return {
		descriptionPlaceholder: 'Combinatorial',
		descriptionMinLength: DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: DESCRIPTION_MAX_LENGTH
	};
};

export const isValid = function(formState) {
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

export const errors = function(formState) {
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
