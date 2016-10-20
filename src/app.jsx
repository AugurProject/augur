import React from 'react';
import { render } from 'react-dom';
import Router from './router';

export default function (appElement, selectors) {
	render(<Router {...selectors} />, appElement);
}
