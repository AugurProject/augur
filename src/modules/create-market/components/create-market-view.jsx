import React, { PropTypes } from 'react';

import CreateMarketPreview from 'modules/create-market/components/create-market-preview';

import CreateMarketForm from 'modules/create-market/components/create-market-form';

const CreateMarketView = p => (
  <section id="create_market_view">
    <article className="create-market-container">
      <CreateMarketPreview {...p} />
      <CreateMarketForm {...p} />
    </article>
  </section>
);

export default CreateMarketView;

CreateMarketView.propTypes = {
  newMarket: PropTypes.object.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
