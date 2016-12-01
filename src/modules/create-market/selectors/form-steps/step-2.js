import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../../markets/constants/market-types';
import { DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH, CATEGORICAL_OUTCOMES_MIN_NUM, CATEGORICAL_OUTCOMES_MAX_NUM, CATEGORICAL_OUTCOME_MAX_LENGTH } from '../../../create-market/constants/market-values-constraints';
import validateDescription from '../../../create-market/validators/validate-description';
import validateEndDate from '../../../create-market/validators/validate-end-date';
import validateScalarSmallNum from '../../../create-market/validators/validate-scalar-small-num';
import validateScalarBigNum from '../../../create-market/validators/validate-scalar-big-num';
import validateCategoricalOutcomes from '../../../create-market/validators/validate-categorical-outcomes';

export const select = (formState) => {
	switch (formState.type) {
		case BINARY:
			return selectBinary(formState);
		case CATEGORICAL:
			return selectCategorical(formState);
		case SCALAR:
			return selectScalar(formState);
		case COMBINATORIAL:
			return selectCombinatorial(formState);
		default:
			break;
	}
};

export const selectBinary = (formState) => {
	const obj = {
		descriptionPlaceholder: 'Will "Batman v Superman: Dawn of Justice" take more'
		+ ' than $150 million box in office receipts opening weekend?',
		descriptionMinLength: DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: DESCRIPTION_MAX_LENGTH
	};
	return obj;
};

export const selectCategorical = (formState) => {
	const obj = {
		descriptionPlaceholder: 'Who will win the Four Nations Rugby Championship in 2016?',
		descriptionMinLength: DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
		categoricalOutcomesMinNum: CATEGORICAL_OUTCOMES_MIN_NUM,
		categoricalOutcomesMaxNum: CATEGORICAL_OUTCOMES_MAX_NUM,
		categoricalOutcomeMaxLength: CATEGORICAL_OUTCOME_MAX_LENGTH
	};
	return obj;
};

export const selectScalar = (formState) => {
	const obj = {
		descriptionPlaceholder: 'What will the temperature (in degrees Fahrenheit)'
		+ ' be in San Francisco, California, on July 1, 2016?',
		descriptionMinLength: DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
		scalarSmallNum: formState.scalarSmallNum,
		scalarBigNum: formState.scalarBigNum
	};
	return obj;
};

export const selectCombinatorial = (formState) => {
	const obj = {
		descriptionPlaceholder: 'Combinatorial',
		descriptionMinLength: DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: DESCRIPTION_MAX_LENGTH
	};
	return obj;
};

export const initialFairPrices = (formState) => {
	if (!formState.initialFairPrices || formState.type !== formState.initialFairPrices.type) {
		return {
			initialFairPrices: {
				type: formState.type,
				values: [],
				raw: []
			}
		};
	}
};

export const isValid = (formState) => {
	if (validateDescription(formState.description)) {
		return false;
	}

	if (validateEndDate(formState.endDate)) {
		return false;
	}

	switch (formState.type) {
		case CATEGORICAL:
			if (validateCategoricalOutcomes(formState.categoricalOutcomes).some(errors => !!errors)) {
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
		default:
			break;
	}

	return true;
};

export const errors = (formState) => {
	const errs = {};

	if (formState.description !== undefined) {
		errs.description = validateDescription(formState.description);
	}

	if (formState.endDate !== undefined) {
		errs.endDate = validateEndDate(formState.endDate);
	}

	switch (formState.type) {
		case CATEGORICAL:
			if (formState.hasOwnProperty('categoricalOutcomes')) {
				errs.categoricalOutcomes = validateCategoricalOutcomes(formState.categoricalOutcomes);
			}
			break;
		case SCALAR:
			if (formState.scalarSmallNum !== undefined) {
				errs.scalarSmallNum = validateScalarSmallNum(
					formState.scalarSmallNum,
					formState.scalarBigNum);
			}
			if (formState.scalarBigNum !== undefined) {
				errs.scalarBigNum = validateScalarBigNum(formState.scalarSmallNum, formState.scalarBigNum);
			}
			break;
		case COMBINATORIAL:
			break;
		default:
			break;
	}

	return errs;
};
