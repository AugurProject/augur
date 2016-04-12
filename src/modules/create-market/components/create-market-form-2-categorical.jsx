import React from 'react';

import InputList from '../../common/components/input-list';

module.exports = React.createClass({
	propTypes: {
		categoricalOutcomes: React.PropTypes.array,
		errors: React.PropTypes.object,

		categoricalOutcomesMinNum: React.PropTypes.number,
		categoricalOutcomesMaxNum: React.PropTypes.number,
		categoricalOutcomeMaxLength: React.PropTypes.number,

		onValuesUpdated: React.PropTypes.func
	},

	render: function() {
		var p = this.props;

		return (
			<div className="categorical">
				<h4>What are the possible answers to your question? (required)</h4>
				<p>
					All possible outcomes to your question must be covered by these answers. You can add an
					"any other outcome" type answer at the end to ensure everything is covered.
				</p>
				<InputList
					className="categorical-list"
					list={ p.categoricalOutcomes }
					errors={ p.errors && p.errors.categoricalOutcomes || [] }

					listMinElements={ p.categoricalOutcomesMinNum }
					listMaxElements={ p.categoricalOutcomesMaxNum }
					itemMaxLength={ p.categoricalOutcomeMaxLength }

					onChange={ (newOutcomes) => p.onValuesUpdated({ categoricalOutcomes: newOutcomes }) } />
			</div>
		);
	},
});