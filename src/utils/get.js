export function get(obj, target) {
	return target.split('.').reduce((o, x) => {
		const value = (typeof o === undefined || o === null) ? o : o[x];
		return value;
	}, obj);
}
