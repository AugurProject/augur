import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Dropdown = (p) => {
	return (
		<span className={classnames('drop-down', p.className)}>
			{!!p.selected &&
				<span className="selected">{p.selected.label}</span>
			}
			<ul className="options">
				{p.options.filter(option => option.value !== p.selected.value).map(option => (
					<li key={option.value} className="option" onClick={() => p.onChange(option.value)}>{option.label}</li>
				))}
			</ul>
		</span>
	);
};

Dropdown.propTypes = {
	className: PropTypes.string,
	selected: PropTypes.object,
	options: PropTypes.array,
	onChange: PropTypes.func
};

export default Dropdown;
