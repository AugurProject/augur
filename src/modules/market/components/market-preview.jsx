import React, { PropTypes } from 'react';
import classnames from 'classnames';
import MarketBasics from './market-basics';
import MarketOutcomes from './market-outcomes';
import Link from '../../link/components/link';

const MarketPreview = p => (
	<article className={`market-preview ${p.className}`}>
		<div className="market-preview-group-1">
			<MarketBasics {...p} />

			{!!p.marketLink &&
				<div className="market-link">
					<Link onClick={p.marketLink.onClick} className={classnames('button', p.marketLink.className)}>{p.marketLink.text}</Link>
				</div>
			}
		</div>

		{p.outcomes &&
			<div className="market-preview-group-2">
				<MarketOutcomes outcomes={p.outcomes} />
			</div>
		}
	</article>
);

MarketPreview.propTypes = {
	className: PropTypes.string,
	description: PropTypes.string,
	outcomes: PropTypes.array,
	isOpen: PropTypes.bool,
	isFavorite: PropTypes.bool,
	isPendingReport: PropTypes.bool,
	endDate: PropTypes.object,
	tradingFeePercent: PropTypes.object,
	volume: PropTypes.object,
	tags: PropTypes.array,
	marketLink: PropTypes.object,
	onClickToggleFavorite: PropTypes.func
};

export default MarketPreview;
