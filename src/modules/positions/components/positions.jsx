import React from 'react';
// import classnames from 'classnames';
import Position from './position';

const Positions = (props) => {
	const p = this.props;
	return (
		<section className="positions-list">
				{(p.outcomes || []).map(outcome =>
					<Position
						key={outcome.id}
						{...outcome}
						{...outcome.position}
					/>
				)}
		</section>
	);
};
Positions.propTypes = {
	className: React.PropTypes.string,
	outcomes: React.PropTypes.array
};
export default Positions;
