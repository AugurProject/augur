import React from 'react';
import classnames from 'classnames';
import Link from 'modules/link/components/link';
import { CREATE_MARKET, BUY, SELL, BID, ASK, SHORT_SELL, SHORT_ASK, MATCH_BID, MATCH_ASK, COMMIT_REPORT, REVEAL_REPORT, GENERATE_ORDER_BOOK, CANCEL_ORDER, SELL_COMPLETE_SETS } from 'modules/transactions/constants/types';
import { FUND_ACCOUNT } from 'modules/auth/constants/auth-types';
import { SCALAR, CATEGORICAL } from 'modules/markets/constants/market-types';
import ValueDenomination from 'modules/common/components/value-denomination';
import ValueTimestamp from 'modules/common/components/value-timestamp';
import TransactionMessage from 'modules/transactions/components/transaction-message';
import TransactionDescription from 'modules/transactions/components/transaction-description';
import ReportEthics from 'modules/my-reports/components/report-ethics';

const Transaction = (p) => {
	const nodes = {};

	switch (p.type) {
		case BUY:
		case BID:
		case SELL:
		case ASK:
		case SHORT_SELL:
		case SHORT_ASK:
		case MATCH_BID:
		case MATCH_ASK:
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
				case MATCH_BID:
					nodes.action = 'FILLED BID';
					break;
				case MATCH_ASK:
					nodes.action = 'FILLED ASK';
					break;
				default:
					break;
			}

			nodes.description = (
				<span className="description">
					<span className="action">{nodes.action}</span>
					<ValueDenomination className="shares" {...p.numShares} />
					{p.data.marketType === CATEGORICAL &&
						<span>
							<span className="of">of</span> <span className="outcome-name">{p.data.outcomeName && p.data.outcomeName.toString().substring(0, 35) + ((p.data.outcomeName.toString().length > 35 && '...') || '')}</span>
						</span>
					}
					<span className="at">@</span>
					<ValueDenomination className="noFeePrice" {...p.noFeePrice} />
					<br className="hide-in-tx-display" />
					<ValueDenomination className="avgPrice" {...p.avgPrice} prefix="estimated total (including trading fees):" postfix="/ share" />
					<br />
					<TransactionDescription description={p.description} marketLink={p.data.marketLink} />
					<br className="hide-in-trade-summary-display" />
					{p.timestamp &&
						<ValueTimestamp className="property-value" {...p.timestamp} />
					}
				</span>
			);

			break;

		case SELL_COMPLETE_SETS:
			nodes.action = `REDEEM ${p.numShares.formatted} COMPLETE SETS`;
			nodes.description = (
				<span className="description">
					<span className="action">{nodes.action}</span>
					<br />
					<TransactionDescription description={p.description} marketLink={p.data.marketLink} />
					<br />
					{p.timestamp &&
						<ValueTimestamp className="property-value" {...p.timestamp} />
					}
				</span>
			);
			break;

		case FUND_ACCOUNT:
			nodes.action = 'Register New Account';
			nodes.description = (
				<span className="description">
					<span className="action">{nodes.action}</span>
					<br />
					<span className="market-description">Request testnet Ether and Reputation</span>
					<br />
					{p.timestamp &&
						<ValueTimestamp className="property-value" {...p.timestamp} />
					}
				</span>
			);
			break;

		case CREATE_MARKET:
			nodes.action = 'Create Market';
			nodes.description = (
				<span className="description">
					<span className="action">{nodes.action}</span>
					<br />
					<TransactionDescription description={p.description} marketLink={p.data.marketLink} />
					<br />
					{p.timestamp &&
						<ValueTimestamp className="property-value" {...p.timestamp} />
					}
				</span>
			);
			break;

		case COMMIT_REPORT:
		case REVEAL_REPORT: {
			nodes.action = p.type === COMMIT_REPORT ? 'Commit Report' : 'Reveal Report';
			const reportedOutcome = (p.data.isScalar || (p.data.market && p.data.market.type === SCALAR)) ?
				p.data.reportedOutcomeID :
				p.data.outcome && p.data.outcome.name && p.data.outcome.name.substring(0, 35) + ((p.data.outcome.name.length > 35 && '...') || '');
			nodes.description = (
				<span className="description">
					<span className="action">{nodes.action}</span>
					<strong>{reportedOutcome}</strong>
					<ReportEthics isUnethical={p.data.isUnethical} />
					<br />
					<TransactionDescription description={p.description} marketLink={p.data.marketLink} />
					<br />
					{p.timestamp &&
						<ValueTimestamp className="property-value" {...p.timestamp} />
					}
				</span>
			);
			break;
		}
		case GENERATE_ORDER_BOOK:
			nodes.action = 'Generate order book';
			nodes.description = (
				<span className="description">
					<span className="action">{nodes.action}</span>
					<br />
					<TransactionDescription description={p.description} marketLink={p.data.marketLink} />
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
					<span className="action">Cancel order</span>
					<span className="at">to {p.data.order.type}</span>
					<ValueDenomination className="shares" {...p.data.order.shares} />
					<span className="of">of</span>
					<span className="outcome-name">{p.data.outcome.name && p.data.outcome.name.substring(0, 35) + ((p.data.outcome.name.length > 35 && '...') || '')}</span>
					<br />
					<TransactionDescription description={p.description} marketLink={p.data.marketLink} />
					<br />
					{p.timestamp &&
						<ValueTimestamp className="property-value" {...p.timestamp} />
					}
				</span>

			);
			break;
		}
		default:
			nodes.description = (
				<span className="description">
					<span className="action">{p.type}</span>
					<br />
					<TransactionDescription description={p.description} marketLink={p.data.marketLink} />
					<br />
					{p.timestamp &&
						<ValueTimestamp className="property-value" {...p.timestamp} />
					}
				</span>
			);
			break;
	}

	return (
		<article className={classnames('transaction-item', p.className, p.status)}>
			{p.index &&
				<span className="index">{`${p.index}.`}</span>
			}

			{nodes.description}

			<span className="value-changes">
				{!!p.tradingFees && p.tradingFees.value !== null && p.tradingFees.value !== undefined &&
					<ValueDenomination className="value-change tradingFees" {...p.tradingFees} prefix="trading fees:" />
				}
				<span className="spacer">&nbsp;</span>
				{!!p.feePercent && p.feePercent.value !== null && p.feePercent !== undefined &&
					<ValueDenomination className="value-change feePercent" {...p.feePercent} prefix="[" postfix="]" />
				}
				<br />
				{!!p.gasFees && !!p.gasFees.value &&
					<ValueDenomination className="value-change gasFees" {...p.gasFees} prefix="estimated gas cost:" />
				}
			</span>

			{p.status && p.hash ?
				<Link href={`https://testnet.etherscan.io/tx/${p.hash}`} target="_blank">
					<TransactionMessage {...p} />
				</Link> :
				<TransactionMessage {...p} />
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
	description: React.PropTypes.string,
	shares: React.PropTypes.object,
	gas: React.PropTypes.object,
	hash: React.PropTypes.string,
	freeze: React.PropTypes.object,
	gasFees: React.PropTypes.object,
	tradingFees: React.PropTypes.object,
	marketCreationFee: React.PropTypes.object,
	bond: React.PropTypes.object,
	totalCost: React.PropTypes.object,
	totalReturn: React.PropTypes.object,
	timestamp: React.PropTypes.object
};

export default Transaction;
