import React from 'react';
import classNames from 'classnames';

import Link from 'modules/link/components/link';
import ValueDenomination from 'modules/common/components/value-denomination';
import OutcomeTrade from 'modules/outcomes/components/outcome-trade';

import { BID, ASK } from 'modules/transactions/constants/types';
import { PRICE, SHARE } from 'modules/order-book/constants/order-book-value-types';
import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';
import setShareDenomination from 'utils/set-share-denomination';

const Outcome = (p) => {
	const outcomeName = getValue(p, 'outcome.name');

	const topBidShares = setShareDenomination(getValue(p, 'outcome.topBid.shares.formatted'), p.selectedShareDenomination);
	const topAskShares = setShareDenomination(getValue(p, 'outcome.topAsk.shares.formatted'), p.selectedShareDenomination);

	const topBidPrice = getValue(p, 'outcome.topBid.price.formatted');
	const topAskPrice = getValue(p, 'outcome.topAsk.price.formatted');

	const lastPrice = getValue(p, 'outcome.lastPrice.formatted');
	const lastPricePercent = getValue(p, 'outcome.lastPricePercent.rounded');

	return (
		<article className={classNames('outcome', { selected: p.selectedOutcome.id === p.outcome.id })}>
			<Link
				className={classNames('outcome-row-full', { selected: p.selectedOutcome.id === p.outcome.id })}
				onClick={() => { p.updateSelectedOutcome(p.outcome); }}
			>
				{p.marketType === SCALAR ?
					<ValueDenomination formatted={lastPricePercent} /> :
					<span className="outcome">{outcomeName}</span>
				}
				<button
					className="unstyled"
					onClick={() => {
						p.updateTradeFromSelectedOrder(p.outcome.id, 0, BID, SHARE);
					}}
				>
					<ValueDenomination formatted={topBidShares} />
				</button>
				<button
					className="unstyled"
					onClick={() => {
						p.updateTradeFromSelectedOrder(p.outcome.id, 0, BID, PRICE);
					}}
				>
					<ValueDenomination className="emphasized" formatted={topBidPrice} />
				</button>
				<button
					className="unstyled"
					onClick={() => {
						p.updateTradeFromSelectedOrder(p.outcome.id, 0, ASK, PRICE);
					}}
				>
					<ValueDenomination className="emphasized" formatted={topAskPrice} />
				</button>
				<button
					className="unstyled"
					onClick={() => {
						p.updateTradeFromSelectedOrder(p.outcome.id, 0, ASK, SHARE);
					}}
				>
					<ValueDenomination formatted={topAskShares} />
				</button>
				<ValueDenomination formatted={lastPrice} />
			</Link>
			<Link
				className={classNames('outcome-row-condensed', { selected: p.selectedOutcome.id === p.outcome.id })}
				onClick={() => { p.updateSelectedOutcome(p.outcome); }}
			>
				{p.marketType === SCALAR ?
					<ValueDenomination formatted={lastPricePercent} /> :
					<span className="outcome-summary">
						<span className="outcome-name">{outcomeName}</span>
						<span>Last Price: <ValueDenomination formatted={lastPrice} /></span>
					</span>
				}
				<span className="outcome-best-orders outcome-best-bid">
					<button
						className="unstyled"
						onClick={() => {
							p.updateTradeFromSelectedOrder(p.outcome.id, 0, BID, SHARE);
						}}
					>
						<span className="outcome-best-container">
							<ValueDenomination className="emphasized" formatted={topBidPrice} />
							<ValueDenomination formatted={topBidShares} />
						</span>
					</button>
				</span>
				<span className="outcome-best-orders outcome-best-ask">
					<button
						className="unstyled"
						onClick={() => {
							p.updateTradeFromSelectedOrder(p.outcome.id, 0, ASK, SHARE);
						}}
					>
						<span className="outcome-best-container">
							<ValueDenomination className="emphasized" formatted={topAskPrice} />
							<ValueDenomination formatted={topAskShares} />
						</span>
					</button>
				</span>
			</Link>
			<OutcomeTrade
				marketType={p.marketType}
				selectedOutcome={p.selectedOutcome}
				tradeSummary={p.tradeSummary}
				submitTrade={p.submitTrade}
				selectedTradeSide={p.selectedTradeSide}
				selectedShareDenomination={p.selectedShareDenomination}
				updateSelectedTradeSide={p.updateSelectedTradeSide}
				outcomeTradeNavItems={p.outcomeTradeNavItems}
			/>
		</article>
	);
};

export default Outcome;
