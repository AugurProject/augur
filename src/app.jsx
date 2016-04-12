import React from 'react';

import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from './modules/app/constants/pages';
import { REGISTER, LOGIN, LOGOUT } from './modules/auth/constants/auth-types';

import MarketsPage from './modules/markets/components/markets-page';
import MarketPage from './modules/market/components/market-page';
import CreateMarketPage from './modules/create-market/components/create-market-page';
import AuthPage from './modules/auth/components/auth-page';
import PositionsPage from './modules/positions/components/positions-page';
import TransactionsPage from './modules/transactions/components/transactions-page';

module.exports = function(props) {
    var p = props.selectors;
    switch(p.activePage) {
    	case REGISTER:
        case LOGIN:
        case LOGOUT:
    		return <AuthPage
    					siteHeader={ p.siteHeader }
    					authForm={ p.authForm } />;

    	case MAKE:
    		return <CreateMarketPage
    					siteHeader={ p.siteHeader }
    					createMarketForm={ p.createMarketForm } />;

    	case POSITIONS:
    		return <PositionsPage
    					siteHeader={ p.siteHeader }
    					positions={ p.positions }
    					positionsSummary={ p.positionsSummary } />;

    	case TRANSACTIONS:
    		return <TransactionsPage
    					siteHeader={ p.siteHeader }
    					transactions={ p.transactions }
    					transactionsTotals={ p.transactionsTotals } />;

    	case M:
    		return <MarketPage selectors={ p } />;

    	default:
    		return <MarketsPage
    					siteHeader={ p.siteHeader }
    					createMarketLink={ (p.links || {}).createMarketLink }
    					onChangeKeywords={ p.keywordsChangeHandler }

    					markets={ p.markets }
    					favoriteMarkets={ p.favoriteMarkets }
    					marketsHeader={ p.marketsHeader }
    					filtersProps={ p.filtersProps } />;
    }
};