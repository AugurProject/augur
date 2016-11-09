import React from 'react';
import ReactTooltip from 'react-tooltip';

import ValueDate from 'modules/common/components/value-date';
import ValueDenomination from 'modules/common/components/value-denomination';

const MarketProperties = p => (
	<ul className="market-properties">
		{!!p.endDate &&
			<li className="property end-date">
				<a
					data-tip
					data-for={`${p.id}-end-date-tooltip`}
					data-event="click focus"
				>
					<span className="property-label">{p.endDateLabel || 'End Date'}:</span>
					<ValueDate className="property-value" {...p.endDate} />
				</a>
				<ReactTooltip
					id={`${p.id}-end-date-tooltip`}
					type="light"
					effect="solid"
					place="top"
					globalEventOff="click"
				>
					<span className="tooltip-text">
						The outcome of this event will be known on or before {p.endDate.full}.
					</span>
				</ReactTooltip>
			</li>
		}
		<li className="property fee">
			<a
				data-tip
				data-for={`${p.id}-maker-fee-tooltip`}
				data-event="click focus"
			>
				<span className="property-label">Maker Fee:</span>
				<ValueDenomination className="property-value" {...p.makerFeePercent} />
			</a>
			<ReactTooltip
				id={`${p.id}-maker-fee-tooltip`}
				type="light"
				effect="solid"
				place="top"
				globalEventOff="click"
			>
				<span className="tooltip-text">
					{p.makerFeePercent.full} discounted fee for placing bids or asks on the books
				</span>
			</ReactTooltip>
		</li>
		<li className="property fee">
			<a
				data-tip
				data-for={`${p.id}-taker-fee-tooltip`}
				data-event="click focus"
			>
				<span className="property-label">Taker Fee:</span>
				<ValueDenomination className="property-value" {...p.takerFeePercent} />
			</a>
			<ReactTooltip
				id={`${p.id}-taker-fee-tooltip`}
				type="light"
				effect="solid"
				place="top"
				globalEventOff="click"
			>
				<span className="tooltip-text">
					{p.takerFeePercent.full} fee for taking bids or asks from the books
				</span>
			</ReactTooltip>
		</li>
		<li className="property volume">
			<a
				data-tip
				data-for={`${p.id}-volume-tooltip`}
				data-event="click focus"
			>
				<span className="property-label">Volume:</span>
				<ValueDenomination className="property-value" {...p.volume} formatted={p.volume.rounded} />
			</a>
			<ReactTooltip
				id={`${p.id}-volume-tooltip`}
				type="light"
				effect="solid"
				place="top"
				globalEventOff="click"
			>
				<span className="tooltip-text">
					{p.volume.fullPrecision || p.volume.formatted} total {p.volume.denomination} traded
				</span>
			</ReactTooltip>
		</li>
		{p.numPendingReports && p.isPendingReport &&
			<li className="property pending-reports">
				<a
					data-tip
					data-for={`${p.id}-pending-reports-tooltip`}
					data-event="click focus"
				>
					<span className="property-label">Pending Reports:</span>
					<span> <strong>{p.numPendingReports}</strong></span>
				</a>
				<ReactTooltip
					id={`${p.id}-pending-reports-tooltip`}
					type="light"
					effect="solid"
					place="top"
					globalEventOff="click"
				>
					<span className="tooltip-text">
						{p.numPendingReports} reports submitted on this market thus far
					</span>
				</ReactTooltip>
			</li>
		}
	</ul>
);

export default MarketProperties;
