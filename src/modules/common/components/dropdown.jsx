import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Dropdown = (p) => (
	<span className={classnames('dropdown', p.className)}>
		{!!p.selected &&
			<span className={classnames('selected', p.selected.value)}>{p.selected.label}</span>
		}
		<ul className="options">
			{p.options.filter(option => !p.selected || option.value !== p.selected.value).map(option => (
				<li key={option.value} className={classnames('option', option.value)} onClick={() => p.onChange(option.value)}>{option.label}</li>
			))}
		</ul>
	</span>
);

Dropdown.propTypes = {
	className: PropTypes.string,
	selected: PropTypes.object,
	options: PropTypes.array,
	onChange: PropTypes.func
};

export default Dropdown;
