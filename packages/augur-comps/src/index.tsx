// import React from 'react';
// import { App } from './App';
// import { render } from 'react-dom';

export * from './components/market-card/market-card';
export * from './components/common/logo';
export * from './components/common/buttons';
export * from './utils/create-big-number';
export * from './utils/log-error';
export * from './utils/get-number-precision';
export * from './utils/window-ref';
export * from './utils/format-number';
export * from './utils/date-utils';
export * from './utils/constants';
export * from './utils/routes/parse-path';

export { ConnectAccountProvider } from './components/ConnectAccount/connect-account-provider';
export { ConnectAccount } from './components/ConnectAccount/index';
export * from './components/ConnectAccount/hooks';

// TODO: determine why this even works since we haven't included augur-sdk-lite
// export { CATEGORIES_ICON_MAP } from './components/common/category-icons-map';

// render(<App />, document.getElementById('root'));
