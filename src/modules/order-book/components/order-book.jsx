import React from 'react';

import OrderBookHeader from 'modules/order-book/components/order-book-header';
import OrderBookRows from 'modules/order-book/components/order-book-rows';
import EmDash from 'modules/common/components/em-dash';

import { SCALAR } from 'modules/markets/constants/market-types';

// NOTE --
// Bids + Asks are rendered into individual row components -- flexbox is utilized for side-by-side layout
const OrderBook = p => (
	<article className="order-book">
		{p.marketType !== SCALAR ?
			<h3>Order Book <EmDash /> {p.outcome.name}</h3> :
			<h3>Order Book</h3>
		}
		<OrderBookHeader />
		<div className="market-content-scrollable" >
			<OrderBookRows
				id={p.outcome.id}
				trade={p.outcome.trade}
				bids={p.outcome.orderBook.bids}
				asks={p.outcome.orderBook.asks}
				selectedTradeSide={p.selectedTradeSide}
				updateTradeFromSelectedOrder={p.updateTradeFromSelectedOrder}
				selectedShareDenomination={p.selectedShareDenomination}
			/>
		</div>
	</article>
);

export default OrderBook;
