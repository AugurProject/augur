import React, { PropTypes } from 'react';
import ValueDenomination from '../../common/components/value-denomination';
import ValueDate from '../../common/components/value-date';
import classNames from 'classnames';

const Basics = (p) => (
	<section className="basics">
		{!!p.tags && !!p.tags.length &&
			<ul className="tags">
				{p.tags.map((tag, i) => (
					<li key={i} className={classNames('tag', { link: !!tag.name })} onClick={!!tag.onClick && tag.onClick}>{!!tag.name ? tag.name : tag}</li>
				))}
			</ul>
		}

		<span className="description" title={p.description}>{p.description}</span>

		<ul className="properties">
			{!!p.endDate &&
				<li className="property end-date" title={`${p.endDateLabel}: ${p.endDate.full}`}>
					<span className="property-label">{p.endDateLabel}</span>
					<ValueDate className="property-value" {...p.endDate} />
				</li>
			}
			<li className="property fee" title={`${p.makerFeePercent.full} discounted fee for placing bids or asks on the books`}>
				<span className="property-label">maker fee</span>
				<ValueDenomination className="property-value" {...p.makerFeePercent} />
			</li>
			<li className="property fee" title={`${p.takerFeePercent.full} fee for taking bids or asks from the books`}>
				<span className="property-label">taker fee</span>
				<ValueDenomination className="property-value" {...p.takerFeePercent} />
			</li>
			<li className="property volume" title={`${p.volume.rounded} total ${p.volume.denomination} traded`}>
				<span className="property-label">volume</span>
				<ValueDenomination className="property-value" {...p.volume} formatted={p.volume.rounded} />
			</li>
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
		</ul>
	</section>
);

Basics.propTypes = {
	description: PropTypes.string,
	author: PropTypes.string,
	extraInfo: PropTypes.string,
	resolution: PropTypes.string,
	endDate: PropTypes.object,
	makerFeePercent: PropTypes.object,
	takerFeePercent: PropTypes.object,
	volume: PropTypes.object,
	tags: PropTypes.array
};

export default Basics;

function getResolutionNode(resolution) {
	let resolutionText;
	if (resolution === 'generic') {
		resolutionText = 'Covered by local, national or international news media';
	} else {
		resolutionText = (<a href={resolution}>{resolution}</a>);
	}

	return (<span className="property-value">{resolutionText}</span>);
}
