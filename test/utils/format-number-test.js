import { assert } from 'chai';

import * as formatNumber from '../../src/utils/format-number';

describe('utils/format-number.js', () => {
	const	num = 1000.100,
			utils = [
				{
					func: 'formatEther',
					denom: 'eth',
					out: {
						value: 1000.1,
						formattedValue: 1000.1,
						roundedValue: 1000.1,
						formatted: '1,000.100',
						rounded: '1,000.1',
						minimized: '1,000.1',
						denomination: ' ETH',
						full: '1,000.100 ETH'
					}
				},
				{
					func: 'formatPercent',
					denom: '%',
					out: {
						value: 1000.1,
						formattedValue: 1000.1,
						roundedValue: 1000,
						formatted: '1,000.1',
						rounded: '1,000',
						minimized: '1,000.1',
						denomination: '%',
						full: '1,000.1%'
					}
				},
				{
					func: 'formatShares',
					denom: 'shares',
					out: {
						value: 1000.1,
						formattedValue: 1000.1,
						roundedValue: 1000,
						formatted: '1,000.1',
						rounded: '1,000',
						minimized: '1,000.1',
						denomination: ' shares',
						full: '1,000.1 shares'
					}
				},
				{
					func: 'formatRep',
					denom: 'rep',
					out: {
						value: 1000.1,
						formattedValue: 1000,
						roundedValue: 1000,
						formatted: '1,000',
						rounded: '1,000',
						minimized: '1,000',
						denomination: ' REP',
						full: '1,000 REP'
					}
				}
			];

	utils.map((currentUtil) => {
		describe(`${currentUtil.func}`, () => {
			it('should return a correctly formatted object', () => {
				assert.deepEqual(
					formatNumber[`${currentUtil.func}`](num),
					currentUtil.out,
					'returned formatted number is not correctly formatted'
				);
			});
		});
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