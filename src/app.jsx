import React from 'react';
import { render } from 'react-dom';

import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from './modules/site/constants/pages';
import { REGISTER, LOGIN, LOGOUT } from './modules/auth/constants/auth-types';

import MarketsPage from './modules/markets/components/markets-page';
import MarketPage from './modules/market/components/market-page';
import CreateMarketPage from './modules/create-market/components/create-market-page';
import AuthPage from './modules/auth/components/auth-page';
import PositionsPage from './modules/positions/components/positions-page';
import TransactionsPage from './modules/transactions/components/transactions-page';

export default function(appElement, selectors) {
    var p = selectors,
    	node;

    p.siteHeader = {
		activePage: p.activePage,
		loginAccount: p.loginAccount,
		positionsSummary: p.positionsSummary,
		transactionsTotals: p.transactionsTotals,
		isTransactionsWorking: p.isTransactionsWorking,

		marketsLink: p.links && p.links.marketsLink || undefined,
		positionsLink: p.links && p.links.positionsLink || undefined,
		transactionsLink: p.links && p.links.transactionsLink || undefined,
		authLink: p.links && p.links.authLink || undefined
    };

 	switch(p.activePage) {
    	case REGISTER:
        case LOGIN:
        case LOGOUT:
    		node = <AuthPage
    					siteHeader={ p.siteHeader }
    					authForm={ p.authForm } />;
    		break;

    	case MAKE:
    		node = <CreateMarketPage
    					siteHeader={ p.siteHeader }
    					createMarketForm={ p.createMarketForm } />;
    		break;

    	case POSITIONS:
    		node = <PositionsPage
    					siteHeader={ p.siteHeader }
    					positionsSummary={ p.marketsTotals.positionsSummary }
    					markets={ p.markets }
    					/>;
    		break;

    	case TRANSACTIONS:
    		node = <TransactionsPage
    					siteHeader={ p.siteHeader }
    					transactions={ p.transactions }
    					transactionsTotals={ p.transactionsTotals } />;
    		break;

    	case M:
    		node = <MarketPage
    		            siteHeader={ p.siteHeader }
    		            market={ p.market }
    		            numPendingReports={ p.marketsTotals.numPendingReports } />;
    		break;

    	default:
    		node = <MarketsPage
    					siteHeader={ p.siteHeader }
    					createMarketLink={ (p.links || {}).createMarketLink }
    					onChangeKeywords={ p.keywordsChangeHandler }

    					markets={ p.markets }
    					favoriteMarkets={ p.favoriteMarkets }
    					marketsHeader={ p.marketsHeader }
    					filtersProps={ p.filtersProps }

    					selectedSort={ p.selectedSort }
    					sortOptions={ p.sortOptions }
    					onChangeSort={ p.onChangeSort }
    					/>;
    		break;
    }

	render(
		node,
		appElement
	);
}

