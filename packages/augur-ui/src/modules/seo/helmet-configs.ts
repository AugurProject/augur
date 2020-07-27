/*
 * Useful tips:
 *
 * HTML
 * Titles should have 50–60 characters. Reminder! The " | Augur" at the end of the title adds 8 characters
 * Descriptions can be any length, but Google generally truncates snippets to 155–160 characters
 *
 * Open Graph (OG)
 * Title should have 60-90 characters
 * Description should have around 200 characters
 * The recommended image size is 1200px x 627px and no more than 5MB
 * Two column's layout (image on the left, text on the right) can be achieved using images smaller than 400px x 209px
 *
 * Twitter Cards
 * https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/markup
 * Title should have 70 characters
 * Description should have around 200 characters
 * Small image box should have at least 120×120 pixels and no more than 1MB
 * Full width image box should have at least 280 x 150 pixels and no more than 1MB
 */

export const COMMON_HEAD_TAGS = {
  title: 'Your Global, No-Limit Betting Platform',
  description: 'Augur is a decentralized oracle and prediction market protocol built on the Ethereum blockchain. It allows you to forecast events and be rewarded for predicting them correctly.',
  ogTitle: 'Your Global, No-Limit Betting Platform',
  ogDescription: 'Augur is a decentralized oracle and prediction market protocol built on the Ethereum blockchain. It allows you to forecast events and be rewarded for predicting them correctly.',
  ogSiteName: 'Your Global, No-Limit Betting Platform',
  ogUrl: 'http://augur.net',
  ogImage: 'images/apple-touch-icon-152x152.png',
  ogLocale: 'en_US',
  ogType: 'article',
  articleTag: ['Augur', 'Prediction Markets', 'Predictive Market', 'Market Predictions', 'Share Market', 'Bet Predictions', 'Prediction Site', 'Decentralized'],
  articlePublishedTime: '2019-01-07T00:00:01+00:00',
  articleModifiedTime: '2019-01-07T00:00:12+00:00',
  ogUpdatedTime: '2019-01-07T00:00:12+00:00',
  articlePublisher: 'http://augur.net',
  articleSection: 'Prediction Markets',
  ogImageWidth: '1024',
  ogImageHeight: '640',
  ogImageAlt: 'Augur logo in the color purple. The logo is a tetrahedron with lines coming out of the edges, forming a circle in the middle. It represents a bunch of disparate points of information [i.e the edges] swirling in to converge upon some truth.',
  twitterCardType: 'summary',
  twitterTitle: 'Your Global, No-Limit Betting Platform',
  twitterDescription: 'Augur is a decentralized prediction market built on the Ethereum blockchain. It allows you to forecast events and be rewarded for predicting them correctly.',
  twitterImage: 'images/apple-touch-icon-152x152.png',
  twitterImageAlt: 'Augur logo in the color purple. The logo is a tetrahedron with lines coming out of the edges, forming a circle in the middle. It represents a bunch of disparate points of information [i.e the edges] swirling in to converge upon some truth.',
  twitterSite: '@AugurProject',
  twitterCreator: '@AugurProject',
};

export const APP_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  canonicalUrl: 'http://v2.augur.net/#!/markets?maxFee=1&spread=100',
};


const CREATE_MARKET_VIEW_TITLE = 'Create Market — Creating popular, liquid, and valid markets';

export const CREATE_MARKET_VIEW_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: CREATE_MARKET_VIEW_TITLE,
  ogTitle: CREATE_MARKET_VIEW_TITLE,
  twitterTitle: CREATE_MARKET_VIEW_TITLE,
};

const MARKETS_VIEW_TITLE = 'The world’s most accessible, no-limit betting exchange';
const MARKETS_VIEW_DESCRIPTION = 'Bet and trade on user-created markets, from weather to crypto to economics. No limits on the amount you can bet or what you can bet on. Lowest fees and the best odds.';

export const MARKETS_VIEW_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: MARKETS_VIEW_TITLE,
  ogTitle: MARKETS_VIEW_TITLE,
  twitterTitle: MARKETS_VIEW_TITLE,
  description: MARKETS_VIEW_DESCRIPTION,
  ogDescription: MARKETS_VIEW_DESCRIPTION,
  twitterDescription: MARKETS_VIEW_DESCRIPTION,
  canonicalUrl: 'http://v2.augur.net/#!/markets',
};

export const MARKET_VIEW_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
};

const ACCOUNT_VIEW_VIEW_TITLE = 'Account Summary — View your balances, P/L, watchlist & more';

export const ACCOUNT_VIEW_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: ACCOUNT_VIEW_VIEW_TITLE,
  ogTitle: ACCOUNT_VIEW_VIEW_TITLE,
  twitterTitle: ACCOUNT_VIEW_VIEW_TITLE,
};

const PORTFOLIO_VIEW_TITLE = 'Portfolio — View your positions, orders & more';

export const PORTFOLIO_VIEW_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: PORTFOLIO_VIEW_TITLE,
  ogTitle: PORTFOLIO_VIEW_TITLE,
  twitterTitle: PORTFOLIO_VIEW_TITLE,
};

const REPORTING_TITLE = 'Reporting — Determining the outcome of markets';
const REPORTING_DESCRIPTION = 'Be rewarded for resolving Augur markets by verifying their outcomes when reporting begins. The reporting process finalizes markets to determine the winning shares.';

export const REPORTING_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: REPORTING_TITLE,
  ogTitle: REPORTING_TITLE,
  twitterTitle: REPORTING_TITLE,
  description: REPORTING_DESCRIPTION,
  ogDescription: REPORTING_DESCRIPTION,
  twitterDescription: REPORTING_DESCRIPTION,
};

const DISPUTING_TITLE = 'Disputing — Disputing incorrect tentative outcomes';
const DISPUTING_DESCRIPTION = 'Be rewarded for maintaining the integrity of Augur’s resolution process. Dispute a tentative outcome by staking collateral on an alternative outcome.';

export const DISPUTING_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: DISPUTING_TITLE,
  ogTitle: DISPUTING_TITLE,
  twitterTitle: DISPUTING_TITLE,
  description: DISPUTING_DESCRIPTION,
  ogDescription: DISPUTING_DESCRIPTION,
  twitterDescription: DISPUTING_DESCRIPTION,
};
