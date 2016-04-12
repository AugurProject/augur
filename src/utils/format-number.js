import { MILLIS_PER_BLOCK } from '../modules/app/constants/network';

export function formatRep(num, omitSign) {
    return formatValueDenomination(num, 0, 0, 'Rep', omitSign);
}

export function formatEther(num, omitSign) {
    return formatValueDenomination(num, 3, 0, 'Eth', omitSign);
}

export function formatShares(num, omitSign) {
    var denomination = 'Shares';
    return formatValueDenomination(num, 2, 0, denomination, omitSign);
}

export function formatPercent(num, omitSign) {
    return formatValueDenomination(num, 1, 0, '%', omitSign);
}

export function formatNumber(num, decimals = 1, roundedDecimals = 0, denomination = '', omitSign = true) {
    return formatValueDenomination(num, decimals, roundedDecimals, denomination, omitSign);
}

export function formatBlockToDate(currentBlock, startBlock, startBlockMillisSinceEpoch) {
	var millis = (currentBlock - startBlock) * MILLIS_PER_BLOCK,
		currentMillisSinceEpoch = startBlockMillisSinceEpoch + millis;
	try {
		return formatDate(new Date(currentMillisSinceEpoch));
	}
	catch (e) {
		return null;
	}
}

export function formatDate(d) {
	d = (d instanceof Date) ? d : new Date(0);
	return {
		date: d,
		formatted: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
		full: d.toISOString()
	};
}

export function formatValueDenomination(num, decimals, decimalsRounded, denomination, omitSign) {
    var o;
    if (!num) {
        return formatNone();
    }
    o = {};
    o.value = parseFloat(num) || 0;
    o.formattedValue = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    o.formatted = o.value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    if (!omitSign) {
    	o.formatted = (o.value > 0 && '+' || '') + o.formatted;
    }
    o.rounded = o.value.toLocaleString(undefined, { minimumFractionDigits: decimalsRounded, maximumFractionDigits: decimalsRounded });
    o.denomination = denomination;
    o.full = o.formatted + o.denomination;

    if (num === Math.round(num) && decimals) {
        o.minimized = o.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    else {
        o.minimized = o.formatted;
    }

    return o;
}

export function formatZero() {
    return {
        value: 0,
        formattedValue: 0,
        formatted: '0',
        rounded: '0',
        denomination: '',
        full: '0',
        minimized: '0'
    };
}

export function formatNone() {
    return {
        value: 0,
        formattedValue: 0,
        formatted: '-',
        rounded: '-',
        denomination: '',
        full: '-',
        minimized: '-'
    };
}