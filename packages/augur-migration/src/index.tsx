import React from 'react';
import { render } from 'react-dom';
import App from './modules/App';
import { windowRef } from '@augurproject/augur-comps';

windowRef.appStatus = {};
windowRef.user = {};

render(<App />, document.getElementById('root'));
