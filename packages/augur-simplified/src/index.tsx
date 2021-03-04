import React from 'react';
import { render } from 'react-dom';
import App from './modules/App';
import AugurComps, { windowRef } from '@augurproject/augur-comps';
console.log('next is default:');
console.log(AugurComps);
windowRef.appStatus = {};
windowRef.graphData = {};
windowRef.user = {};

render(<App />, document.getElementById('root'));
