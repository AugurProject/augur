import { MILLIS_PER_BLOCK } from '../modules/app/constants/network';

export function formatRep(num, omitSign) {
    return formatNumber(num, {
                                    decimals: 0,
                                    decimalsRounded: 0,
                                    denomination: 'Rep',
                                    omitSign });
}

export function formatEther(num, omitSign) {
    return formatNumber(num, {
                                    decimals: 3,
                                    decimalsRounded: 0,
                                    denomination: 'Eth',
                                    omitSign });
}

export function formatShares(num, omitSign) {
    return formatNumber(num, {
                                    decimals: 2,
                                    decimalsRounded: 0,
                                    denomination: 'Shares',
                                    omitSign });

}

export function formatPercent(num, omitSign) {
    return formatNumber(num, {
                                    decimals: 1,
                                    decimalsRounded: 0,
                                    denomination: '%',
                                    omitSign });
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

export function formatNumber(num, opts = { decimals: 0, decimalsRounded: 0, denomination: '', omitSign: true, zero: true }) {
    var { decimals, decimalsRounded, denomination, omitSign, zero } = opts,
        o;

    decimals = decimals || 0;
    decimalsRounded = decimalsRounded || 0;
    denomination = denomination || '';
    omitSign = omitSign !== false;
    zero = zero !== false;

    if (!num && !zero) {
        return formatNone();
    }

    o = {};
    o.value = parseFloat(num) || 0;

    o.formattedValue = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    o.formatted = o.formattedValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

    o.roundedValue = Math.round(num * Math.pow(10, decimalsRounded)) / Math.pow(10, decimalsRounded);
    o.rounded = o.roundedValue.toLocaleString(undefined, { minimumFractionDigits: decimalsRounded, maximumFractionDigits: decimalsRounded });

    o.minimized = o.formattedValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals });

    if (!omitSign) {
        if (o.formattedValue > 0) {
            o.formatted = '+' + o.formatted;
            o.minimized = '+' + o.minimized;
        }
        if (o.roundedValue > 0) {
            o.rounded = '+' + o.rounded;
        }
    }

    o.denomination = denomination;
    o.full = o.formatted + o.denomination;

    return o;
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