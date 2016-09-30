import React from 'react';
import Position from './my-position';
import Link from '../../link/components/link';

const Positions = (p) => (
	<section className="positions-list">
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
		{p.market.hasCompleteSet &&
			<div className="complete-sets">
				<div className="close-position-button">
					<button
						className="button"
						onClick={(event) => {
							event.stopPropagation();
							p.market.onSubmitClosePosition();
						}}
					>
						Sell Complete Sets ({p.market.smallestPosition.formatted})
					</button>
				</div>
			</div>
		}
	</section>
);

Positions.propTypes = {
	className: React.PropTypes.string,
	market: React.PropTypes.object,
	marketLink: React.PropTypes.object
};
export default Positions;
