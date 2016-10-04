import React, { PropTypes } from 'react';
import ValueDenomination from '../../common/components/value-denomination';
import ValueDate from '../../common/components/value-date';

const MarketInfo = p => (
	<div className="market-info">
		<ul className="properties">
			{p.outstandingShares != null &&
				<li className="property outstanding-shares">
					<span className="property-label">outstanding shares</span>
					<ValueDenomination className="property-value" {...p.outstandingShares} />
				</li>
			}
			{p.author != null &&
				<li className="property author">
					<span className="property-label">author</span>
					<span className="property-value">{p.author}</span>
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
			<li className="property creation-date">
				<span className="property-label">creation date</span>
				<ValueDate className="property-value" {...p.creationTime} />
			</li>
		</ul>
	</div>
);

MarketInfo.propTypes = {
	author: PropTypes.string,
	extraInfo: PropTypes.string,
	resolution: PropTypes.string,
	outstandingShares: PropTypes.object,
	creationTime: PropTypes.object,
	type: PropTypes.string,
	minValue: PropTypes.string,
	maxValue: PropTypes.string
};

export default MarketInfo;

function getResolutionNode(resolution) {
	let resolutionText;
	if (resolution === 'generic') {
		resolutionText = 'Covered by local, national or international news media';
	} else {
		resolutionText = (<a href={resolution}>{resolution}</a>);
	}

	return (<span className="property-value">{resolutionText}</span>);
}
