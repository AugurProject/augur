import React from 'react';
import Link from '../../link/components/link';
import classnames from 'classnames';
import { CREATE_MARKET, BUY, SELL, BID, ASK, SHORT_SELL, SHORT_ASK, COMMIT_REPORT, REVEAL_REPORT, GENERATE_ORDER_BOOK, CANCEL_ORDER, SELL_COMPLETE_SETS } from '../../transactions/constants/types';
import { LOGIN, FUND_ACCOUNT } from '../../auth/constants/auth-types';
import { SCALAR } from '../../markets/constants/market-types';
import ValueDenomination from '../../common/components/value-denomination';
import ValueTimestamp from '../../common/components/value-timestamp';

function liveDangerously(thisBetterBeSanitized) { return { __html: thisBetterBeSanitized }; }

const Transaction = (p) => {
	const nodes = {};

	const marketDescription = () => {
		const description = () => <span className="market-description" title={p.data.description || p.data.marketDescription}>{p.data.description ? p.data.description.substring(0, 100) + (p.data.description.length > 100 && '...' || '') : p.data.marketDescription.substring(0, 100) + (p.data.marketDescription.length > 100 && '...' || '')}</span>;

		if ((p.data.description || p.data.marketDescription) && p.data.marketLink) {
			return (
				<Link onClick={p.data.marketLink.onClick}>
					{description()}
				</Link>
			);
		}

		return <span>{description()}</span>;
	};

	switch (p.type) {
	case BUY:
	case BID:
	case SELL:
	case ASK:
	case SHORT_SELL:
	case SHORT_ASK:
		switch (p.type) {
		case BUY:
			nodes.action = 'BUY';
			break;
		case BID:
			nodes.action = 'BID';
			break;
		case SELL:
			nodes.action = 'SELL';
			break;
		case ASK:
			nodes.action = 'ASK';
			break;
		case SHORT_SELL:
			nodes.action = 'SHORT SELL';
			break;
		case SHORT_ASK:
			nodes.action = 'SHORT ASK';
			break;
		default:
			break;
		}

		nodes.description = (
			<span className="description">
				<span className="action">{nodes.action}</span>
				<ValueDenomination className="shares" {...p.data.numShares} />
				{p.data.marketType !== SCALAR &&
					<span>
						<span className="of">of</span> <span className="outcome-name">{p.data.outcomeName && p.data.outcomeName.toString().substring(0, 35) + (p.data.outcomeName.toString().length > 35 && '...' || '')}</span>
					</span>
				}
				<span className="at">@</span>
				<ValueDenomination className="noFeePrice" {...p.data.noFeePrice} postfix="(average)" />
				<br className="hide-in-tx-display" />
				<ValueDenomination className="avgPrice" {...p.data.avgPrice} prefix="including trading fees:" postfix="/ share" />
				<br />
				{marketDescription()}
				<br className="hide-in-trade-summary-display" />
				{p.timestamp &&
					<ValueTimestamp className="property-value" {...p.timestamp} />
				}
			</span>
		);

		break;

	case SELL_COMPLETE_SETS:
		nodes.action = 'AUTOMATIC SELL';
		nodes.description = (
			<span className="description">
				<span className="action">{nodes.action}</span>
				<ValueDenomination className="shares" {...p.data.numShares} postfix="of each outcome" />
				<br />
				{marketDescription()}
				<br />
				{p.timestamp &&
					<ValueTimestamp className="property-value" {...p.timestamp} />
				}
			</span>
		);
		break;

	case LOGIN:
		nodes.description = (
			<span className="description">
				Login
			</span>
		);
		break;
	case FUND_ACCOUNT:
		nodes.description = (
			<span className="description">
				Load free beta ether and rep
			</span>
		);
		break;
	case CREATE_MARKET:
		nodes.description = (
			<span className="description">
				<span>Make</span>
				<strong>{p.data.type}</strong>
				<span>market</span>
				<br />
				{marketDescription()}
				<br />
				{p.timestamp &&
					<ValueTimestamp className="property-value" {...p.timestamp} />
				}
			</span>
		);
		break;

	case COMMIT_REPORT:
	case REVEAL_REPORT:
		switch (p.type) {
		case REVEAL_REPORT:
			nodes.action = 'Reveal report';
			break;
		case COMMIT_REPORT:
			nodes.action = 'Commit report';
			break;
		default:
			break;
		}
		if (p.data.isScalar || p.data.market.type === SCALAR) {
			nodes.description = (
				<span className="description">
					<span className="action">{nodes.action}</span>
					<strong>{p.data.market.reportedOutcome || ''}</strong>
					{!!p.data.isUnethical &&
						<strong className="unethical"> and Unethical</strong>
					}
					<br />
					{marketDescription()}
					<br />
					{p.timestamp &&
						<ValueTimestamp className="property-value" {...p.timestamp} />
					}
				</span>
			);
		} else {
			nodes.description = (
				<span className="description">
					<span className="action">{nodes.action}</span>
					<strong>{p.data.outcome.name && p.data.outcome.name.substring(0, 35) + (p.data.outcome.name.length > 35 && '...' || '')}</strong>
					{!!p.data.isUnethical &&
						<strong className="unethical"> and Unethical</strong>
					}
					<br />
					{marketDescription()}
					<br />
					{p.timestamp &&
						<ValueTimestamp className="property-value" {...p.timestamp} />
					}
				</span>
			);
		}
		break;

	case GENERATE_ORDER_BOOK:
		nodes.action = 'Generate order book';
		nodes.description = (
			<span className="description">
				<span className="action">{nodes.action}</span>
				<br />
				{marketDescription()}
				<br />
				{p.timestamp &&
					<ValueTimestamp className="property-value" {...p.timestamp} />
				}
			</span>
		);
		break;
	case CANCEL_ORDER: {
		nodes.description = (
			<span className="description">
				<span className="action">Cancel {p.data.order.type} order</span>
				<span className="at">for</span>
				<ValueDenomination className="shares" {...p.data.order.shares} />
				<span className="of">of</span>
				<span className="outcome-name">{p.data.outcome.name && p.data.outcome.name.substring(0, 35) + (p.data.outcome.name.length > 35 && '...' || '')}</span>
				<br />
				{marketDescription()}
				<br />
				{p.timestamp &&
					<ValueTimestamp className="property-value" {...p.timestamp} />
				}
			</span>

		);
		break;
	}
	default:
		nodes.description = (<span className="description">{p.type}</span>);
		break;
	}

	return (
		<article className={classnames('transaction-item', p.className, p.status)}>
			{p.index &&
				<span className="index">{`${p.index}.`}</span>
			}

			{nodes.description}

			<span className="value-changes">
				{!!p.data && !!p.data.tradingFees && p.data.tradingFees.value !== null && p.data.tradingFees.value !== undefined &&
					<ValueDenomination className="value-change tradingFees" {...p.data.tradingFees} prefix="trading fees:" />
				}
				<span className="spacer">&nbsp;</span>
				{!!p.data && !!p.data.feePercent && p.data.feePercent.value !== null && p.data.feePercent !== undefined &&
					<ValueDenomination className="value-change feePercent" {...p.data.feePercent} prefix="[" postfix="]" />
				}
				<br />
				{!!p.data && !!p.data.gasFees && !!p.data.gasFees.value &&
					<ValueDenomination className="value-change gasFees" {...p.data.gasFees} prefix="estimated gas cost:" />
				}
				{!!p.ether && !!p.ether.value &&
					<ValueDenomination className="value-change ether" {...p.ether} prefix="total:" />
				}
			</span>

			{p.status && p.hash ?
				<Link href={`https://morden.ether.camp/transaction/${p.hash}`} target="_blank">
					<div className="status-and-message">
						<span className="message" dangerouslySetInnerHTML={liveDangerously(p.message)} />
						<br />
						{p.tradingFees &&
							<span>
								<ValueDenomination
									className="tradingFees-message"
									{...p.data.tradingFees}
									prefix="trading fees:"
								/>
								<br />
							</span>
						}
						{p.freeze &&
							<span className="freeze-message">
								{p.freeze.noFeeCost &&
									<ValueDenomination
										className="freeze-noFeeCost-message"
										{...p.freeze.noFeeCost}
										prefix={p.freeze.verb}
										postfix="+"
									/>
								}
								<ValueDenomination
									className="freeze-tradingFees-message"
									{...p.freeze.tradingFees}
									prefix={!p.freeze.noFeeCost && p.freeze.verb}
									postfix="in potential trading fees"
								/>
								<br />
							</span>
						}
						{p.totalCost &&
							<span>
								<ValueDenomination
									className="totalCost-message"
									{...p.totalCost}
									prefix="total cost:"
								/>
								<br />
							</span>
						}
						{p.totalReturn &&
							<span>
								<ValueDenomination
									className="totalReturn-message"
									{...p.totalReturn}
									prefix="total return:"
								/>
								<br />
							</span>
						}
						{p.gasFees &&
							<span>
								<ValueDenomination
									className="gasFees-message"
									{...p.gasFees}
									prefix="gas cost:"
								/>
								<br />
							</span>
						}
						<span className="status">{p.status}</span>
					</div>
				</Link> :
				<div className="status-and-message">
					<span className="message" dangerouslySetInnerHTML={liveDangerously(p.message)} />
					<br />
					<span className="status">{p.status}</span>
				</div>
			}
		</article>
	);
};

Transaction.propTypes = {
	className: React.PropTypes.string,
	index: React.PropTypes.number,
	type: React.PropTypes.string,
	status: React.PropTypes.string,
	data: React.PropTypes.object,
	shares: React.PropTypes.object,
	ether: React.PropTypes.object,
	gas: React.PropTypes.object,
	hash: React.PropTypes.string,
	freeze: React.PropTypes.object,
	gasFees: React.PropTypes.object,
	tradingFees: React.PropTypes.object,
	totalCost: React.PropTypes.object,
	totalReturn: React.PropTypes.object,
	timestamp: React.PropTypes.object
};

export default Transaction;
