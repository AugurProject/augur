import React, { PropTypes } from 'react';

import InputList from 'modules/common/components/input-list';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import { NEW_MARKET_KEYWORDS } from 'modules/create-market/constants/new-market-creation-steps';
import { KEYWORDS_MAX_NUM, TAGS_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints';

const CreateMarketFormKeywords = (p) => {
  // Optional step -- update validity to true by default
  if (p.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_KEYWORDS) && !p.isValid) p.updateValidity(true);

  return (
    <article className={`create-market-form-part ${p.className || ''}`}>
      <div className="create-market-form-part-content">
        <aside>
          <h3>Keywords</h3>
          <span>Add up to <strong>two</strong> keywords to help with the categorization and indexing of your market.</span>
        </aside>
        <div className="vertical-form-divider" />
        <form>
          <InputList
            list={p.keywords}
            listMaxElements={KEYWORDS_MAX_NUM}
            itemMaxLength={TAGS_MAX_LENGTH}
            onChange={keywords => p.updateNewMarket({ keywords })}
          />
        </form>
      </div>
    </article>
  );
};

CreateMarketFormKeywords.propTypes = {
  isValid: PropTypes.bool.isRequired,
  currentStep: PropTypes.number.isRequired,
  keywords: PropTypes.array.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};

export default CreateMarketFormKeywords;
