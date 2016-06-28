import React, { PropTypes } from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../common/components/value-denomination';
import Input from '../../common/components/input';
import Dropdown from '../../common/components/dropdown';
import Clickable from '../../common/components/clickable';
import Collapse from '../../common/components/collapse';
import OrderBook from '../../bids-asks/components/order-book';

const TradePanelItems = (p) => {
	console.log('p -- ', p);
	console.log('selectedOutcome -- ', p.selectedOutcomeID);

	// const isOutcomeActive = p.selectedOutcomeID === p.id;

	// console.log('trade panel item, p -- ', p);

	const itemRows = (outcomes, sideOptions) => {
		console.log('outcomes -- ', outcomes, sideOptions);

		let tableRows = [];

		outcomes.map((outcome) => {
			const orderBookMaxRows = outcome.orderBook.bids.length > outcome.orderBook.asks.length ? new Array(outcome.orderBook.bids.length) : new Array(outcome.orderBook.asks.length);
			orderBookMaxRows.fill('');

			tableRows.push(
				<tr
					key={`${outcome.name}`}
					className="trade-panel-row"
					onClick={event => {
						event.stopPropagation();

						p.updateSelectedOutcome(outcome.id);
					}}
				>
					<th className="outcome-name">{outcome.name}</th>
					<td className="last-price" {...outcome.lastPrice} />
					<td>
						<Clickable onClick={() => { outcome.trade.updateTradeOrder(outcome.id, undefined, outcome.topBid.value); }}>
							<ValueDenomination className="top-bid" {...outcome.topBid.shares} /> @ <ValueDenomination className="top-bid" {...outcome.topBid.price} />
						</Clickable>
					</td>
					<td>
						<Clickable onClick={() => { outcome.trade.updateTradeOrder(p.id, undefined, outcome.topAsk.value); }}>
							<ValueDenomination className="top-ask" {...outcome.topAsk.shares} /> @ <ValueDenomination className="top-ask" {...outcome.topAsk.price} />
						</Clickable>
					</td>

					<td>
						<Dropdown
							selected={sideOptions.find(opt => opt.value === outcome.trade.side)}
							options={sideOptions}
							onChange={(selectedOption) => { outcome.trade.updateTradeOrder(outcome.id, undefined, undefined, selectedOption); }}
						/>
					</td>
					<td>
						<Input
							className="num-shares"
							type="text"
							value={outcome.trade.numShares}
							isClearable={false}
							onChange={(value) => outcome.trade.updateTradeOrder(outcome.id, parseFloat(value) || 0, undefined)}
						/>
					</td>
					<td>
						<Input
							className="limit-price"
							type="text"
							value={outcome.trade.limitPrice}
							isClearable={false}
							onChange={(value) => outcome.trade.updateTradeOrder(outcome.id, undefined, parseFloat(value) || 0)}
						/>
					</td>
					<td>
						<ValueDenomination className="fee-to-pay" {...outcome.trade.feeToPay} />
					</td>
					<td>
						<ValueDenomination className="total-cost" {...outcome.trade.profitLoss} />
					</td>
				</tr>
			);

			orderBookMaxRows.map((cV, i) => {
				if(i != 0){
					tableRows.push(
						<tr
							key={`${outcome.name}-order-book-${i}`}
							className={classnames('trade-panel-row', {'displayNone': p.selectedOutcomeID === outcome.id ? false : true})}
						>
							<td></td>
							<td></td>
							<td>
								{ outcome.orderBook.bids[i] &&
									<div className='order-book-data'>
										<Clickable onClick={event => {
											event.stopPropagation();

											outcome.trade.updateTradeOrder(outcome.id, outcome.orderBook.bids[i].shares.value, outcome.orderBook.bids[i].price.value, 'ask');
										}} >
											<ValueDenomination className="shares" {...outcome.orderBook.bids[i].shares} />
										</Clickable> @ <Clickable onClick={event => {
											event.stopPropagation();

											outcome.trade.updateTradeOrder(outcome.id, 0, outcome.orderBook.bids[i].price.value);
										}}>
											<ValueDenomination className="price" {...outcome.orderBook.bids[i].price} />
										</Clickable>
									</div>
								}
							</td>
							<td>
								{ outcome.orderBook.asks[i] &&
									<div className='order-book-data'>
										<Clickable onClick={event => {
											event.stopPropagation();

											outcome.trade.updateTradeOrder(outcome.id, outcome.orderBook.asks[i].shares.value, outcome.orderBook.asks[i].price.value, 'bid');
										}} >
											<ValueDenomination className="shares" {...outcome.orderBook.asks[i].shares} />
										</Clickable> @ <Clickable onClick={event => {
											event.stopPropagation();

											outcome.trade.updateTradeOrder(outcome.id, 0, outcome.orderBook.asks[i].price.value);
										}} >
											<ValueDenomination className="price" {...outcome.orderBook.asks[i].price} />
										</Clickable>
									</div>
								}
							</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					)
				}
			});
		});

		console.log('tableRows -- ', tableRows);

		return tableRows;
	};

	return (
		<tbody>
			{itemRows(p.outcomes, p.sideOptions)}
		</tbody>
	)
};

