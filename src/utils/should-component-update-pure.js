export default function (nextProps, nextState) {
	return isShallowUnEqual(nextProps, this.props) || isShallowUnEqual(nextState, this.state);
}

export function shouldComponentUpdateLog(nextProps, nextState) {
	return isShallowUnEqual(nextProps, this.props, true) || isShallowUnEqual(nextState, this.state, true);
}

function isShallowUnEqual(obj1, obj2, log) {
	if (obj1 === obj2) {
		return false;
	}

	if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
		return true;
	}

	const keysA = Object.keys(obj1);
	const keysB = Object.keys(obj2);
	const keysALen = keysA.length;

	if (keysALen !== keysB.length) {
		return true;
	}

	for (let i = 0; i < keysALen; i++) {
		if (obj1[keysA[i]] !== obj2[keysA[i]] && typeof obj1[keysA[i]] !== 'function') {
			log && console.log('------->', keysA[i], obj1[keysA[i]], obj2[keysA[i]]);
			return true;
		}
	}

	return false;
}
