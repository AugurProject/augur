export function makeNumber(num, denomination, omitSign) {
	if (Math.round(num) !== num) num = Math.round(num * 100) / 100;
	var o = {
		value: num,

		formattedValue: num,
		formatted: num.toString(),

		roundedValue: num,
		rounded: num.toString(),

		minimized: num.toString(),
		denomination: denomination || ''
	};

	if (!omitSign) {
        if (o.value > 0) {
            o.formatted = '+' + o.formatted;
            o.rounded = '+' + o.rounded;
            o.minimized = '+' + o.minimized;
        }
	}

	o.full = o.formatted + o.denomination;

	return o;
}
