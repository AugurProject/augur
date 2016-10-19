import React from 'react';
import classnames from 'classnames';
import Link from '../../link/components/link';
import { CREATE_MARKET, BUY, SELL, BID, ASK, SHORT_SELL, SHORT_ASK, COMMIT_REPORT, REVEAL_REPORT, GENERATE_ORDER_BOOK, CANCEL_ORDER, SELL_COMPLETE_SETS } from '../../transactions/constants/types';
import { LOGIN, FUND_ACCOUNT } from '../../auth/constants/auth-types';
import { SCALAR, CATEGORICAL } from '../../markets/constants/market-types';
import ValueDenomination from '../../common/components/value-denomination';
import ValueTimestamp from '../../common/components/value-timestamp';

function liveDangerously(thisBetterBeSanitized) { return { __html: thisBetterBeSanitized }; }

const Transaction = (p) => {
	const nodes = {};

	const marketDescription = () => {
		const description = () => <span className="market-description" title={p.data.description || p.data.marketDescription}>
			{p.data.description ? p.data.description.substring(0, 100) + ((p.data.description.length > 100 && '...') || '') : p.data.marketDescription.substring(0, 100) + ((p.data.marketDescription.length > 100 && '...') || '')}
		</span>;

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
					{marketDescription()}
					<br className="hide-in-trade-summary-display" />
					{p.timestamp &&
						<ValueTimestamp className="property-value" {...p.timestamp} />
					}
				</span>
			);

			break;

		case SELL_COMPLETE_SETS:
			nodes.action = `SELL COMPLETE SETS (${p.numShares.formatted})`;
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

		case LOGIN:
			nodes.description = (
				<span className="description">
					Login
				</span>
			);
			break;
		case FUND_ACCOUNT:
			nodes.action = 'REGISTER NEW ACCOUNT';
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
			nodes.action = 'Create market';
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
						<strong>{p.data.outcome.name && p.data.outcome.name.substring(0, 35) + ((p.data.outcome.name.length > 35 && '...') || '')}</strong>
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
					<span className="action">Cancel order</span>
					<span className="at">to {p.data.order.type}</span>
					<ValueDenomination className="shares" {...p.data.order.shares} />
					<span className="of">of</span>
					<span className="outcome-name">{p.data.outcome.name && p.data.outcome.name.substring(0, 35) + ((p.data.outcome.name.length > 35 && '...') || '')}</span>
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
					<div className="status-and-message">
						<span className="message" dangerouslySetInnerHTML={liveDangerously(p.message)} />
						<br />
						{!!p.tradingFees && p.tradingFees.value !== null && p.tradingFees.value !== undefined &&
							<span>
								<ValueDenomination
									className="tradingFees-message"
									{...p.tradingFees}
									prefix="trading fees:"
								/>
								<br />
							</span>
						}
						{!!p.freeze &&
							<span className="freeze-message">
								{p.freeze.noFeeCost &&
									<ValueDenomination
										className="freeze-noFeeCost-message"
										{...p.freeze.noFeeCost}
										prefix={p.freeze.verb}
										postfix="+ "
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
						{!!p.totalCost && p.totalCost.value !== null && p.totalCost.value !== undefined &&
							<span>
								<ValueDenomination
									className="totalCost-message"
									{...p.totalCost}
									prefix="total cost:"
								/>
								<br />
							</span>
						}
						{!!p.totalReturn && p.totalReturn.value !== null && p.totalReturn.value !== undefined &&
							<span>
								<ValueDenomination
									className="totalReturn-message"
									{...p.totalReturn}
									prefix="total return:"
								/>
								<br />
							</span>
						}
						{!!p.marketCreationFee && p.marketCreationFee.value !== null && p.marketCreationFee !== undefined &&
							<span>
								<ValueDenomination
									className="marketCreationFee-message"
									{...p.marketCreationFee}
									prefix="market creation fee:"
								/>
								<br />
							</span>
						}
						{!!p.eventBond && p.eventBond.value !== null && p.eventBond !== undefined &&
							<span>
								<ValueDenomination
									className="eventBond-message"
									{...p.eventBond}
									prefix="event creation bond:"
								/>
								<br />
							</span>
						}
						{!!p.gasFees && p.gasFees.value !== null && p.gasFees.value !== undefined &&
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
					{!!p.tradingFees && p.tradingFees.value !== null && p.tradingFees.value !== undefined &&
						<span>
							<ValueDenomination
								className="tradingFees-message"
								{...p.tradingFees}
								prefix="trading fees:"
							/>
							<br />
						</span>
					}
					{!!p.freeze &&
						<span className="freeze-message">
							{p.freeze.noFeeCost &&
								<ValueDenomination
									className="freeze-noFeeCost-message"
									{...p.freeze.noFeeCost}
									prefix={p.freeze.verb}
									postfix="+ "
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
					{!!p.totalCost && p.totalCost.value !== null && p.totalCost.value !== undefined &&
						<span>
							<ValueDenomination
								className="totalCost-message"
								{...p.totalCost}
								prefix="total cost:"
							/>
							<br />
						</span>
					}
					{!!p.totalReturn && p.totalReturn.value !== null && p.totalReturn.value !== undefined &&
						<span>
							<ValueDenomination
								className="totalReturn-message"
								{...p.totalReturn}
								prefix="total return:"
							/>
							<br />
						</span>
					}
					{!!p.gasFees && p.gasFees.value !== null && p.gasFees.value !== undefined &&
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
	gas: React.PropTypes.object,
	hash: React.PropTypes.string,
	freeze: React.PropTypes.object,
	gasFees: React.PropTypes.object,
	tradingFees: React.PropTypes.object,
	marketCreationFee: React.PropTypes.object,
	eventBond: React.PropTypes.object,
	totalCost: React.PropTypes.object,
	totalReturn: React.PropTypes.object,
	timestamp: React.PropTypes.object
};

export default Transaction;
