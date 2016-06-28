import React, { PropTypes } from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../common/components/value-denomination';
import Input from '../../common/components/input';
import Dropdown from '../../common/components/dropdown';
import Clickable from '../../common/components/clickable';

const TradePanelItems = (p) => {
	const itemRows = (outcomes, sideOptions) => {
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
	);
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