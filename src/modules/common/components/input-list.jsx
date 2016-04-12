import React from 'react';
import classnames from 'classnames';

import Input from '../../common/components/input';

module.exports = React.createClass({
    propTypes: {
		className: React.PropTypes.string,

		list: React.PropTypes.array,
		errors: React.PropTypes.array,

		listMinElements: React.PropTypes.number,
		listMaxElements: React.PropTypes.number,
		itemMaxLength: React.PropTypes.number,

		onChange: React.PropTypes.func
    },

    getInitialState: function() {
    	return {
    		list: this.fillMinElements(this.props.list, this.props.listMinElements),
    		timeoutID: ''
    	};
    },

    render: function() {
    	var p = this.props,
    		s = this.state,
    		list = s.list || [];

    	if (!p.listMaxElements || list.length < p.listMaxElements) {
    		list = list.slice();
    		list.push('');
    	}

        return (
			<div className={ classnames('input-list', p.className) }>
				{ list.map((item, i) => {
					return (
						<div key={ i } className={ classnames('item', { 'new-item': i === list.length - 1 && (!item || !item.length) }) }>
							<Input
								type="text"
								maxLength={ p.itemMaxLength }
								value={ item }
								debounceMS={ 0 }
								onChange={ (newValue) => this.handleChange(i, newValue) } />

							{ p.errors && p.errors[i] && p.errors[i].length &&
								<span className="error-message">{ p.errors[i] }</span>
							}
						</div>
					);
				})}
			</div>
        );
    },

	handleChange: function(i, val) {
		var newList = (this.state.list || []).slice();
		if ((!val || !val.length) && (!this.props.listMinElements || (i >= this.props.listMinElements))) {
			newList.splice(i, 1);
		}
		else {
			newList[i] = val;
		}

		if (this.state.timeoutID) {
			clearTimeout(this.state.timeoutID);
		}
		this.setState({ timeoutID: setTimeout(() => this.props.onChange(newList), 750), list: newList });
	},

    fillMinElements: function(list, minElements) {
    	var len, i;

    	list = list || [];

    	if (minElements && list.length < minElements) {
    		list = list.slice();
    		len = minElements - list.length;
			for (i = 0; i < len; i++) {
				list.push('');
			}
    	}

    	return list;
    }
});