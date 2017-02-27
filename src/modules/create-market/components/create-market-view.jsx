import React, { PropTypes } from 'react';

import CreateMarketPreview from 'modules/create-market/components/create-market-preview';

import CreateMarketForm from 'modules/create-market/components/create-market-form';

const CreateMarketView = p => (
  <section id="create_market_view">
    <div className="create-market-container">
      <CreateMarketPreview
        newMarket={p.newMarket}
        updateNewMarket={p.updateNewMarket}
      />
      <CreateMarketForm
        newMarket={p.newMarket}
        addValidationToNewMarket={p.addValidationToNewMarket}
        removeValidationFromNewMarket={p.removeValidationFromNewMarket}
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
