import { ACCOUNT, MARKETS, MAKE, TRANSACTIONS, M, MY_POSITIONS, MY_MARKETS, MY_REPORTS, LOGIN_MESSAGE } from '../modules/site/constants/pages';
import { LOGIN } from '../modules/auth/constants/auth-types';

export default {
	authLink: { href: '?page=register', onClick: (url) => require('../selectors').update({ activePage: LOGIN, url }) },
	marketsLink: { href: '/', onClick: (url) => require('../selectors').update({ activePage: MARKETS, url }) },
	transactionsLink: { href: '?page=transactions', onClick: (url) => require('../selectors').update({ activePage: TRANSACTIONS, url }) },
	marketLink: { href: '?page=m', onClick: (url) => require('../selectors').update({ activePage: M, url }) },
	previousLink: { href: '/', onClick: (url) => require('../selectors').update({ activePage: MARKETS, url }) },
	createMarketLink: { href: '?page=create', onClick: (url) => require('../selectors').update({ activePage: MAKE, url }) },
	accountLink: { href: '?page=account', onClick: (url) => require('../selectors').update({ activePage: ACCOUNT, url }) },
	myPositionsLink: { href: '?page=my-positions', onClick: (url) => require('../selectors').update({ activePage: MY_POSITIONS, url }) },
	myMarketsLink: { href: '?page=my-markets', onClick: (url) => require('../selectors').update({ activePage: MY_MARKETS, url }) },
	myReportsLink: { href: '?page=my-reports', onClick: (url) => require('../selectors').update({ activePage: MY_REPORTS, url }) },
	loginMessageLink: { href: '?page=login-message', onClick: (url) => require('../selectors').update({ activePage: LOGIN_MESSAGE, url }) }
};
