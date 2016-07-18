import { ACCOUNT, MARKETS, MAKE, POSITIONS, TRANSACTIONS, M, PORTFOLIO, MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../modules/site/constants/pages';
import { LOGIN } from '../modules/auth/constants/auth-types';

export default {
	authLink: { href: '/register', onClick: (url) => require('../selectors').update({ activePage: LOGIN, url }) },
	marketsLink: { href: '/', onClick: (url) => require('../selectors').update({ activePage: MARKETS, url }) },
	positionsLink: { href: '/positions', onClick: (url) => require('../selectors').update({ activePage: POSITIONS, url }) },
	transactionsLink: { href: '/transactions', onClick: (url) => require('../selectors').update({ activePage: TRANSACTIONS, url }) },
	marketLink: { href: '/market', onClick: (url) => require('../selectors').update({ activePage: M, url }) },
	previousLink: { href: '/', onClick: (url) => require('../selectors').update({ activePage: MARKETS, url }) },
	createMarketLink: { href: '/create', onClick: (url) => require('../selectors').update({ activePage: MAKE, url }) },
	accountLink: { href: '/account', onClick: (url) => require('../selectors').update({ activePage: ACCOUNT, url }) },
	portfolioLink: { href: '/portfolio', onClick: (url) => require('../selectors').update({ activePage: PORTFOLIO, url }) },
	myPositionsLink: { href: '/my-positions', onClick: (url) => require('../selectors').update({ activePage: MY_POSITIONS, url }) },
	myMarketsLink: { href: '/my-markets', onClick: (url) => require('../selectors').update({ activePage: MY_MARKETS, url }) },
	myReportsLink: { href: '/my-reports', onClick: (url) => require('../selectors').update({ activePage: MY_REPORTS, url }) }
};
