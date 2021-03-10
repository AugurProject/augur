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
  title: 'Augur',
  description: 'Augur is a decentralized oracle and prediction market protocol built on the Ethereum blockchain. It allows you to forecast events and be rewarded for predicting them correctly.',
  ogTitle: 'Decentralized Prediction Markets',
  ogDescription: 'Augur is a decentralized oracle and prediction market protocol built on the Ethereum blockchain. It allows you to forecast events and be rewarded for predicting them correctly.',
  ogSiteName: 'Decentralized Prediction Markets',
  ogUrl: '',
  ogImage: 'favicon/apple-icon-precomposed.png',
  ogLocale: 'en_US',
  ogType: 'article',
  articleTag: ['Augur', 'Prediction Markets', 'Predictive Market', 'Market Predictions', 'Share Market', 'Bet Predictions', 'Prediction Site', 'Decentralized'],
  articlePublishedTime: '2019-01-07T00:00:01+00:00',
  articleModifiedTime: '2019-01-07T00:00:12+00:00',
  ogUpdatedTime: '2019-01-07T00:00:12+00:00',
  articlePublisher: '',
  articleSection: 'Prediction Markets',
  ogImageWidth: '1024',
  ogImageHeight: '640',
  ogImageAlt: 'The image shows the Augur logo in the colors black and cyan inside a white circle. It represents a bunch of disparate points of information [i.e the edges] swirling in to converge upon some truth.',
  twitterCardType: 'summary',
  twitterTitle: 'Decentralized Prediction Markets',
  twitterDescription: 'Augur is a decentralized prediction market built on the Ethereum blockchain. It allows you to forecast events and be rewarded for predicting them correctly.',
  twitterImage: 'favicon/apple-icon-precomposed.png',
  twitterImageAlt: 'The image shows the Augur logo in the colors black and cyan inside a white circle. It represents a bunch of disparate points of information [i.e the edges] swirling in to converge upon some truth.',
  twitterSite: '@AugurProject',
  twitterCreator: '@AugurProject',
  canonicalUrl: '',
};

const MARKETS_LIST_TITLE = 'The world’s most accessible, no-limit betting exchange';
const MARKETS_LIST_DESCRIPTION = 'Bet and trade on user-created markets, from weather to crypto to finance. No limits on the amount you can bet or what you can bet on. Lowest fees and the best odds.';

export const MARKETS_LIST_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: MARKETS_LIST_TITLE,
  ogTitle: MARKETS_LIST_TITLE,
  twitterTitle: MARKETS_LIST_TITLE,
  description: MARKETS_LIST_DESCRIPTION,
  ogDescription: MARKETS_LIST_DESCRIPTION,
  twitterDescription: MARKETS_LIST_DESCRIPTION,
  canonicalUrl: '',
};

const PORTFOLIO_TITLE = 'Portfolio';
const PORTFOLIO_DESCRIPTION = 'In your portfolio you can check your transactions, orders, liquidity and more.';

export const PORTFOLIO_HEAD_TAGS = {
  ...COMMON_HEAD_TAGS,
  title: PORTFOLIO_TITLE,
  ogTitle: PORTFOLIO_TITLE,
  twitterTitle: PORTFOLIO_TITLE,
  description: PORTFOLIO_DESCRIPTION,
  ogDescription: PORTFOLIO_DESCRIPTION,
  twitterDescription: PORTFOLIO_DESCRIPTION,
  canonicalUrl: '',
};
