import React, { Component, PropTypes } from 'react';

import CreateMarketMainTitle from 'modules/create-market/components/create-market-main-title';
import CreateMarketPreview from 'modules/create-market/components/create-market-preview';
import CreateMarketForm from 'modules/create-market/components/create-market-form';
import CreateMarketFormButtons from 'modules/create-market/components/create-market-form-buttons';

export default class CreateMarketView extends Component {
  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      buttonHeight: 0
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <section
        id="create_market_view"
        style={{ 'margin-bottom': s.buttonHeight + p.footerHeight }}
      >
        <div className="create-market-container">
          <CreateMarketMainTitle
            type={p.newMarket.type}
            validations={p.newMarket.validations}
            currentStep={p.newMarket.currentStep}
          />
          <CreateMarketPreview
            newMarket={p.newMarket}
            updateNewMarket={p.updateNewMarket}
          />
          <CreateMarketForm
            newMarket={p.newMarket}
            buttonHeight={s.buttonHeight}
            addValidationToNewMarket={p.addValidationToNewMarket}
            removeValidationFromNewMarket={p.removeValidationFromNewMarket}
            addOrderToNewMarket={p.addOrderToNewMarket}
            removeOrderFromNewMarket={p.removeOrderFromNewMarket}
            updateNewMarket={p.updateNewMarket}
          />
          <CreateMarketFormButtons
            footerHeight={p.footerHeight}
            currentStep={p.newMarket.currentStep}
            type={p.newMarket.type}
            isValid={p.newMarket.isValid}
            validations={p.newMarket.validations}
            newMarket={p.newMarket}
            addValidationToNewMarket={p.addValidationToNewMarket}
            removeValidationFromNewMarket={p.removeValidationFromNewMarket}
            updateNewMarket={p.updateNewMarket}
            submitNewMarket={p.submitNewMarket}
            updateButtonHeight={buttonHeight => this.setState({ buttonHeight })}
          />
        </div>
      </section>
    );
  }
}

CreateMarketView.propTypes = {

};
