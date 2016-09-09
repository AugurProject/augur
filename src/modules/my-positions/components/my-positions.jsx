import React from 'react';
import Position from './my-position';

const Positions = (p) => (
	<section className="positions-list">
		{(p.outcomes || []).map(outcome =>
			<Position
				key={outcome.id}
				type={p.type}
				{...outcome}
				{...outcome.position}
			/>
		)}
	</section>
);

Positions.propTypes = {
	className: React.PropTypes.string,
	type: React.PropTypes.string,
	outcomes: React.PropTypes.array
};
export default Positions;
