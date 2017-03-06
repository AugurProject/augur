import React, { PropTypes } from 'react';

import CreateMarketMainTitle from 'modules/create-market/components/create-market-main-title';
import CreateMarketPreview from 'modules/create-market/components/create-market-preview';
import CreateMarketForm from 'modules/create-market/components/create-market-form';
// import CreateMarketFormPartTitles from 'modules/create-market/components/create-market-form-part-titles';
// import CreateMarketFormButtons from 'modules/create-market/components/create-market-form-buttons';

const CreateMarketView = p => (
  <section id="create_market_view">
    <div className="create-market-container">
      <CreateMarketMainTitle
        type={p.newMarket.type}
        validations={p.newMarket.validations}
      />
      <CreateMarketPreview
        newMarket={p.newMarket}
        updateNewMarket={p.updateNewMarket}
      />
      <CreateMarketForm
        newMarket={p.newMarket}
        addValidationToNewMarket={p.addValidationToNewMarket}
        removeValidationFromNewMarket={p.removeValidationFromNewMarket}
        addOrderToNewMarket={p.addOrderToNewMarket}
        removeOrderFromNewMarket={p.removeOrderFromNewMarket}
        updateNewMarket={p.updateNewMarket}
      />
    </div>
  </section>
);

export default CreateMarketView;

CreateMarketView.propTypes = {
  newMarket: PropTypes.object.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};

// <CreateMarketFormPartTitles
//   currentStep={p.newMarket.currentStep}
// />

// <CreateMarketFormButtons
//   currentStep={p.newMarket.currentStep}
//   isValid={p.isValid}
//   validations={p.newMarket.validations}
//   newMarket={p.newMarket}
//   resetValidity={() => this.resetValidity()}
//   updateValidity={isValid => this.setState({ isValid })}
//   addValidationToNewMarket={p.addValidationToNewMarket}
//   removeValidationFromNewMarket={p.removeValidationFromNewMarket}
//   updateNewMarket={p.updateNewMarket}
//   submitNewMarket={p.submitNewMarket}
// />
