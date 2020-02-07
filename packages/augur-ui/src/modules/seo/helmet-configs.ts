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
  title: 'Decentralized Prediction Markets',
  description: 'Augur is a decentralized oracle and prediction market protocol built on the Ethereum blockchain. It allows you to forecast events and be rewarded for predicting them correctly.',
  ogTitle: 'Decentralized Prediction Markets',
  ogDescription: 'Augur is a decentralized oracle and prediction market protocol built on the Ethereum blockchain. It allows you to forecast events and be rewarded for predicting them correctly.',
  ogSiteName: 'Decentralized Prediction Markets',
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
  twitterTitle: 'Decentralized Prediction Markets',
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

export const CREATE_MARKET_VIEW_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: 'Create market',
};

export const MARKETS_VIEW_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: 'Markets',
  canonicalUrl: 'http://v2.augur.net/#!/markets?maxFee=1&spread=100',
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
