export function get(obj, target) {
	return target.split('.').reduce((o, x) => ((typeof o === 'undefined' || o === null) ? o : o[x]), obj);
}
