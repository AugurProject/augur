import React from 'react';
import Position from './my-position';
import Link from '../../link/components/link';

const Positions = (p) => (
	<section className="positions-list">
		<Link key={p.market.id} href={p.market.marketLink.href} onClick={p.market.marketLink.onClick} >
			{(p.market.myPositionOutcomes || []).map(outcome =>
				<Position
					key={outcome.id}
					type={p.market.type}
					{...outcome}
					{...outcome.position}
				/>
			)}
		</Link>
		{p.market.hasCompleteSet && parseFloat(p.market.smallestPosition) === 1 &&
			<div className="complete-sets">
				<div className="close-position-button">
					<button
						className="button"
						onClick={(event) => {
							event.stopPropagation();
							p.market.onSubmitClosePosition();
						}}
					>
						Sell {p.market.smallestPosition} Complete Set
					</button>
				</div>
			</div>
		}
		{p.market.hasCompleteSet && parseFloat(p.market.smallestPosition) !== 1 &&
			<div className="complete-sets">
				<div className="close-position-button">
					<button
						className="button"
						onClick={(event) => {
							event.stopPropagation();
							p.market.onSubmitClosePosition();
						}}
					>
						Sell {p.market.smallestPosition} Complete Sets
					</button>
				</div>
			</div>
		}
	</section>
);

Positions.propTypes = {
	className: React.PropTypes.string,
	market: React.PropTypes.object
};
export default Positions;
