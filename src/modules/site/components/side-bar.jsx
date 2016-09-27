import React from 'react';
import Checkbox from '../../common/components/checkbox';

const SideBar = (p) => {
	return (
		<div className="side-bar">
			<aside className="filters">
				<h3>All Categories</h3>
				{p.filters.map(filter =>
					<div key={filter.title} className="filters-group">
						{filter.options.map(option =>
							<Checkbox key={option.value} className="filter" text={option.name} text2={`(${option.numMatched})`} isChecked={option.isSelected} onClick={option.onClick} />
						)}
					</div>
				)}
			</aside>
		</div>
	)
};

SideBar.propTypes = {
	filters: React.PropTypes.array
};

export default SideBar;
