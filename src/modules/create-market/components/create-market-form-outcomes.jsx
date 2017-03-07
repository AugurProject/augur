import React, { Component, PropTypes } from 'react';
// import BigNumber from 'bignumber.js';

import Input from 'modules/common/components/input';

import CreateMarketFormOutcomesCategorical from 'modules/create-market/components/create-market-form-outcomes-categorical';
// import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications';

import { CATEGORICAL } from 'modules/markets/constants/market-types';
import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import { NEW_MARKET_OUTCOMES } from 'modules/create-market/constants/new-market-creation-steps';


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
          <CreateMarketFormOutcomesCategorical
            currentStep={p.currentStep}
            outcomes={p.outcomes}
            updateValidity={p.updateValidity}
            updateNewMarket={p.updateNewMarket}
          /> :
          <div className="create-market-form-part-content">
            <div className="create-market-form-part-input">
              <aside>
                <h3>Minimum Value</h3>
                <span>What is the minimum value possible for this event.</span>
              </aside>
              <div className="vertical-form-divider" />
              <form onSubmit={e => e.preventDefault()} >
                <Input
                  type="text"
                  className="constrained-width"
                  name="minimum-answer"
                  value={p.scalarSmallNum}
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
              <form onSubmit={e => e.preventDefault()} >
                <Input
                  type="text"
                  className="constrained-width"
                  name="maximum-answer"
                  value={p.scalarBigNum}
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
