import React, { PropTypes } from 'react';
import ValueDenomination from 'modules/common/components/value-denomination';
import ValueDate from 'modules/common/components/value-date';

import getValue from 'utils/get-value';

const MarketDetails = (p) => {
	const outcomeName = getValue(p, 'result.outcomeName');

	return (
		<div className="market-details">
			<ul className="properties">
				{outcomeName &&
					<li className="property outcome">
						<span className="property-label">Result</span>
						<span className="property-value">{outcomeName} (<ValueDenomination {...p.result.proportionCorrect} />)</span>
					</li>
				}
				{p.author != null &&
					<li className="property author">
						<span className="property-label">author</span>
						<span className="property-value">{p.author}</span>
					</li>
				}
				{p.isOpen && p.outstandingShares != null &&
					<li className="property outstanding-shares">
						<span className="property-label">outstanding shares</span>
						<ValueDenomination className="property-value" {...p.outstandingShares} />
					</li>
				}
				{p.extraInfo != null && p.extraInfo !== '' &&
					<li className="property extra-info">
						<span className="property-label">extra info</span>
						<span className="property-value">{p.extraInfo}</span>
					</li>
				}
				{p.resolution &&
					<li className="property resolution">
						<span className="property-label">resolution</span>
						{getResolutionNode(p.resolution)}
					</li>
				}
				{p.type === 'scalar' && p.minValue != null &&
					<li className="property min-value">
						<span className="property-label">minimum value</span>
						<span className="property-value">{p.minValue}</span>
					</li>
				}
				{p.type === 'scalar' && p.maxValue != null &&
					<li className="property max-value">
						<span className="property-label">maximum value</span>
						<span className="property-value">{p.maxValue}</span>
					</li>
				}
				<li className="property creation-date" data-tip={`created: ${p.creationTime.full}`}>
					<span className="property-label">created</span>
					<ValueDate className="property-value" {...p.creationTime} />
				</li>
			</ul>
			{!!p.reportedOutcome &&
				<div className="reported-outcome">
					<hr />
					<h4>This market is closed.</h4>
					Reported outcome: {p.reportedOutcome}
				</div>
			}
		</div>
	);
};

MarketDetails.propTypes = {
	author: PropTypes.string,
	extraInfo: PropTypes.string,
	resolution: PropTypes.string,
	outstandingShares: PropTypes.object,
	creationTime: PropTypes.object,
	type: PropTypes.string,
	minValue: PropTypes.string,
	maxValue: PropTypes.string,
	reportedOutcome: PropTypes.string
};

export default MarketDetails;

function getResolutionNode(resolution) {
	let resolutionText;
	if (resolution === 'generic') {
		resolutionText = 'Covered by local, national or international news media';
	} else {
		resolutionText = (<a href={resolution}>{resolution}</a>);
	}

	return (<span className="property-value">{resolutionText}</span>);
}
