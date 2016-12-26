import React from 'react';
import classnames from 'classnames';
import Link from 'modules/link/components/link';
import { CREATE_MARKET, BUY, SELL, BID, ASK, SHORT_SELL, SHORT_ASK, MATCH_BID, MATCH_ASK, COMMIT_REPORT, REVEAL_REPORT, GENERATE_ORDER_BOOK, CANCEL_ORDER, SELL_COMPLETE_SETS } from 'modules/transactions/constants/types';
import { FUND_ACCOUNT } from 'modules/auth/constants/auth-types';
import { SCALAR, CATEGORICAL } from 'modules/markets/constants/market-types';
import ValueDenomination from 'modules/common/components/value-denomination';
import ValueTimestamp from 'modules/common/components/value-timestamp';

function liveDangerously(thisBetterBeSanitized) { return { __html: thisBetterBeSanitized }; }

const Transaction = (p) => {
	const nodes = {};

	const buildDescription = (fullDescription) => {
		if (!fullDescription) return <span />;
		let shortDescription;
		if (fullDescription.indexOf('\n') > -1) {
			shortDescription = fullDescription.split('\n').map(text => <li key={text}>{text}</li>);
			shortDescription = <ul>{shortDescription}</ul>;
		} else {
			shortDescription = fullDescription.substring(0, 100) + ((fullDescription.length > 100 && '...') || '');
		}
		const description = (isShortened) => {
			if (isShortened) {
				return (
					<span className="market-description" data-tip={fullDescription}>
						{shortDescription}
					</span>
				);
			}
			return (
				<span className="market-description">
					{shortDescription}
				</span>
			);
		};
		const isShortened = shortDescription !== fullDescription;
		if (shortDescription && p.data.marketLink) {
			return (
				<Link href={p.data.marketLink.href} onClick={p.data.marketLink.onClick}>
					{description(isShortened)}
				</Link>
			);
		}
		return <span>{description(isShortened)}</span>;
	};

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
					{buildDescription(p.data.marketDescription)}
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
					{buildDescription(p.data.marketDescription)}
					<br />
					{p.timestamp &&
						<ValueTimestamp className="property-value" {...p.timestamp} />
					}
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
					{buildDescription(p.data.description)}
					<br />
					{p.timestamp &&
						<ValueTimestamp className="property-value" {...p.timestamp} />
					}
				</span>
			);
			break;

		case COMMIT_REPORT:
		case REVEAL_REPORT: {
			let isScalar;
			switch (p.type) {
				case COMMIT_REPORT:
					nodes.action = 'Commit report';
					isScalar = p.data.market.type === SCALAR;
					break;
				case REVEAL_REPORT:
					nodes.action = 'Reveal report';
					isScalar = p.data.isScalar;
					break;
				default:
					break;
			}
			const reportedOutcome = isScalar ?
				p.data.reportedOutcomeID :
				p.data.outcome && p.data.outcome.name && p.data.outcome.name.substring(0, 35) + ((p.data.outcome.name.length > 35 && '...') || '');
			nodes.description = (
				<span className="description">
					<span className="action">{nodes.action}</span>
					<strong>{reportedOutcome}</strong>
					{!!p.data.isUnethical &&
						<strong className="unethical"> and Unethical</strong>
					}
					<br />
					{buildDescription(p.data.description || p.data.marketDescription)}
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
					{buildDescription(p.data.description)}
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
					{buildDescription(p.data.marketDescription)}
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
					{buildDescription(p.data.description)}
					<br />
					{p.timestamp &&
						<ValueTimestamp className="property-value" {...p.timestamp} />
					}
				</span>
			);
			break;
	}

	let balancesMessage;
	if (!!p.data && !!p.data.balances && !!p.data.balances.length) {
		balancesMessage = p.data.balances.map(b => (
			<li key={`${p.hash}-${b.change.full}-${b.balance.full}`}>
				<ValueDenomination className="balance-message balance-change" {...b.change} />
				<ValueDenomination className="balance-message" {...b.balance} prefix=" [ balance:" postfix="]" />
			</li>
		));
		balancesMessage = <ul>{balancesMessage}</ul>;
	} else {
		balancesMessage = <span />;
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
						{balancesMessage}
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
						{!!p.bond && !!p.bond.value &&
							<span>
								<ValueDenomination
									className="bond-message"
									{...p.bond.value}
									prefix={`${p.bond.label} bond:`}
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
					{balancesMessage}
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
					{!!p.bond && !!p.bond.value &&
						<span>
							<ValueDenomination
								className="bond-message"
								{...p.bond.value}
								prefix={`${p.bond.label} bond:`}
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
	bond: React.PropTypes.object,
	totalCost: React.PropTypes.object,
	totalReturn: React.PropTypes.object,
	timestamp: React.PropTypes.object
};

export default Transaction;
