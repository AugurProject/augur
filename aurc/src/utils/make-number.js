function makeNumber(num, denomination, omitSign, noRandom) {
	let	rndNum = num;
	if (!noRandom || Math.round(num) !== num) {
		rndNum = Math.round(num * 10000) / 10000;
	}

	const o = {
		value: rndNum,
		formattedValue: rndNum,
		formatted: rndNum.toFixed(2),
		roundedValue: Math.round(rndNum),
		rounded: Math.round(rndNum).toFixed(2),
		minimized: rndNum.toFixed(0),
		denomination: denomination || ''
	};
	if (denomination === ' shares') {
		o.formatted = addBigUnitPostfix(rndNum);
		o.rounded = addBigUnitPostfix(rndNum);
		o.fullPrecision = rndNum.toString();
	}

	const neverShowPlusSign = true;
	if (!omitSign && !neverShowPlusSign) {
		if (o.value > 0) {
			o.formatted = `+${o.formatted}`;
			o.rounded = `+${o.rounded}`;
			o.minimized = `+${o.minimized}`;
		}
	}

	o.full = o.formatted + o.denomination;

	return o;
}

function addBigUnitPostfix(value) {
	let postfixed;
	if (value > 1000000000000) {
		postfixed = '> 1T';
	} else if (value > 10000000000) {
		postfixed = `${(value / 1000000000).toFixed(0)}B`;
	} else if (value > 10000000) {
		postfixed = `${(value / 1000000).toFixed(0)}M`;
	} else if (value > 10000) {
		postfixed = `${(value / 1000).toFixed(0)}K`;
	} else {
		postfixed = value.toFixed(2);
	}
	return postfixed;
}

export default makeNumber;
