import {
	assert
} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import { assertions } from 'augur-ui-react-components';

let createMarketForm;
describe(`modules/create-market/selectors/create-market-form.js`, () => {
	proxyquire.noPreserveCache().noCallThru();

	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	let store,
		selector,
		test,
		steps,
		step2,
		step3,
		step4,
		step5,
		returnObj = {},
		state = Object.assign({}, testState);

	store = mockStore(state);

	steps = {
		select: (formState) => true,
		errors: () => {},
		isValid: (formState) => true
	};

	step2 = sinon.stub(Object.assign({}, steps, {
		initialFairPrices: () => {}
	}));
	step2.isValid.returns(true);
	step2.select.returns(returnObj);
	step2.initialFairPrices.returns({});

	step3 = sinon.stub(Object.assign({}, steps, {
		select: (formState) => returnObj
	}));
	step3.isValid.returns(true);
	step3.select.returns(returnObj);

	step4 = sinon.stub(Object.assign({}, steps, {
		select: (formState) => returnObj
	}));
	step4.isValid.returns(true);
	step4.select.returns(returnObj);

	step5 = sinon.stub(Object.assign({}, steps));
	step5.isValid.returns(true);

	selector = proxyquire('../../../src/modules/create-market/selectors/create-market-form', {
		'../../../store': store,
		'../../create-market/selectors/form-steps/step-2': step2,
		'../../create-market/selectors/form-steps/step-3': step3,
		'../../create-market/selectors/form-steps/step-4': step4,
		'../../create-market/selectors/form-steps/step-5': step5
	});

	createMarketForm = selector.default;

	describe('step 1', () => {
		let test;

		before(() => {
			test = selector.default();
		});

		it('should init formState correctly', () => {
			assert.equal(test.step, 1, 'step is not equal to 1');
		});

		it('should deliver the correct values to components', () => {
			assertions.createMarketForm.step1(test);
		});
	});

	// it(`should init the formState correctly`, () => {
	//
	// 	// console.log('step1Assertions -- ', step1Assertions);
	//
	// 	// createMarketFormAssertion1(test); // assertion will need to be reworked.
	//
	// 	// assertions.createMarketFormStep1(test);
	//
	// 	// console.log('assertions step 1 -- ', assertions.createMarketForm);
	//
	// 	// let ass = assertions.createMarketForm.step1;
	//
	// 	// ass(test);
	//
	//
	//
	//
	//
	// 	// assert.isFunction(test.onValuesUpdated, 'onValuesUpdated is not a function');
	// 	// assert.isTrue(test.creatingMarket, 'creatingMarket is not true');
	// 	// assert.isObject(test.errors, 'error value is not an object');
	// });

	// it(`should handle step2 correctly`, () => {
	// 	state.createMarketInProgress = {
	// 		step: 2,
	// 		type: 'binary',
	// 		initialFairPrices: {}
	// 	};
	//
	// 	test = selector.default();
	//
	// 	assert.equal(test.step, 2, 'step is not equal to 2');
	//
	// 	assert(step2.select.calledOnce, 'select is not called once');
	// 	assert(step2.isValid.calledOnce, 'isValid is not called once');
	// 	assert(step2.errors.calledOnce, 'errors is not called once');
	// 	assert(step2.initialFairPrices.calledOnce, 'initialFairPrices is not called once');
	//
	// 	state.createMarketInProgress = test;
	// });
	//
	// it(`should handle step3 correctly`, () => {
	// 	state.createMarketInProgress.step = 3;
	//
	// 	test = selector.default();
	//
	// 	assert.equal(test.step, 3, 'step is not equal to 3');
	//
	// 	assert(step3.select.calledOnce, 'select is not called once');
	// 	assert(step3.isValid.calledOnce, 'isValid is not called once');
	// 	assert(step3.errors.calledOnce, 'errors is not called once');
	//
	// 	state.createMarketInProgress = test;
	// });
	//
	// it(`should handle step4 correctly`, () => {
	// 	state.createMarketInProgress.step = 4;
	//
	// 	test = selector.default();
	//
	// 	assert.equal(test.step, 4, 'step is not equal to 4');
	//
	// 	assert(step4.select.calledOnce, 'select is not called once');
	// 	assert(step4.isValid.calledOnce, 'isValid is not called once');
	// 	assert(step4.errors.calledOnce, 'errors is not called once');
	//
	// 	state.createMarketInProgress = test;
	// });
	//
	// it(`should handle step5 correctly`, () => {
	// 	state.createMarketInProgress.step = 5;
	//
	// 	test = selector.default();
	//
	// 	assert(step5.select.calledOnce, 'select is not called once');
	// });

});

export default createMarketForm;