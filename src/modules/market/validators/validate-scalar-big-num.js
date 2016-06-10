export default function (scalarSmallNum, scalarBigNum) {
	const parsedBig = parseFloat(scalarBigNum);

	if (!scalarBigNum) {
		return 'Please provide a maximum value';
	}
	if (Number.isNaN(parsedBig) && !Number.isFinite(parsedBig)) {
		return 'Maximum value must be a number';
	}
	if (parseFloat(scalarSmallNum) === scalarSmallNum && parsedBig <= parseFloat(scalarSmallNum)) {
		return 'Maximum must be greater than minimum';
	}
	return null;
}
