import React from 'react';
import classnames from 'classnames';

const Dropdown = React.createClass({
	propTypes: {
		className: React.PropTypes.string,

		selected: React.PropTypes.object,
		options: React.PropTypes.array,

		onChange: React.PropTypes.func
	},

	render: function() {
		const p = this.props;

		return (
			<span className={ classnames('drop-down', p.className) }>
				{ !!p.selected &&
			    	<span className="selected">{ p.selected.label }</span>
				}
			    <ul className="options">
			    	{ p.options.filter(option => option.value !== p.selected.value).map(option => (
			        	<li key={ option.value } className="option" onClick={ () => p.onChange(option.value) }>{ option.label }</li>
			        ))}
			    </ul>
			</span>
		);
	}
});

module.exports = Dropdown;