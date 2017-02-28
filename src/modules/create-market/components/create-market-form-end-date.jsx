import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Input from 'modules/common/components/input';
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
    // if (this.props.expirySourceType !== nextProps.expirySourceType ||
    //     (nextProps.expirySourceType === EXPIRY_SOURCE_SPECIFIC && this.props.expirySource !== nextProps.expirySource)
    // ) {
    //   this.validateForm(nextProps.expirySourceType, nextProps.expirySource);
    // }
    //
    // if (!this.state.canCheckURL &&
    //   (this.props.expirySource.length || nextProps.expirySource.length)
    // ) {
    //   this.setState({ canCheckURL: true });
    // }
  }

  componentWillUpdate(nextProps, nextState) {
    // if (this.state.errors !== nextState.errors) nextProps.updateValidity(!nextState.errors.length);
  }

  validateForm(type, source) {
    const errors = [];

    // if (type == null || !type.length) {
    //   errors.push('Please choose an expiry source.');
    // }
    //
    // if (!source.length) {
    //   errors.push(''); // Simply invalidates form, but doesn't require an error message
    // }
    //
    // if (this.state.canCheckURL &&
    //     type === EXPIRY_SOURCE_SPECIFIC &&
    //     (source == null || !source.length)
    // ) {
    //   errors.push('Please enter the full URL of the website.');
    // }

    this.setState({ errors });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        <h2>End Date -- TODO</h2>
      </article>
    );
  }
}

CreateMarketFormEndDate.propTypes = {
  endDate: PropTypes.object.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};

// <CreateMarketFormErrors
//   errors={s.errors}
// />
