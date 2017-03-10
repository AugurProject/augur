import React, { PropTypes } from 'react';

import DatePicker from 'modules/common/components/datepicker';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import { NEW_MARKET_END_DATE } from 'modules/create-market/constants/new-market-creation-steps';

const CreateMarketFormEndDate = (p) => {
  if (p.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_END_DATE) && Object.keys(p.endDate).length && !p.isValid) p.updateValidity(true);

  return (
    <article className={`create-market-form-part ${p.className || ''}`}>
      <div className="create-market-form-part-content">
        <div className="create-market-form-part-input">
          <aside>
            <h3>End Date</h3>
            <span>Specify the date & time <strong>(Local Timezone)</strong> at which your event will resolve.</span>
          </aside>
          <div className="vertical-form-divider" />
          <form onSubmit={e => e.preventDefault()} >
            <DatePicker
              endDate={p.endDate}
              onValuesUpdated={(endDate) => {
                p.updateNewMarket({ endDate });
                p.updateValidity(true);
              }}
            />
          </form>
        </div>
      </div>
    </article>
  );
};

CreateMarketFormEndDate.propTypes = {
  currentStep: PropTypes.number.isRequired,
  isValid: PropTypes.bool.isRequired,
  endDate: PropTypes.object.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};

export default CreateMarketFormEndDate;
