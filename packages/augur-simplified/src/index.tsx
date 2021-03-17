import React from 'react';
import { render } from 'react-dom';
import App from './modules/App';
import * as comps from '@augurproject/augur-comps';
const { windowRef } = comps;
console.log(comps);
windowRef.appStatus = {};
windowRef.graphData = {};
windowRef.user = {};
windowRef.simplified = {};

render(<App />, document.getElementById('root'));
