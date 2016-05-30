// import memoizerific from 'memoizerific';
import { MILLIS_PER_BLOCK } from '../modules/app/constants/network';

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

export function formatNumber(
num,
opts = {
	decimals: 0,
	decimalsRounded: 0,
	denomination: '',
	positiveSign: false,
	zero: true,
	minimized: false
}
) {
	const { minimized } = opts;
	const o = {};
	let { decimals, decimalsRounded, denomination, positiveSign, zero } = opts;

	decimals = decimals || 0;
	decimalsRounded = decimalsRounded || 0;
	denomination = denomination || '';
	positiveSign = !!positiveSign;
	zero = zero !== false;

	if (!num && !zero) {
		return formatNone();
	}

	o.value = parseFloat(num) || 0;

	o.formattedValue = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
	o.formatted = o.formattedValue.toLocaleString(
		undefined,
		{ minimumFractionDigits: decimals, maximumFractionDigits: decimals }
	);

	o.roundedValue =
	Math.round(num * Math.pow(10, decimalsRounded)) / Math.pow(10, decimalsRounded);
	o.rounded = o.roundedValue.toLocaleString(
		undefined,
		{ minimumFractionDigits: decimalsRounded, maximumFractionDigits: decimalsRounded }
	);

	o.minimized = o.formattedValue.toLocaleString(
		undefined,
		{ minimumFractionDigits: 0, maximumFractionDigits: decimals }
	);

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

export function formatRep(num, opts) {
	return formatNumber(
		num,
		{
			decimals: 0,
			decimalsRounded: 0,
			denomination: 'Rep',
			positiveSign: true,
			...opts
		}
	);
}

export function formatEther(num, opts) {
	return formatNumber(
		num,
		{
			decimals: 2,
			decimalsRounded: 1,
			denomination: 'Eth',
			positiveSign: true,
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
			denomination: 'Shares',
			minimized: true,
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
			...opts
		}
	);
}

export function makeDateFromBlock(currentBlock, startBlock, startBlockMillisSinceEpoch) {
	const millis = (currentBlock - startBlock) * MILLIS_PER_BLOCK;
	const	currentMillisSinceEpoch = startBlockMillisSinceEpoch + millis;
	return new Date(currentMillisSinceEpoch);
}

export function formatDate(d) {
	const months = [
		'Jan', 'Feb', 'Mar',
		'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep',
		'Oct', 'Nov', 'Dec'
	];
	const date = (d instanceof Date) ? d : new Date(0);
	return {
		value: date,
		formatted: `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
		full: d.toISOString()
	};
}
