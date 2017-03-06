import React, { PropTypes } from 'react';

import DatePicker from 'modules/common/components/datepicker';

const CreateMarketFormEndDate = p => (
  <article className={`create-market-form-part ${p.className || ''}`}>
    <div className="create-market-form-part-content">
      <aside>
        <h3>End Date</h3>
        <span>Specify the date & time <strong>(Local Timezone)</strong> at which your event will resolve.</span>
      </aside>
      <div className="vertical-form-divider" />
      <form>
        <DatePicker
          endDate={p.endDate}
          onValuesUpdated={(endDate) => {
            p.updateNewMarket({ endDate });
            p.updateValidity(true);
          }}
        />
      </form>
    </div>
  </article>
);

CreateMarketFormEndDate.propTypes = {
  endDate: PropTypes.object.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};

export default CreateMarketFormEndDate;
