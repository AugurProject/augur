import React from 'react';
import classnames from 'classnames';
import {
	CREATE_MARKET,
	BUY_SHARES,
	SELL_SHARES,
	BID_SHARES,
	ASK_SHARES,
	SUBMIT_REPORT,
	GENERATE_ORDER_BOOK,
	TRADE_SUMMARY
} from '../../transactions/constants/types';
import { LOGIN, REGISTER } from '../../auth/constants/auth-types';
import ValueDenomination from '../../common/components/value-denomination';

const Transaction = (p) => {
	console.log('p -- ', p);

	const rows = [];

	return (
		<div></div>
	);


	// const nodes = {};
	//
	// switch (p.type) {
	// case BUY_SHARES:
	// case BID_SHARES:
	// case SELL_SHARES:
	// case ASK_SHARES:
	// 	switch (p.type) {
	// 	case BUY_SHARES:
	// 		nodes.action = 'BUY';
	// 		break;
	// 	case BID_SHARES:
	// 		nodes.action = 'BID';
	// 		break;
	// 	case SELL_SHARES:
	// 		nodes.action = 'SELL';
	// 		break;
	// 	case ASK_SHARES:
	// 		nodes.action = 'ASK';
	// 		break;
	// 	default:
	// 		break;
	// 	}
	// 	nodes.description = (
	// 		<span className="description">
	// 			<span className="action">{nodes.action}</span>
	// 			<ValueDenomination className="shares" {...p.shares} />
	// 			<span className="at">at</span>
	// 			<ValueDenomination className="avgPrice" {...p.data.avgPrice} />
	// 			<span className="of">of</span>
	// 			<span className="outcome-name">{p.data.outcomeName.substring(0, 35) + (p.data.outcomeName.length > 35 && '...' || '')}</span>
	// 			<br />
	// 			<span className="market-description" title={p.data.marketDescription}>
	// 				{p.data.marketDescription.substring(0, 100) + (p.data.marketDescription.length > 100 && '...' || '')}
	// 			</span>
	// 		</span>
	// 	);
	// 	if (p.type === BUY_SHARES) {
	// 		nodes.valueChange = (
	// 			<span className="value-change">
	// 				{!!p.shares && !!p.shares.value && <ValueDenomination className="value-change shares" {...p.shares} />
	// 				}
	// 				{!!p.etherNegative && !!p.etherNegative.value && <ValueDenomination className="value-change ether" {...p.etherNegative} />
	// 				}
	// 			</span>
	// 		);
	// 	} else {
	// 		nodes.valueChange = (
	// 			<span className="value-change">
	// 				{!!p.sharesNegative && !!p.sharesNegative.value && <ValueDenomination className="value-change shares" {...p.sharesNegative} />
	// 				}
	// 				{!!p.ether && !!p.ether.value && <ValueDenomination className="value-change ether" {...p.ether} />
	// 				}
	// 			</span>
	// 		);
	// 	}
	// 	break;
	// case TRADE_SUMMARY:
	// 	nodes.description = (<span className="description">&nbsp;</span>);
	// 	nodes.valueChange = (
	// 		<span className="value-change">
	// 			{!!p.shares && !!p.shares.value && <ValueDenomination className="value-change shares" {...p.shares} />
	// 			}
	// 			{!!p.ether && !!p.ether.value && <ValueDenomination className="value-change ether" {...p.ether} />
	// 			}
	// 		</span>
	// 	);
	// 	break;
	// case LOGIN:
	// 	nodes.description = (
	// 		<span className="description">
	// 			Login
	// 		</span>
	// 	);
	// 	break;
	// case REGISTER:
	// 	nodes.description = (
	// 		<span className="description">
	// 			Load free beta assets
	// 		</span>
	// 	);
	// 	break;
	// case CREATE_MARKET:
	// 	nodes.description = (
	// 		<span className="description">
	// 			<span>Make</span>
	// 			<strong>{p.data.type}</strong>
	// 			<span>market</span>
	// 			<br />
	// 			<span className="market-description" title={p.data.description}>{p.data.description.substring(0, 100) + (p.data.description.length > 100 && '...' || '')}</span>
	// 		</span>
	// 	);
	// 	break;
	// case SUBMIT_REPORT:
	// 	nodes.description = (
	// 		<span className="description">
	// 			<span>Report</span>
	// 			<strong>{p.data.outcome.name.substring(0, 35) + (p.data.outcome.name.length > 35 && '...' || '')}</strong>
	// 			{!!p.data.isUnethical &&
	// 				<strong className="unethical"> and Unethical</strong>
	// 			}
	// 			<br />
	// 			<span className="market-description" title={p.data.market.description}>{p.data.market.description.substring(0, 100) + (p.data.market.description.length > 100 && '...' || '')}</span>
	// 		</span>
	// 	);
	// 	break;
	// case GENERATE_ORDER_BOOK:
	// 	nodes.description = (
	// 		<span className="description">
	// 			<span>Generate Order Book</span>
	// 			<br />
	// 			<span className="market-description" title={p.data.description}>{p.data.description.substring(0, 100) + (p.data.description.length > 100 && '...' || '')}</span>
	// 		</span>
	// 	);
	// 	break;
	// default:
	// 	nodes.description = (<span className="description">{p.type}</span>);
	// 	nodes.valueChange = (
	// 		<span className="value-change">
	// 			{!!p.shares && !!p.shares.value && <ValueDenomination className="value-change shares" {...p.shares} />
	// 			}
	// 			{!!p.ether && !!p.ether.value && <ValueDenomination className="value-change ether" {...p.ether} />
	// 			}
	// 		</span>
	// 	);
	// 	break;
	// }
	//
	// return (
	// 	<article className={classnames('transaction-item', p.className, p.status)}>
	// 		{p.index &&
	// 			<span className="index">{`${p.index}.`}</span>
	// 		}
	// 		{nodes.description}
	// 		{nodes.valueChange}
	// 		{p.status &&
	// 			<div className="status-and-message"><span className="status">{p.status}</span><br /><span className="message">{p.message}</span></div>
	// 		}
	// 	</article>
	// );
};

Transaction.propTypes = {
	className: React.PropTypes.string,
	index: React.PropTypes.number,
	type: React.PropTypes.string,
	status: React.PropTypes.string,
	data: React.PropTypes.object,
	shares: React.PropTypes.object,
	ether: React.PropTypes.object,
	asksToBuy: React.PropTypes.array
};

export default Transaction;
