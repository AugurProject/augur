export function get(obj, target){
	return target.split(".").reduce(function(o, x) {
		return (typeof o == "undefined" || o === null) ? o : o[x];
	}, obj);
}