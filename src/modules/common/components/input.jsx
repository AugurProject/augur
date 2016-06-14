import React from 'react';
import classnames from 'classnames';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

module.exports = React.createClass({
	propTypes: {
		type: React.PropTypes.string,
		className: React.PropTypes.string,
		value: React.PropTypes.any,
		isMultiline: React.PropTypes.bool,
		isClearable: React.PropTypes.bool,
		debounceMS: React.PropTypes.number,
		onChange: React.PropTypes.func
	},

    getInitialState: function() {
    	return {
    		value: this.props.value || '',
    		timeoutID: ''
    	};
    },

    componentWillReceiveProps: function(nextProps) {
    	if (nextProps.value && nextProps.value !== this.state.value && nextProps.value !== this.props.value) {
    		this.setState({ value: nextProps.value });
    	}
    },

    shouldComponentUpdate: shouldComponentUpdatePure,

	render() {
		var p = this.props,
			s = this.state;

		return (
			<div className={ classnames('input', { 'clearable': p.isClearable !== false }, this.props.className) }>
				{ !p.isMultiline &&
					<input { ...p }
							className="box"
							value={ s.value }
							onChange={ this.handleOnChange }
							onBlur={ this.handleOnBlur } />
				}

				{ p.isMultiline &&
					<textarea { ...p }
							className="box"
							value={ s.value }
							onChange={ this.handleOnChange }
							onBlur={ this.handleOnBlur } />
				}

				{ !p.isMultiline && p.isClearable !== false &&
					<button className="clear"
							onClick={ this.handleClear }>&#xf00d;</button>
				}
			</div>
		);
	},

	handleOnChange: function (e) {
		var newValue = e.target.value;
		if (this.props.debounceMS !== 0) {
			clearTimeout(this.state.timeoutID);
			this.setState({ timeoutID: setTimeout(() => this.sendValue(newValue), this.props.debounceMS || 750) });
		}
		else {
			this.sendValue(newValue);
		}
		this.setState({ value: newValue });
	},

	handleOnBlur: function() {
		if (this.props.debounceMS !== 0) {
			clearTimeout(this.state.timeoutID);
			this.sendValue(this.state.value);
		}
	},

	handleClear: function() {
		this.setState({ value: '' });
		this.sendValue('');
	},

	sendValue: function(value) {
		this.props.onChange(value);
	}
});