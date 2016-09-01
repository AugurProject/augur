import React from 'react';
import Link from '../../link/components/link';
import classnames from 'classnames';
import { CREATE_MARKET, BUY, SELL, BID, ASK, SHORT_SELL, SHORT_ASK, COMMIT_REPORT, GENERATE_ORDER_BOOK, CANCEL_ORDER } from '../../transactions/constants/types';
import { LOGIN, FUND_ACCOUNT } from '../../auth/constants/auth-types';
import { SCALAR } from '../../markets/constants/market-types';
import ValueDenomination from '../../common/components/value-denomination';

function liveDangerously(thisBetterBeSanitized) { return { __html: thisBetterBeSanitized }; }

const Transaction = (p) => {
	console.log('Transaction p --', p);

	const nodes = {};

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

		const marketDescription = () => (
			<span className="market-description" title={p.data.marketDescription}>
				{p.data.marketDescription.substring(0, 100) + (p.data.marketDescription.length > 100 && '...' || '')}
			</span>
		);

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
				<ValueDenomination className="avgPrice" {...p.data.avgPrice} />
				<br />
				{p.data.marketLink ?
					<Link onClick={p.data.marketLink.onClick}>
						{marketDescription()}
					</Link>
					:
					<span>
						{marketDescription()}
					</span>
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
				<span className="market-description" title={p.data.description}>{p.data.description.substring(0, 100) + (p.data.description.length > 100 && '...' || '')}</span>
			</span>
		);
		break;
	case COMMIT_REPORT:
		if (p.data.market.type === SCALAR) {
			nodes.description = (
				<span className="description">
					<span>Report</span>
					<strong>{p.data.market.reportedOutcome || ''}</strong>
					{!!p.data.isUnethical &&
						<strong className="unethical"> and Unethical</strong>
					}
					<br />
					<span className="market-description" title={p.data.market.description}>{p.data.market.description.substring(0, 100) + (p.data.market.description.length > 100 && '...' || '')}</span>
				</span>
			);
		} else {
			nodes.description = (
				<span className="description">
					<span>Report</span>
					<strong>{p.data.outcome.name && p.data.outcome.name.substring(0, 35) + (p.data.outcome.name.length > 35 && '...' || '')}</strong>
					{!!p.data.isUnethical &&
						<strong className="unethical"> and Unethical</strong>
					}
					<br />
					<span className="market-description" title={p.data.market.description}>{p.data.market.description.substring(0, 100) + (p.data.market.description.length > 100 && '...' || '')}</span>
				</span>
			);
		}
		break;
	case GENERATE_ORDER_BOOK:
		nodes.description = (
			<span className="description">
				<span>Generate Order Book</span>
				<br />
				<span className="market-description" title={p.data.description}>{p.data.description.substring(0, 100) + (p.data.description.length > 100 && '...' || '')}</span>
			</span>
		);
		break;
	case CANCEL_ORDER: {
		nodes.description = (
			<span className="description">
				<span className="action">Cancel {p.data.order.type} order</span>
				<ValueDenomination className="shares" {...p.data.order.shares} />
				<span className="of">of</span>
				<span className="outcome-name">{p.data.outcome.name.substring(0, 35) + (p.data.outcome.name.length > 35 && '...' || '')}</span>
				<span className="at">@</span>
				<ValueDenomination className="avgPrice" {...p.data.order.price} />
				<br />
				<span className="market-description" title={p.data.market.description}>
					{p.data.market.description.substring(0, 100) + (p.data.market.description.length > 100 && '...' || '')}
				</span>
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
				{!!p.gas && !!p.gas.value &&
					<ValueDenomination className="value-change gas" {...p.gas} prefix="gas:" />
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
						<span className="status">{p.status}</span>
					</div>
				</Link>
				: <div className="status-and-message">
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
	hash: React.PropTypes.string
};

export default Transaction;
