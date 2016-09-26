import React from 'react';
import { render } from 'react-dom';
import Router from './router';

export default function (appElement, selectors) {
	const p = selectors;
	const url = p.url;

	let doScrollTop = false;

	if (url !== window.location.pathname + window.location.search) {
		window.history.pushState(null, null, url);
		doScrollTop = true;
	}

	if (doScrollTop) {
		window.scrollTo(0, 0);
		doScrollTop = false;
	}

	render(<Router {...p} />, appElement);
}
