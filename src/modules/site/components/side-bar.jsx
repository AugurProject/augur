import React from 'react';
import Checkbox from '../../common/components/checkbox';

const SideBar = p => (
	<div className="side-bar">
		<h3>All Tags</h3>
		<div className="filters">
			{p.tags.length && p.tags.map(tag =>
				<Checkbox
					key={tag.value}
					className="filter"
					text={tag.name}
					text2={`(${tag.numMatched})`}
					isChecked={tag.isSelected}
					onClick={tag.onClick}
				/>
			)}
		</div>
	</div>
);


// TODO -- Prop Validations
// SideBar.propTypes = {
// 	filters: React.PropTypes.array
// };

export default SideBar;
