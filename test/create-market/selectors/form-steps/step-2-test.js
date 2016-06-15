import {
	assert
} from 'chai';

import {
	BINARY,
	CATEGORICAL,
	SCALAR,
	COMBINATORIAL
} from '../../../../src/modules/markets/constants/market-types';

import {
	DESCRIPTION_MIN_LENGTH,
	DESCRIPTION_MAX_LENGTH,
	CATEGORICAL_OUTCOMES_MIN_NUM,
	CATEGORICAL_OUTCOMES_MAX_NUM,
	CATEGORICAL_OUTCOME_MAX_LENGTH
} from '../../../../src/modules/create-market/constants/market-values-constraints';

import * as selector from '../../../../src/modules/create-market/selectors/form-steps/step-2';

import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe(`modules/create-market/selectors/form-steps/step-2.js`, () => {
	proxyquire.noPreserveCache().noCallThru();

	let formState,
		out;

	let validations = {
		validateDescription: () => {},
		validateEndDate: () => {},
		validateScalarSmallNum: () => {},
		validateScalarBigNum: () => {},
		validateCategoricalOutcomes: () => {}
	};

	let stubbedValidateDescription = sinon.stub(validations, 'validateDescription');
	stubbedValidateDescription.returns(false);

	let stubbedValidateEndDate = sinon.stub(validations, 'validateEndDate');
	stubbedValidateEndDate.returns(false);

	let stubbedValidateScalarSmallNum = sinon.stub(validations, 'validateScalarSmallNum');
	stubbedValidateScalarSmallNum.returns(false);

	let stubbedValidateScalarBigNum = sinon.stub(validations, 'validateScalarBigNum');
	stubbedValidateScalarBigNum.returns(false);

	let stubbedValidateCategoricalOutcomes = sinon.stub(validations, 'validateCategoricalOutcomes');
	stubbedValidateCategoricalOutcomes.returns([]);

	let validators = proxyquire('../../../../src/modules/create-market/selectors/form-steps/step-2', {
		'../../../market/validators/validate-description': stubbedValidateDescription,
		'../../../market/validators/validate-end-date': stubbedValidateEndDate,
		'../../../market/validators/validate-scalar-small-num': stubbedValidateScalarSmallNum,
		'../../../market/validators/validate-scalar-big-num': stubbedValidateScalarBigNum,
		'../../../market/validators/validate-categorical-outcomes': stubbedValidateCategoricalOutcomes
	});

	before(() => {
		sinon.stub(Array.prototype, 'some', () => false);
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

		it('[NOT CURRENTLY USED] should return the correct object for a combinatorial market');
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
			stubbedValidateCategoricalOutcomes.reset();
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
	});

	it(`should handle validation of step 2`, () => {
		// formState1 = {
		// 	type: BINARY,
		// 	descriptionPlaceholder: 'Will "Batman v Superman: Dawn of Justice" take more than $150 million box in office receipts opening weekend?',
		// 	descriptionMinLength: 1,
		// 	descriptionMaxLength: 256
		// };
        //
		// formState2 = {
		// 	descriptionPlaceholder: 'Who will win the Four Nations Rugby Championship in 2016?',
		// 	descriptionMinLength: 1,
		// 	descriptionMaxLength: 256,
		// 	categoricalOutcomesMinNum: 2,
		// 	categoricalOutcomesMaxNum: 8,
		// 	categoricalOutcomeMaxLength: 250
		// };
        //
		// formState3 = {
		// 	descriptionPlaceholder: 'What will the temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?',
		// 	descriptionMinLength: 1,
		// 	descriptionMaxLength: 256,
		// 	scalarSmallNum: 10,
		// 	scalarBigNum: 100
		// };
        //
		// formState4 = {
		// 	descriptionPlaceholder: 'Combinatorial',
		// 	descriptionMinLength: 1,
		// 	descriptionMaxLength: 256
		// };
        //
		// // assert(!selector.isValid(formState1), `Didn't properly invalidate a formstate without description`);
		// formState1.description = 'test1234 this is a description';
		// // assert(!selector.isValid(formState1), `Didn't properly invalidate a formState without a valid endDate`);
		// formState1.endDate = Date('01/01/3000');
		// // assert(selector.isValid(formState1), `Didn't properly validate a BINARY form state`);
        //
		// formState2.description = 'test1234 this is a description';
		// formState2.endDate = Date('01/01/3000');
		// formState3.description = 'test1234 this is a description';
		// formState3.endDate = Date('01/01/3000');
		// formState4.description = 'test1234 this is a description';
		// formState4.endDate = Date('01/01/3000');

		// assert(selector.isValid(formState2), `Didn't properly validate a CATEGORICAL form state`);
		// assert(selector.isValid(formState3), `Didn't properly validate a SCALAR form state`);
		// assert(selector.isValid(formState4), `Didn't properly validate a COMBINATORIAL form state`);
	});

	it(`should handle errors in step 2`, () => {
		// formState1 = {
		// 	type: BINARY,
		// 	description: '',
		// 	endDate: 'notadate'
		// };
		// formState2 = {
		// 	type: CATEGORICAL,
		// 	categoricalOutcomes: [1]
		// };
		// formState3 = {
		// 	type: SCALAR,
		// 	scalarSmallNum: 200,
		// 	scalarBigNum: 1
		// };
		// out1 = {
		// 	description: 'Please enter your question',
		// 	endDate: null
		// };
		// out2 = {
		// 	categoricalOutcomes: ['Answer cannot be blank']
		// };
		// out3 = {
		// 	scalarSmallNum: 'Minimum must be less than maximum',
		// 	scalarBigNum: 'Maximum must be greater than minimum'
		// };

		// assert.deepEqual(selector.errors(formState1), out1, `Didn't catch the expected errors for BINARY forms`);
		// assert.deepEqual(selector.errors(formState2), out2, `Didn't catch the expected errors for SCALAR forms`);
		// assert.deepEqual(selector.errors(formState3), out3, `Didn't catch the expected errors for CATEGORICAL forms`);

	});
});
