/**
 * @param {Object} searchParams
 * @return {{searchParams: Object, url: String}}
 */
export function makeLocation(searchParams = {}) {
	const search = (searchParams && Object.keys(searchParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`).join('&')) || '';
	let url = '/';
	if (search.length) {
		url = `${url}?${search}`;
	}
	return {
		searchParams,
		url
	};
}

function parseSearch(searchString) {
	let pairSplit;
	return (searchString || '').replace(/^\?/, '').split('&').reduce((p, pair) => {
		pairSplit = pair.split('=');
		if (pairSplit.length >= 1) {
			if (pairSplit[0].length) {
				if (pairSplit.length >= 2 && pairSplit[1]) {
					p[decodeURIComponent(pairSplit[0])] = decodeURIComponent(pairSplit[1]);
				} else {
					p[decodeURIComponent(pairSplit[0])] = '';
				}
			}
		}
		return p;
	}, {});
}

/**
 * @param {String} url
 * @return {{searchParams: Object, url: String}}
 */
export function parseURL(url) {
	const splitURL = url.split('?');
	const parsed = {};

	if (splitURL.length >= 2) {
		parsed.searchParams = parseSearch(splitURL[1]);
	}

	return makeLocation(parsed.searchParams);
}
