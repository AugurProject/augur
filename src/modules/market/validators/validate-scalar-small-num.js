export default function (scalarSmallNum, scalarBigNum) {
	const parsedSmall = parseFloat(scalarSmallNum);
	if (!scalarSmallNum) {
		return 'Please provide a minimum value';
	}
	if (parsedSmall !== scalarSmallNum) {
		return 'Minimum value must be a number';
	}
	if (parseFloat(scalarBigNum) === scalarBigNum && parsedSmall >= parseFloat(scalarBigNum)) {
		return 'Minimum must be less than maximum';
	}
	return null;
}
