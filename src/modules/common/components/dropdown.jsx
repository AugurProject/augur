import React, { PropTypes } from 'react';

const Dropdown = (p) => (
	<div className="dropdown">
		<select>
			{p.options.map(option => (
				<option key={option.value}>{option.value}</option>
			))}
		</select>
		<i></i>
	</div>
);

Dropdown.propTypes = {
	className: PropTypes.string,
	selected: PropTypes.object,
	options: PropTypes.array,
	onChange: PropTypes.func
};

export default Dropdown;
