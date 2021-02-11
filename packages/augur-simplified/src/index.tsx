import React from 'react';
import { render } from 'react-dom';
import App from './modules/App';
import { windowRef } from './utils/window-ref';

windowRef.appStatus = {};
windowRef.graphData = {};

render(<App />, document.getElementById('root'));
