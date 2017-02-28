import React, { Component, PropTypes } from 'react';

import DatePicker from 'modules/common/components/datepicker';
import CreateMarketFormErrors from 'modules/create-market/components/create-market-form-errors';

export default class CreateMarketFormEndDate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.endDate !== nextProps.endDate) this.validateForm(nextProps.endDate);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.errors !== nextState.errors) nextProps.updateValidity(!nextState.errors.length);
  }

  validateForm(endDate) {
    const errors = [];

    if (!Object.keys(endDate).length) {
      errors.push('Please select an end date.');
    }

    this.setState({ errors });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        <h2>End Date</h2>
        <DatePicker
          endDate={p.endDate}
          onValuesUpdated={endDate => p.updateNewMarket({ endDate })}
        />
        <CreateMarketFormErrors
          errors={s.errors}
        />
      </article>
    );
  }
}

CreateMarketFormEndDate.propTypes = {
  endDate: PropTypes.object.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
