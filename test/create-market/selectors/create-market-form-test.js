import {
	assert
} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import createMarketFormAssertion from '../../../node_modules/augur-ui-react-components/test/assertions/createMarketForm';

let createMarketForm;
describe(`modules/create-market/selectors/create-market-form.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, selector, out, test, steps, step2, step3, step4, step5, returnObj;
	let state = Object.assign({}, testState);
	store = mockStore(state);

	steps = {
		select: (formState) => true,
		errors: () => {},
		isValid: (formState) => true,
		initialFairPrices: () => {}
	};
	returnObj = {
		descriptionPlaceholder: 'some desc',
		descriptionMinLength: 1,
		descriptionMaxLength: 250
	};
	step2 = sinon.stub(Object.assign({}, steps));
	step2.isValid.returns(true);
	step2.select.returns(returnObj);
	step2.initialFairPrices.returns({});

	returnObj = {
		tagsMaxNum: 3,
		tagMaxLength: 25,
		resourcesMaxNum: 5,
		resourceMaxLength: 1250
	};
	step3 = sinon.stub(Object.assign({}, steps, {
		select: (formState) => returnObj
	}));
	step3.isValid.returns(true);
	step3.select.returns(returnObj);

	returnObj = {
		tradingFeePercent: 2,
		initialLiquidity: 500,
	};
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

	it(`should init the formState correctly`, () => {
		test = selector.default();
		createMarketFormAssertion(test);
		// above assertion will need to be reworked.
		assert.isFunction(test.onValuesUpdated);
		assert.equal(test.step, 1);
		assert.isObject(test.errors);
	});

	it(`should handle step2 correctly`, () => {
		state.createMarketInProgress = {
			errors: {},
			step: 2,
			type: 'binary'
		};

		test = selector.default();

		assert(step2.select.calledOnce);
		assert(step2.isValid.calledOnce);
		assert(step2.errors.calledOnce);

		assert.equal(test.step, 2);
		assert.equal(test.type, 'binary');
		assert.isFunction(test.onValuesUpdated);
		assert.isString(test.descriptionPlaceholder);
		assert.isNumber(test.descriptionMinLength);
		assert.isNumber(test.descriptionMaxLength);
		assert.isTrue(test.isValid);
		// set state to the current results from test for next step
		state.createMarketInProgress = test;
	});

	it(`should handle step3 correctly`, () => {
		state.createMarketInProgress.step = 3;

		test = selector.default();

		assert(step3.select.calledOnce);
		assert(step3.isValid.calledOnce);
		assert(step3.errors.calledOnce);

		assert.equal(test.step, 3);
		assert.equal(test.type, 'binary');
		assert.isFunction(test.onValuesUpdated);
		assert.isString(test.descriptionPlaceholder);
		assert.isNumber(test.descriptionMinLength);
		assert.isNumber(test.descriptionMaxLength);
		assert.isTrue(test.isValid);
		assert.isNumber(test.tagsMaxNum);
		assert.isNumber(test.tagMaxLength);
		assert.isNumber(test.resourcesMaxNum);
		assert.isNumber(test.resourceMaxLength);
		// set state to the current results from test for next step
		state.createMarketInProgress = test;
	});

	it(`should handle step4 correctly`, () => {
		state.createMarketInProgress.step = 4;

		test = selector.default();

		assert(step4.select.calledOnce);
		assert(step4.isValid.calledOnce);
		assert(step4.errors.calledOnce);

		assert.equal(test.step, 4);
		assert.equal(test.type, 'binary');
		assert.isFunction(test.onValuesUpdated);
		assert.isString(test.descriptionPlaceholder);
		assert.isNumber(test.descriptionMinLength);
		assert.isNumber(test.descriptionMaxLength);
		assert.isTrue(test.isValid);
		assert.isNumber(test.tagsMaxNum);
		assert.isNumber(test.tagMaxLength);
		assert.isNumber(test.resourcesMaxNum);
		assert.isNumber(test.resourceMaxLength);
		assert.isNumber(test.tradingFeePercent);
		assert.isNumber(test.initialLiquidity);
		// set state to the current results from test for next step
		state.createMarketInProgress = test;
	});

	it(`should handle step5 correctly`, () => {
		state.createMarketInProgress.step = 5;

		test = selector.default();

		assert(step5.select.calledOnce);

		assert.isObject(test.errors);
		assert.equal(test.step, 5);
		assert.equal(test.type, 'binary');
		assert.isFunction(test.onValuesUpdated);
		assert.isString(test.descriptionPlaceholder);
		assert.isNumber(test.descriptionMinLength);
		assert.isNumber(test.descriptionMaxLength);
		assert.isTrue(test.isValid);
		assert.isNumber(test.tagsMaxNum);
		assert.isNumber(test.tagMaxLength);
		assert.isNumber(test.resourcesMaxNum);
		assert.isNumber(test.resourceMaxLength);
		assert.isNumber(test.tradingFeePercent);
		assert.isNumber(test.initialLiquidity);
	});

});

export default createMarketForm;
