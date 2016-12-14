import { describe, it, before, beforeEach, after } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';
import { DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH, CATEGORICAL_OUTCOMES_MIN_NUM, CATEGORICAL_OUTCOMES_MAX_NUM, CATEGORICAL_OUTCOME_MAX_LENGTH } from 'modules/create-market/constants/market-values-constraints';
import * as selector from 'modules/create-market/selectors/form-steps/step-2';

describe(`modules/create-market/selectors/form-steps/step-2.js`, () => {
	proxyquire.noPreserveCache().noCallThru();

	let formState;
	let out;

	const validations = {
		validateDescription: () => {},
		validateEndDate: () => {},
		validateScalarSmallNum: () => {},
		validateScalarBigNum: () => {},
		validateCategoricalOutcomes: () => {}
	};

	const stubbedValidateDescription = sinon.stub(validations, 'validateDescription');
	stubbedValidateDescription.returns(false);

	const stubbedValidateEndDate = sinon.stub(validations, 'validateEndDate');
	stubbedValidateEndDate.returns(false);

	const stubbedValidateScalarSmallNum = sinon.stub(validations, 'validateScalarSmallNum');
	stubbedValidateScalarSmallNum.returns(false);

	const stubbedValidateScalarBigNum = sinon.stub(validations, 'validateScalarBigNum');
	stubbedValidateScalarBigNum.returns(false);

	const stubbedValidateCategoricalOutcomes = sinon.stub(validations, 'validateCategoricalOutcomes');
	stubbedValidateCategoricalOutcomes.returns([]);

	const validators = proxyquire('../../../../src/modules/create-market/selectors/form-steps/step-2', {
		'../../../create-market/validators/validate-description': stubbedValidateDescription,
		'../../../create-market/validators/validate-end-date': stubbedValidateEndDate,
		'../../../create-market/validators/validate-scalar-small-num': stubbedValidateScalarSmallNum,
		'../../../create-market/validators/validate-scalar-big-num': stubbedValidateScalarBigNum,
		'../../../create-market/validators/validate-categorical-outcomes': stubbedValidateCategoricalOutcomes
	});

	before(() => {
		sinon.stub(Array.prototype, 'some', () => true);
	});

	after(() => {
		Array.prototype.some.restore();
	});


	describe('returning object for market type', () => {
		beforeEach(() => {
			formState = null;
			out = null;
		});

		it('should return the correct object for a binary market', () => {
			formState = {
				type: BINARY
			};

			out = {
				descriptionPlaceholder: 'Will "Batman v Superman: Dawn of Justice" take more than $150 million box in office receipts opening weekend?',
				descriptionMinLength: DESCRIPTION_MIN_LENGTH,
				descriptionMaxLength: DESCRIPTION_MAX_LENGTH
			};

			assert.deepEqual(selector.select(formState), out, `Correct object not returned`);
		});

		it('should return the correct object for a categorical market', () => {
			formState = {
				type: CATEGORICAL
			};

			out = {
				descriptionPlaceholder: 'Who will win the Four Nations Rugby Championship in 2016?',
				descriptionMinLength: DESCRIPTION_MIN_LENGTH,
				descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
				categoricalOutcomesMinNum: CATEGORICAL_OUTCOMES_MIN_NUM,
				categoricalOutcomesMaxNum: CATEGORICAL_OUTCOMES_MAX_NUM,
				categoricalOutcomeMaxLength: CATEGORICAL_OUTCOME_MAX_LENGTH
			};

			assert.deepEqual(selector.select(formState), out, `Correct object not returned`);
		});

		it('should return the correct object for a scalar market', () => {
			formState = {
				type: SCALAR,
				scalarSmallNum: 10,
				scalarBigNum: 100
			};

			out = {
				descriptionPlaceholder: 'What will the temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?',
				descriptionMinLength: DESCRIPTION_MIN_LENGTH,
				descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
				scalarSmallNum: formState.scalarSmallNum,
				scalarBigNum: formState.scalarBigNum
			};

			assert.deepEqual(selector.select(formState), out, `Correct object not returned`);
		});
	});

	describe('returning object for initialFairPrices', () => {
		beforeEach(() => {
			formState = null;
			out = null;
		});

		it('should return correct object for a binary market', () => {
			formState = {
				type: BINARY
			};

			out = {
				initialFairPrices: {
					type: BINARY,
					values: [],
					raw: []
				}
			};

			assert.deepEqual(selector.initialFairPrices(formState), out, `Correct object not returned`);
		});

		it('should return correct object for a categorical market', () => {
			formState = {
				type: CATEGORICAL
			};

			out = {
				initialFairPrices: {
					type: CATEGORICAL,
					values: [],
					raw: []
				}
			};

			assert.deepEqual(selector.initialFairPrices(formState), out, `Correct object not returned`);
		});

		it('should return correct object for a scalar market', () => {
			formState = {
				type: SCALAR
			};

			out = {
				initialFairPrices: {
					type: SCALAR,
					values: [],
					raw: []
				}
			};

			assert.deepEqual(selector.initialFairPrices(formState), out, `Correct object not returned`);
		});
	});

	describe('validation handling', () => {
		beforeEach(() => {
			formState = null;
			out = null;

			stubbedValidateDescription.reset();
			stubbedValidateEndDate.reset();
		});

		after(() => {
			stubbedValidateDescription.reset();
			stubbedValidateEndDate.reset();
			stubbedValidateCategoricalOutcomes.reset();
			stubbedValidateScalarSmallNum.reset();
			stubbedValidateScalarBigNum.reset();
		});

		it('should handle binary validations', () => {
			formState = {
				type: BINARY
			};

			validators.isValid(formState);

			assert(stubbedValidateDescription.calledOnce, 'validateDescription was not called once');
			assert(stubbedValidateEndDate.calledOnce, 'validateEndDate was not called once');
		});

		it('should handle categorical validations', () => {
			formState = {
				type: CATEGORICAL
			};

			validators.isValid(formState);

			assert(stubbedValidateDescription.calledOnce, 'validateDescription was not called once');
			assert(stubbedValidateEndDate.calledOnce, 'validateEndDate was not called once');
			assert(stubbedValidateCategoricalOutcomes.calledOnce, 'validateCategoricalOutcomes was not called once');
		});

		it('should handle scalar validations', () => {
			formState = {
				type: SCALAR
			};

			validators.isValid(formState);

			assert(stubbedValidateDescription.calledOnce, 'validateDescription was not called once');
			assert(stubbedValidateEndDate.calledOnce, 'validateEndDate was not called once');
			assert(stubbedValidateScalarSmallNum.calledOnce, 'validateScalarSmallNum was not called once');
			assert(stubbedValidateScalarBigNum.calledOnce, 'validateScalarBigNum was not called once');
		});
	});

	describe('error handling', () => {
		beforeEach(() => {
			formState = null;
			out = null;

			stubbedValidateDescription.reset();
			stubbedValidateEndDate.reset();
		});

		it('should handle errors for binary markets', () => {
			formState = {
				type: BINARY,
				description: 'test',
				endDate: new Date()
			};

			validators.errors(formState);

			assert(stubbedValidateDescription.calledOnce, 'validateDescription was not called once');
			assert(stubbedValidateEndDate.calledOnce, 'validateEndDate was not called once');
		});

		it('should handle errors for categorical markets', () => {
			formState = {
				type: CATEGORICAL,
				description: 'test',
				endDate: new Date(),
				categoricalOutcomes: [
					'outcome1',
					'outcome2'
				]
			};

			validators.errors(formState);

			assert(stubbedValidateDescription.calledOnce, 'validateDescription was not called once');
			assert(stubbedValidateEndDate.calledOnce, 'validateEndDate was not called once');
			assert(stubbedValidateCategoricalOutcomes.calledOnce, 'validateCategoricalOutcomes was not called once');
		});

		it('should handle errors for scalar markets', () => {
			formState = {
				type: SCALAR,
				description: 'test',
				endDate: new Date(),
				scalarSmallNum: 10,
				scalarBigNum: 100
			};

			validators.errors(formState);

			assert(stubbedValidateDescription.calledOnce, 'validateDescription was not called once');
			assert(stubbedValidateEndDate.calledOnce, 'validateEndDate was not called once');
			assert(stubbedValidateScalarSmallNum.calledOnce, 'validateScalarSmallNum was not called once');
			assert(stubbedValidateScalarBigNum.calledOnce, 'validateScalarBigNum was not called once');
		});
	});
});
