import React from 'react';
import { App } from './App';
import { render } from 'react-dom';

export * from './components/common/logo';
export * from './components/common/buttons';

render(<App />, document.getElementById('root'));
