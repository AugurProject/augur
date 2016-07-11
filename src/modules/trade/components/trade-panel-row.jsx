import React from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../../modules/common/components/value-denomination';
import Input from '../../../modules/common/components/input';
import Dropdown from '../../../modules/common/components/dropdown';
import Clickable from '../../../modules/common/components/clickable';
import { OUTCOME, ORDER } from '../../../modules/trade/constants/row-types';

const TradePanelRow = (p) => {
	switch(p.type){
	default:
	case OUTCOME:
		return (
			<tr
				className={classnames('trade-panel-row', 'clickable-row')}
				onClick={event => {
					event.stopPropagation();

					p.updateSelectedOutcome(p.outcome.id);
				}}
			>
				<th className="outcome-name">
					{p.outcome.name}
				</th>
				<td className="last-price">
					<ValueDenomination {...p.outcome.lastPrice} />
				</td>
				<td className="bid">
					{!!p.outcome.topBid &&
					<div>
						<Clickable onClick={() => { p.outcome.trade.updateTradeOrder(p.outcome.id, p.outcome.topBid.shares.value, p.outcome.topBid.price.value, p.constants.ASK); }} >
							<ValueDenomination className="top-bid" {...p.outcome.topBid.shares} />
						</Clickable>
						<span className="shares-at">@</span>
						<Clickable onClick={() => { p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, p.outcome.topBid.price.value); }}>
							<ValueDenomination className="top-bid" {...p.outcome.topBid.price} />
						</Clickable>
					</div>
					}
				</td>
				<td className="ask">
					{!!p.outcome.topAsk &&
					<div>
						<Clickable onClick={() => { p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, p.outcome.topAsk.price.value); }}>
							<ValueDenomination className="top-ask" {...p.outcome.topAsk.price} />
						</Clickable>
						<span className="shares-at">@</span>
						<Clickable onClick={() => { p.outcome.trade.updateTradeOrder(p.outcome.id, p.outcome.topAsk.shares.value, p.outcome.topAsk.price.value, p.constants.BID); }} >
							<ValueDenomination className="top-ask" {...p.outcome.topAsk.shares} />
						</Clickable>
					</div>
					}
				</td>

				<td>
					<Dropdown
						selected={p.sideOptions.find(opt => opt.value === p.outcome.trade.side)}
						options={p.sideOptions}
						onChange={(selectedOption) => { p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, undefined, selectedOption); }}
					/>
				</td>
				<td>
					<Input
						className="num-shares"
						type="text"
						value={p.outcome.trade.numShares}
						isClearable={false}
						onChange={(value) => p.outcome.trade.updateTradeOrder(p.outcome.id, parseFloat(value) || 0, undefined)}
					/>
				</td>
				<td>
					<Input
						className="limit-price"
						type="text"
						value={p.outcome.trade.limitPrice}
						isClearable={false}
						onChange={(value) => p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, parseFloat(value) || 0)}
					/>
				</td>
				<td className="fee-to-pay" >
					<ValueDenomination {...p.outcome.trade.tradeSummary.feeToPay} />
				</td>
				<td className="total-cost" >
					<ValueDenomination {...p.outcome.trade.tradeSummary.totalEther} />
				</td>
			</tr>
		);
	case ORDER:
		return (
			<tr className={classnames('trade-panel-row', { displayNone: !(p.selectedOutcomeID === p.outcome.id) })} >
				<td colSpan="2"></td>
				<td>
					{!!p.outcome.orderBook.bids[p.item] &&
					<div className="order-book-data bid">
						<Clickable
							onClick={event => {
									event.stopPropagation();

									p.outcome.trade.updateTradeOrder(p.outcome.id, p.outcome.orderBook.bids[p.item].shares.value, p.outcome.orderBook.bids[p.item].price.value, p.constants.ASK);
								}}
						>
							<ValueDenomination className="shares" {...p.outcome.orderBook.bids[p.item].shares} />
						</Clickable>
						<span className="shares-at">@</span>
						<Clickable
							onClick={event => {
									event.stopPropagation();

									p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, p.outcome.orderBook.bids[p.item].price.value);
								}}
						>
							<ValueDenomination className="price" {...p.outcome.orderBook.bids[p.item].price} />
						</Clickable>
					</div>
					}
				</td>
				<td>
					{!!p.outcome.orderBook.asks[p.item] &&
					<div className="order-book-data ask" >
						<Clickable
							onClick={event => {
									event.stopPropagation();

									p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, p.outcome.orderBook.asks[p.item].price.value);
								}}
						>
							<ValueDenomination className="price" {...p.outcome.orderBook.asks[p.item].price} />
						</Clickable>
						<span className="shares-at">@</span>
						<Clickable
							onClick={event => {
									event.stopPropagation();

									p.outcome.trade.updateTradeOrder(p.outcome.id, p.outcome.orderBook.asks[p.item].shares.value, p.outcome.orderBook.asks[p.item].price.value, p.constants.BID);
								}}
						>
							<ValueDenomination className="shares" {...p.outcome.orderBook.asks[p.item].shares} />
							<ValueDenomination className="shares" {...p.outcome.orderBook.asks[p.item].shares} />
						</Clickable>
					</div>
					}
				</td>
				<td colSpan="5"></td>
			</tr>
		);
	}


	// const itemRows = (p.outcomes, p.sideOptions) => {
	// 	const tableRows = [];
	//
	// 	p.outcomes.map((p.outcome) => {
	// 		const orderBookMaxRows = p.outcome.orderBook.bids.length > p.outcome.orderBook.asks.length ? p.outcome.orderBook.bids.length : p.outcome.orderBook.asks.length;
	//
	// 		tableRows.push(
	// 			<tr
	// 				key={`${p.outcome.name}`}
	// 				className={classnames('trade-panel-row', 'clickable-row')}
	// 				onClick={event => {
	// 					event.stopPropagation();
	//
	// 					p.updateSelected.outcome(p.outcome.id);
	// 				}}
	// 			>
	// 				<th className="p.outcome-name">
	// 					{p.outcome.name}
	// 				</th>
	// 				<td className="last-price">
	// 					<ValueDenomination {...p.outcome.lastPrice} />
	// 				</td>
	// 				<td className="bid">
	// 					{!!p.outcome.topBid &&
	// 					<div>
	// 						<Clickable onClick={() => { p.outcome.trade.updateTradeOrder(p.outcome.id, p.outcome.topBid.shares.value, p.outcome.topBid.price.value, p.constants.ASK); }} >
	// 							<ValueDenomination className="top-bid" {...p.outcome.topBid.shares} />
	// 						</Clickable>
	// 						<span className="shares-at">@</span>
	// 						<Clickable onClick={() => { p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, p.outcome.topBid.price.value); }}>
	// 							<ValueDenomination className="top-bid" {...p.outcome.topBid.price} />
	// 						</Clickable>
	// 					</div>
	// 					}
	// 				</td>
	// 				<td className="ask">
	// 					{!!p.outcome.topAsk &&
	// 					<div>
	// 						<Clickable onClick={() => { p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, p.outcome.topAsk.price.value); }}>
	// 							<ValueDenomination className="top-ask" {...p.outcome.topAsk.price} />
	// 						</Clickable>
	// 						<span className="shares-at">@</span>
	// 						<Clickable onClick={() => { p.outcome.trade.updateTradeOrder(p.outcome.id, p.outcome.topAsk.shares.value, p.outcome.topAsk.price.value, p.constants.BID); }} >
	// 							<ValueDenomination className="top-ask" {...p.outcome.topAsk.shares} />
	// 						</Clickable>
	// 					</div>
	// 					}
	// 				</td>
	//
	// 				<td>
	// 					<Dropdown
	// 						selected={p.sideOptions.find(opt => opt.value === p.outcome.trade.side)}
	// 						options={p.sideOptions}
	// 						onChange={(selectedOption) => { p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, undefined, selectedOption); }}
	// 					/>
	// 				</td>
	// 				<td>
	// 					<Input
	// 						className="num-shares"
	// 						type="text"
	// 						value={p.outcome.trade.numShares}
	// 						isClearable={false}
	// 						onChange={(value) => p.outcome.trade.updateTradeOrder(p.outcome.id, parseFloat(value) || 0, undefined)}
	// 					/>
	// 				</td>
	// 				<td>
	// 					<Input
	// 						className="limit-price"
	// 						type="text"
	// 						value={p.outcome.trade.limitPrice}
	// 						isClearable={false}
	// 						onChange={(value) => p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, parseFloat(value) || 0)}
	// 					/>
	// 				</td>
	// 				<td className="fee-to-pay" >
	// 					<ValueDenomination {...p.outcome.trade.tradeSummary.feeToPay} />
	// 				</td>
	// 				<td className="total-cost" >
	// 					<ValueDenomination {...p.outcome.trade.tradeSummary.totalEther} />
	// 				</td>
	// 			</tr>
	// 		);
	//
	// 		orderBookMaxRows.map((cV, i) => {
	// 			if (i !== 0) {
	// 				tableRows.push(
	// 					<tr
	// 						key={`${p.outcome.name}-order-book-${i}`}
	// 						className={classnames('trade-panel-row', { displayNone: !(p.selectedp.outcomeID === p.outcome.id) })}
	// 					>
	// 						<td colSpan="2"></td>
	// 						<td>
	// 							{!!p.outcome.orderBook.bids[i] &&
	// 							<div className="order-book-data bid">
	// 								<Clickable
	// 									onClick={event => {
	// 											event.stopPropagation();
	//
	// 											p.outcome.trade.updateTradeOrder(p.outcome.id, p.outcome.orderBook.bids[i].shares.value, p.outcome.orderBook.bids[i].price.value, p.constants.ASK);
	// 										}}
	// 								>
	// 									<ValueDenomination className="shares" {...p.outcome.orderBook.bids[i].shares} />
	// 								</Clickable>
	// 								<span className="shares-at">@</span>
	// 								<Clickable
	// 									onClick={event => {
	// 											event.stopPropagation();
	//
	// 											p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, p.outcome.orderBook.bids[i].price.value);
	// 										}}
	// 								>
	// 									<ValueDenomination className="price" {...p.outcome.orderBook.bids[i].price} />
	// 								</Clickable>
	// 							</div>
	// 							}
	// 						</td>
	// 						<td>
	// 							{!!p.outcome.orderBook.asks[i] &&
	// 							<div className="order-book-data ask" >
	// 								<Clickable
	// 									onClick={event => {
	// 											event.stopPropagation();
	//
	// 											p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, p.outcome.orderBook.asks[i].price.value);
	// 										}}
	// 								>
	// 									<ValueDenomination className="price" {...p.outcome.orderBook.asks[i].price} />
	// 								</Clickable>
	// 								<span className="shares-at">@</span>
	// 								<Clickable
	// 									onClick={event => {
	// 											event.stopPropagation();
	//
	// 											p.outcome.trade.updateTradeOrder(p.outcome.id, p.outcome.orderBook.asks[i].shares.value, p.outcome.orderBook.asks[i].price.value, p.constants.BID);
	// 										}}
	// 								>
	// 									<ValueDenomination className="shares" {...p.outcome.orderBook.asks[i].shares} />
	// 								</Clickable>
	// 							</div>
	// 							}
	// 						</td>
	// 						<td colSpan="5"></td>
	// 					</tr>
	// 				);
	// 			}
	//
	// 			return null;
	// 		});
	//
	// 		return null;
	// 	});
	//
	// 	return tableRows;
	// };
};

TradePanelRow.propTypes = {
	outcomes: React.PropTypes.array,
	sideOptions: React.PropTypes.array,
	selectedOutcomeID: React.PropTypes.string,
	updatedSelectedOutcome: React.PropTypes.func,
	type: React.PropTypes.string,
	item: React.PropTypes.number
};

export default TradePanelRow;
