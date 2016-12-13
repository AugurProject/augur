import { describe, it } from 'mocha';
import { assert } from 'chai';

import * as formatNumber from 'utils/format-number';

describe('utils/format-number.js', () => {
	const	num = 1000.100;
	const utils = [
		{
			func: 'formatEther',
			denom: 'ETH',
			out: {
				value: 1000.1,
				formattedValue: 1000.1,
				roundedValue: 1000.1,
				formatted: '1,000.1000',
				rounded: '1,000.1000',
				minimized: '1,000.1',
				denomination: ' ETH',
				full: '1,000.1000 ETH'
			}
		},
		{
			func: 'formatRealEther',
			denom: 'real ETH',
			out: {
				value: 1000.1,
				formattedValue: 1000.1,
				roundedValue: 1000.1,
				formatted: '1,000.1000',
				rounded: '1,000.1000',
				minimized: '1,000.1',
				denomination: ' real ETH',
				full: '1,000.1000 real ETH'
			}
		},
		{
			func: 'formatEtherEstimate',
			denom: 'ETH (estimated)',
			out: {
				value: 1000.1,
				formattedValue: 1000.1,
				roundedValue: 1000.1,
				formatted: '1,000.1000',
				rounded: '1,000.1000',
				minimized: '1,000.1',
				denomination: ' ETH (estimated)',
				full: '1,000.1000 ETH (estimated)'
			}
		},
		{
			func: 'formatRealEtherEstimate',
			denom: 'real ETH (estimated)',
			out: {
				value: 1000.1,
				formattedValue: 1000.1,
				roundedValue: 1000.1,
				formatted: '1,000.1000',
				rounded: '1,000.1000',
				minimized: '1,000.1',
				denomination: ' real ETH (estimated)',
				full: '1,000.1000 real ETH (estimated)'
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
				roundedValue: 1000.1,
				formatted: '1,000.1',
				rounded: '1,000.10',
				minimized: '1,000.1',
				denomination: ' shares',
				full: '1,000.1 shares'
			}
		},
		{
			func: 'formatRep',
			denom: 'REP',
			out: {
				value: 1000.1,
				formattedValue: 1000.1,
				roundedValue: 1000,
				formatted: '1,000.10',
				rounded: '1,000',
				minimized: '1,000.1',
				denomination: ' REP',
				full: '1,000.10 REP'
			}
		}
	];

	utils.forEach((currentUtil) => {
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
			const out = {
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