TradePanelItems.propTypes = {
	className: PropTypes.string,
	name: PropTypes.string,
	numShares: PropTypes.number,
	limitPrice: PropTypes.number,
	sideOptions: PropTypes.array,
	lastPrice: PropTypes.object,
	topBid: PropTypes.object,
	topAsk: PropTypes.object,
	feeToPay: PropTypes.object,
	tradeSummary: PropTypes.object,
	sharesOwned: PropTypes.number,
	etherAvailable: PropTypes.number,
	updateTradeOrder: PropTypes.func,
	outcomes: PropTypes.array
};

export default TradePanelItems;

// {p.outcomes && p.outcomes.map(outcome => (
//
// )}

// <div className={classnames('trade-panel-item', p.className, { active: isOutcomeActive })}>
// 	<Clickable onClick={event => {
// 				event.stopPropagation();
//
// 				p.updateSelectedOutcome(p.id);
// 			}}>

// </Clickable>
// <div>
// 	<Collapse isOpen={isOutcomeActive}>
// 		<OrderBook
// 			key={`order-book-${p.id}`}
// 			outcome={p}
// 			updateTradeOrder={p.trade.updateTradeOrder}
// 			bids={p.orderBook.bids}
// 			asks={p.orderBook.asks}
// 		/>
// 	</Collapse>
// 	</div>
// 	</div>



// <div className="bids">
// 	{p.bids.map((bid, i) => {
// 		if(i != 0){
// 			return (
// 				<article key={bid.price.full} className="bid-ask bid">
// 					<Clickable
// 						onClick={() => { p.updateTradeOrder(p.outcome.id, bid.shares.value, bid.price.value, 'ask'); }}
// 					>
// 						<ValueDenomination className="shares" {...bid.shares} />
// 					</Clickable>
// 					<Clickable onClick={() => { p.updateTradeOrder(p.outcome.id, 0, bid.price.value); }}>
// 						<ValueDenomination className="price" {...bid.price} />
// 					</Clickable>
// 				</article>
// 			)
// 		}
// 	})}
// 	{!p.bids.length &&
// 	<article className="bid-ask ask">
// 		<ValueDenomination className="price" />
// 		<ValueDenomination className="shares" formatted="-" />
// 	</article>
// 	}
// </div>
// <div className="asks">
// 	{p.asks.map((ask, i) => {
// 		if (i != 0) {
// 			return (
// 				<article key={ask.price.full} className="bid-ask ask">
// 					<Clickable onClick={() => { p.updateTradeOrder(p.outcome.id, 0, ask.price.value); }}>
// 						<ValueDenomination className="price" {...ask.price} />
// 					</Clickable>
// 					<Clickable
// 						onClick={() => { p.updateTradeOrder(p.outcome.id, ask.shares.value, ask.price.value, 'bid'); }}
// 					>
// 						<ValueDenomination className="shares" {...ask.shares} />
// 					</Clickable>
// 				</article>
// 			)
// 		}
// 	})}
// {!p.asks.length &&
// <article className="bid-ask ask">
// 	<ValueDenomination className="price" formatted="-" />
// 	<ValueDenomination className="shares" />
// </article>
// }
// </div>