import React from 'react';

const Dropdown = p => (
	<div className="dropdown">
		<select
			onChange={(event) => { p.onChange(event.target.value); }}
			defaultValue={p.default}
		>
			{p.options.map(option => (
				<option
					key={option.value}
					value={option.value}
				>
					{option.label}
				</option>
			))}
		</select>
		<i className="fa"></i>
	</div>
);

// TODO -- Prop Validations
// Dropdown.propTypes = {
// 	default: PropTypes.string,
// 	options: PropTypes.array,
// 	onChange: PropTypes.func
// };

export default Dropdown;
