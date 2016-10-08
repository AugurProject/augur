import React from 'react';
import InputList from '../../common/components/input-list';

const CreateMarketForm2Categorical = p => (
	<div className="categorical">
		<h4>What are the possible answers to your question? (required)</h4>
		<p>
			{`All possible outcomes to your question must be covered by these answers. You can add an
			"any other outcome" type answer at the end to ensure everything is covered.`}
		</p>
		<InputList
			className="categorical-list"
			list={p.categoricalOutcomes}
			errors={(p.errors && p.errors.categoricalOutcomes) || []}
			listMinElements={p.categoricalOutcomesMinNum}
			listMaxElements={p.categoricalOutcomesMaxNum}
			itemMaxLength={p.categoricalOutcomeMaxLength}
			onChange={newOutcomes => p.onValuesUpdated({ categoricalOutcomes: newOutcomes })}
		/>
	</div>
);

// TOOD -- Prop Validations
// CreateMarketForm2Categorical.propTypes = {
// 	categoricalOutcomes: PropTypes.array,
// 	errors: PropTypes.object,
// 	categoricalOutcomesMinNum: PropTypes.number,
// 	categoricalOutcomesMaxNum: PropTypes.number,
// 	categoricalOutcomeMaxLength: PropTypes.number,
// 	onValuesUpdated: PropTypes.func
// };

export default CreateMarketForm2Categorical;
