import React, { PropTypes } from 'react';

import CreateMarketProgress from 'modules/create-market/components/create-market-progress';

import CreateMarketForm from 'modules/create-market/components/create-market-form';

const CreateMarketView = p => (
  <section id="create_market_view">
    <article className="create-market-container">
      <CreateMarketProgress
        currentStep={p.newMarket.step}
      />
      <CreateMarketForm
        newMarket={p.newMarket}
        updateNewMarket={p.updateNewMarket}
      />
    </article>
  </section>
);

export default CreateMarketView;

CreateMarketView.propTypes = {
  newMarket: PropTypes.object.isRequired
};
