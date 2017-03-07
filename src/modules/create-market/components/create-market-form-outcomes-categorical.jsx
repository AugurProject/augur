import React, { Component, PropTypes } from 'react';

import InputList from 'modules/common/components/input-list';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import { NEW_MARKET_OUTCOMES } from 'modules/create-market/constants/new-market-creation-steps';
import { CATEGORICAL_OUTCOMES_MIN_NUM, CATEGORICAL_OUTCOMES_MAX_NUM, CATEGORICAL_OUTCOME_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints';

export default class CreateMarketFormOutcomesCategorical extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    outcomes: PropTypes.array.isRequired,
    updateValidity: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      warnings: []
    };

    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep && newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_OUTCOMES) this.validateForm(nextProps.outcomes);
  }

  validateForm(outcomes) {
    console.log('validateForm -- ', outcomes);

    // Error Checking
    if (outcomes.length < 2) {
      this.props.updateValidity(false);
    } else {
      this.props.updateValidity(true);
    }
    // TODO
  }

  render() {
    const p = this.props;

    return (
      <article className="create-market-form-part-content">
        <div className="create-market-form-part-input">
          <aside>
            <h3>Potential Outcomes</h3>
            <span>Input between <strong>two</strong> - <strong>eight</strong> potential outcomes for this event.</span>
          </aside>
          <div className="vertical-form-divider" />
          <form onSubmit={e => e.preventDefault()} >
            <InputList
              list={p.outcomes}
              listMinElements={CATEGORICAL_OUTCOMES_MIN_NUM}
              listMaxElements={CATEGORICAL_OUTCOMES_MAX_NUM}
              itemMaxLength={CATEGORICAL_OUTCOME_MAX_LENGTH}
              onChange={outcomes => this.validateForm(outcomes)}
            />
          </form>
        </div>
      </article>
    );
  }
}
