import { describe, it } from 'mocha';
import { assert } from 'chai';
import {
	TAGS_MAX_NUM,
	TAGS_MAX_LENGTH,
	RESOURCES_MAX_NUM,
	RESOURCES_MAX_LENGTH,
	EXPIRY_SOURCE_GENERIC,
	EXPIRY_SOURCE_SPECIFIC
} from 'modules/create-market/constants/market-values-constraints';
import * as selector from 'modules/create-market/selectors/form-steps/step-3';

describe(`modules/create-market/selectors/form-steps/step-3.js`, () => {
	let formState;
	let out;

	it('should handle returning correct data shape', () => {
		out = {
			tagsMaxNum: TAGS_MAX_NUM,
			tagMaxLength: TAGS_MAX_LENGTH,
			resourcesMaxNum: RESOURCES_MAX_NUM,
			resourceMaxLength: RESOURCES_MAX_LENGTH,
			expirySourceTypes: {
				generic: EXPIRY_SOURCE_GENERIC,
				specific: EXPIRY_SOURCE_SPECIFIC
			}
		};
		assert.deepEqual(selector.select('test'), out, `Didn't return the expected output for select()`);
	});

	it(`should handle validation of step 3`, () => {
		formState = {};
		assert(!selector.isValid(formState), `Didn't invalidate a missing expirySource`);
		formState.expirySource = EXPIRY_SOURCE_SPECIFIC;
		assert(!selector.isValid(formState), `Didn't invalidate a missing expirySourceUrl when you have a EXPIRY_SOURCE_SPECIFIC expirySource`);
		formState.expirySourceUrl = '/test';
		assert(selector.isValid(formState), `Didn't validate a valid formState`);
	});

	it(`should handle errors in step 3`, () => {
		formState = {};
		assert.deepEqual(selector.errors(formState), {}, `Didn't return no errors when there was no invalid data`);

		formState.expirySource = 'test';
		out = {
			expirySource: 'Please choose an expiry source'
		};
		assert.deepEqual(selector.errors(formState), out, `Didn't return the expected error for expirySource`);

		formState.endDate = Date('01/01/3000');
		formState.expirySource = EXPIRY_SOURCE_SPECIFIC;
		formState.expirySourceUrl = '';
		out = {
			expirySource: undefined,
			expirySourceUrl: 'Please enter the full URL of the website'
		};
		assert.deepEqual(selector.errors(formState), out, `Didn't produce the expected error output for missing sourceURL`);
	});
});
