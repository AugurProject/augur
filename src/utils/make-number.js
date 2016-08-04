export function makeNumber(num, denomination, omitSign) {
	let	rndNum = num;
	if (Math.round(num) !== num) rndNum = Math.round(num * 100) / 100;

	const o = {
		value: rndNum,
		formattedValue: rndNum,
		formatted: rndNum.toString(),
		roundedValue: Math.round(rndNum),
		rounded: Math.round(rndNum).toString(),
		minimized: rndNum.toString(),
		denomination: denomination || ''
	};

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
