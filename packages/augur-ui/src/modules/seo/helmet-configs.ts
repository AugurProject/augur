/*
 * Useful tips:
 *
 * Titles should have 50–60 characters. Reminder! The " | Augur" at the end of the title adds 8 characters
 * Descriptions can be any length, but Google generally truncates snippets to 155–160 characters
 */

export const COMMON_HEAD_TAGS = {
  ogSiteName: 'Augur',
  ogType: 'article',
};

export const APP_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: 'Decentralized Prediction Markets',
  description: 'Augur is a decentralized oracle and prediction market protocol built on the Ethereum blockchain. It allows you to forecast events and be rewarded for predicting them correctly.',
  canonicalUrl: 'http://v2.augur.net/',
  ogTitle: 'Decentralized Prediction Markets',
  ogDescription: 'Augur is a decentralized oracle and prediction market protocol built on the Ethereum blockchain. It allows you to forecast events and be rewarded for predicting them correctly.',
  ogUrl: 'http://v2.augur.net/',
  ogImage: '',
};

export const CREATE_MARKET_VIEW_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: 'Create market',
};

export const MARKETS_VIEW_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: 'Markets',
};

export const MARKET_VIEW_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
};

export const ACCOUNT_VIEW_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: 'Account Summary',
};

export const PORTFOLIO_VIEW_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: 'Portfolio',
};

export const REPORTING_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: 'Reporting',
};

export const DISPUTING_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: 'Disputing',
};
