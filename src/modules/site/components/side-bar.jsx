import React from 'react';
import Checkbox from '../../common/components/checkbox';

const SideBar = (p) => (
	<div className="side-bar">
		<h3>All Tags</h3>
		<div className="filters">
			{p.filters.length && p.filters.map(filter =>
				<Checkbox
					key={filter.value}
					className="filter"
					text={filter.name}
					text2={`(${filter.numMatched})`}
					isChecked={filter.isSelected}
					onClick={filter.onClick}
				/>
			)}
		</div>
	</div>
);

SideBar.propTypes = {
	filters: React.PropTypes.array
};

export default SideBar;
