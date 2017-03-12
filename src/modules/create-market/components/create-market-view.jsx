import React, { PropTypes } from 'react';

import CreateMarketMainTitle from 'modules/create-market/components/create-market-main-title';
import CreateMarketPreview from 'modules/create-market/components/create-market-preview';
import CreateMarketForm from 'modules/create-market/components/create-market-form';
import CreateMarketFormButtons from 'modules/create-market/components/create-market-form-buttons';

const CreateMarketView = (p) => {
  console.log('p -- ', p);

  return (
    <section
      id="create_market_view"
      style={{ 'margin-bottom': p.footerHeight }}
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
        />
      </div>
    </section>
  );
}

export default CreateMarketView;

CreateMarketView.propTypes = {
  newMarket: PropTypes.object.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
