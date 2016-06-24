import { assert } from 'chai';

import * as formatNumber from '../../src/utils/format-number';

describe('utils/format-number.js', () => {
	describe('formatEther', () => {

	});

	describe('formatPercent', () => {

	});

	describe('formatShares', () => {
		
	});

	describe('formatRep', () => {

	});

	describe('formatNone', () => {
		it('should return a properly formatted `none` number object', () => {
			let out = {
				value: 0,
				formattedValue: 0,
				formatted: '-',
				roundedValue: 0,
				rounded: '-',
				minimized: '-',
				denomination: '',
				full: '-'
			};

			assert.deepEqual(formatNumber.formatNone(), out, 'returned `none` formatted number object was not correct formatted');
		});
	});
});