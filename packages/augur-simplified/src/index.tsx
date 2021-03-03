import React from 'react';
import { render } from 'react-dom';
import App from './modules/App';
import { windowRef } from './utils/window-ref';
import AugurComps from '@augurproject/augur-comps';
console.log(AugurComps);
windowRef.appStatus = {};
windowRef.graphData = {};
windowRef.user = {};

render(<App />, document.getElementById('root'));
