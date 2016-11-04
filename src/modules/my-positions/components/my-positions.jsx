import React from 'react';
import ReactTooltip from 'react-tooltip';

import Position from 'modules/my-positions/components/my-position';
import Link from 'modules/link/components/link';

const Positions = p => (
	<article className="positions-list">
		{p.marketLink &&
			<Link key={p.market.id} href={p.marketLink.href} onClick={p.marketLink.onClick} >
				{(p.market.myPositionOutcomes || []).map(outcome =>
					<Position
						key={`${p.market.id}-${outcome.id}`}
						type={p.market.type}
						{...outcome}
						{...outcome.position}
					/>
				)}
			</Link>
		}
		{!p.marketLink &&
			(p.market.myPositionOutcomes || []).map(outcome =>
				<Position
					key={outcome.id}
					type={p.market.type}
					{...outcome}
					{...outcome.position}
				/>
			)
		}
		{!p.settings.autoSellCompleteSets && p.market.hasCompleteSet &&
			<div className="complete-sets">
				<div className="close-position-button">
					<button
						data-tip={p.market.smallestPosition.full}
						className="button"
						onClick={(event) => {
							event.stopPropagation();
							p.market.onSubmitClosePosition();
						}}
					>
						Redeem {p.market.smallestPosition.formatted} Complete Sets
					</button>
				</div>
			</div>
		}
		<ReactTooltip type="light" effect="solid" place="top" globalEventOff="click" />
	</article>
);

// TODO -- Prop Validations
// Positions.propTypes = {
// 	className: React.PropTypes.string,
// 	market: React.PropTypes.object,
// 	marketLink: React.PropTypes.object
// };

export default Positions;
