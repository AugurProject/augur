import addCommas from '../utils/add-commas-to-number';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	Produces a formatted number object used for display and calculations
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

The main function is `formatNumber`, however there are top-level functions that wrap for common cases like `formatEther`, `formatShares`, etc.

A formatted number generally has three parts: the sign (+ or -), the stylized number, and a denomination (Eth, Rep, %, etc.)

The formatted number object that is returned looks something like this:
	{
		value: the parsed number in numerical form, 0 if a bad input was passed in, can be used in calculations

		formattedValue: the value in numerical form, possibly rounded, can be used in calculations
		formatted: the value in string form with possibly additional formatting, like comma separator, used for display

		o.roundedValue: the value in numerical form, with extra rounding, can be used in calculations
		o.rounded: the value in string form, with extra rounding and possibly additional formatting, like comma separator, used for display

		o.minimized: the value in string form, with trailing 0 decimals omitted, for example if the `formatted` value is 1.00, this minimized value would be 1
	}

The reason the number object has multiple states of rounding simultaneously,
is because the ui can use it for multiple purposes. For example, when showing ether,
we generally like to show it with 2 decimals, however when used in totals,
maximum precision is not necessary, and we can opt to show the `rounded` display, which is only 1 decimal.
Similar logic applies for `minimized`, sometimes we don't need to be consistent with the decimals
and just show the prettiest, smallest representation of the value.

The options object that is passed into `formatNumber` that enables all of this looks like:
	{
		decimals: the number of decimals for the precise case, can be 0-infinity
		decimalsRounded: the number of decimals for the prettier case, can be 0-infinity
		denomination: the string denomination of the number (ex. Eth, Rep, %), can be blank
		positiveSign: boolean whether to include a plus sign at the beginning of positive numbers
		zeroStyled: boolean, if true, when the value is 0, it formates it as a dash (-) instead
	}

TIP
Sometimes (not always) it is a good idea to use the formatted values in calculations,
rather than the original input number, so that values match up in the ui. For example, if you are
adding the numbers 1.11 and 1.44, but displaying them as 1.1 and 1.4, it may look awkward
if 1.1 + 1.4 = 2.6. If perfect precision isn't necessary, consider adding them using the formatted values.

*/

export function formatEther(num, opts) {
	return formatNumber(
		num,
		{
			decimals: 2,
			decimalsRounded: 1,
			denomination: 'eth',
			positiveSign: true,
			zeroStyled: false,
			...opts
		}
	);
}

export function formatPercent(num, opts) {
	return formatNumber(
		num,
		{
			decimals: 1,
			decimalsRounded: 0,
			denomination: '%',
			positiveSign: true,
			zeroStyled: false,
			...opts
		}
	);
}

export function formatShares(num, opts) {
	return formatNumber(
		num,
		{
			decimals: 2,
			decimalsRounded: 0,
			denomination: 'shares',
			minimized: true,
			zeroStyled: false,
			...opts
		}
	);
}

export function formatRep(num, opts) {
	return formatNumber(
		num,
		{
			decimals: 0,
			decimalsRounded: 0,
			denomination: 'rep',
			positiveSign: true,
			zeroStyled: false,
			...opts
		}
	);
}

export function formatNone() {
	return {
		value: 0,
		formattedValue: 0,
		formatted: '-',
		roundedValue: 0,
		rounded: '-',
		minimized: '-',
		denomination: '',
		full: '-'
	};
}

export function formatNumber(num, opts = { decimals: 0, decimalsRounded: 0, denomination: '', positiveSign: false, zeroStyled: true, minimized: false }) {
	const { minimized } = opts;
	const o = {};
	let { value, decimals, decimalsRounded, denomination, positiveSign, zeroStyled } = opts;

	decimals = decimals || 0;
	decimalsRounded = decimalsRounded || 0;
	denomination = denomination || '';
	positiveSign = !!positiveSign;
	zeroStyled = zeroStyled !== false;
	value = parseFloat(num) || 0;

	if (!value && zeroStyled) {
		return formatNone();
	}

	o.value = value;
	o.formattedValue = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
	o.formatted = addCommas(o.formattedValue.toFixed(decimals));
	o.roundedValue = Math.round(value * Math.pow(10, decimalsRounded)) / Math.pow(10, decimalsRounded);
	o.rounded = addCommas(o.roundedValue.toFixed(decimalsRounded));
	o.minimized = addCommas(o.formattedValue.toFixed(decimals));

	if (positiveSign) {
		if (o.formattedValue > 0) {
			o.formatted = `+${o.formatted}`;
			o.minimized = `+${o.minimized}`;
		}
		if (o.roundedValue > 0) {
			o.rounded = `+${o.rounded}`;
		}
	}

	if (minimized) {
		o.formatted = o.minimized;
	}

	o.denomination = denomination;
	o.full = o.formatted + o.denomination;

	return o;
}
