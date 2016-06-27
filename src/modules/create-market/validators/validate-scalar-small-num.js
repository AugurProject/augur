export default function (scalarSmallNum, scalarBigNum) {
	const parsedSmall = parseFloat(scalarSmallNum);
	if (!scalarSmallNum) {
		return 'Please provide a minimum value';
	}
	if (Number.isNaN(parsedSmall) && !Number.isFinite(parsedSmall)) {
		return 'Minimum value must be a number';
	}
	if (parseFloat(scalarBigNum) === scalarBigNum && parsedSmall >= parseFloat(scalarBigNum)) {
		return 'Minimum must be less than maximum';
	}
	return null;
}
