import React, { Component, PropTypes } from 'react';
import BigNumber from 'bignumber.js';

import Input from 'modules/common/components/input';
import InputList from 'modules/common/components/input-list';
// import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications';

import { CATEGORICAL } from 'modules/markets/constants/market-types';
import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import { NEW_MARKET_OUTCOMES } from 'modules/create-market/constants/new-market-creation-steps';
import { CATEGORICAL_OUTCOMES_MIN_NUM, CATEGORICAL_OUTCOMES_MAX_NUM, CATEGORICAL_OUTCOME_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints';

export default class CreateMarketFormOutcomes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      warnings: []
    };

    this.handleScalarSmallInput = this.handleScalarSmallInput.bind(this);
    this.handleScalarBigInput = this.handleScalarBigInput.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.description !== nextProps.description) this.validateForm(nextProps.description);
    if (this.props.currentStep !== nextProps.currentStep &&
      newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_OUTCOMES
    ) { nextProps.updateValidity(true); }

    // Update Outcome w/ average of scalar bounds
    if (nextProps.scalarSmallNum && nextProps.scalarBigNum &&
      (this.props.scalarSmallNum !== nextProps.scalarSmallNum ||
      this.props.scalarBigNum !== nextProps.scalarBigNum)
    ) {
      nextProps.updateNewMarket({ outcomes: [`${(nextProps.scalarSmallNum + nextProps.scalarBigNum) / 2}`] });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // if (this.state.errors !== nextState.errors) nextProps.updateValidity(!nextState.errors.length);
  }

  handleScalarSmallInput(scalarSmallRaw) {
    // const scalarSmallNum = scalarSmallRaw instanceof BigNumber ? scalarSmallRaw.toNumber() : parseFloat(scalarSmallRaw);

    // this.props.updateNewMarket({ scalarSmallNum });
    this.props.updateNewMarket({ scalarSmallNum: scalarSmallRaw });
  }

  handleScalarBigInput(scalarBigRaw) {
    // const scalarBigNum = scalarBigRaw instanceof BigNumber ? scalarBigRaw.toNumber() : parseFloat(scalarBigRaw);

    // this.props.updateNewMarket({ scalarBigNum });
    this.props.updateNewMarket({ scalarBigNum: scalarBigRaw });
  }

  validateForm(outcomes) {
    const warnings = [];

    // for (i = 0; )

    // if (!description || !description.length) {
    //   errors.push('Please enter your question');
    // }
    //
    // if (description.length < DESCRIPTION_MIN_LENGTH) {
    //   errors.push(`Text must be a minimum length of ${DESCRIPTION_MIN_LENGTH}`);
    // }
    //
    //

    // this.setState({ errors });
  }

  render() {
    const p = this.props;

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        {p.type === CATEGORICAL ?
          <div className="create-market-form-part-content">
            <div className="create-market-form-part-input">
              <aside>
                <h3>Potential Outcomes</h3>
                <span>Input between <strong>two</strong> - <strong>eight</strong> potential outcomes for this event.</span>
              </aside>
              <div className="vertical-form-divider" />
              <form>
                <InputList
                  list={p.outcomes}
                  listMinElements={CATEGORICAL_OUTCOMES_MIN_NUM}
                  listMaxElements={CATEGORICAL_OUTCOMES_MAX_NUM}
                  itemMaxLength={CATEGORICAL_OUTCOME_MAX_LENGTH}
                  onChange={outcomes => p.updateNewMarket({ outcomes })}
                />
              </form>
            </div>
          </div>:
          <div className="create-market-form-part-content">
            <div className="create-market-form-part-input">
              <aside>
                <h3>Minimum Value</h3>
                <span>What is the minimum value possible for this event.</span>
              </aside>
              <div className="vertical-form-divider" />
              <form>
                <Input
                  type="text"
                  name="minimum-answer"
                  value={p.scalarSmallNum}
                  placeholder="Minimum answer"
                  maxLength={6}
                  onChange={this.handleScalarSmallInput}
                />
              </form>
            </div>
            <div className="create-market-form-part-input">
              <aside>
                <h3>Maximum Value</h3>
                <span>What is the maximum value possible for this event.</span>
              </aside>
              <div className="vertical-form-divider" />
              <form>
                <Input
                  type="text"
                  name="maximum-answer"
                  value={p.scalarBigNum}
                  placeholder="Maximum answer"
                  maxLength={6}
                  onChange={this.handleScalarBigInput}
                />
              </form>
            </div>
          </div>
        }
      </article>
    );
  }
}

CreateMarketFormOutcomes.propTypes = {
  type: PropTypes.string.isRequired,
  outcomes: PropTypes.array.isRequired,
  scalarSmallNum: PropTypes.string.isRequired,
  scalarBigNum: PropTypes.string.isRequired,
  currentStep: PropTypes.number.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};

// <CreateMarketFormErrors
//   errors={s.errors}
// />
