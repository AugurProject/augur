import React from 'react';
import { render } from 'react-dom';
import selectors from './selectors';

import AppContainer from './app';
const appElement = document.getElementById('app');

render(
	<AppContainer selectors={ selectors } />,
	appElement
);

