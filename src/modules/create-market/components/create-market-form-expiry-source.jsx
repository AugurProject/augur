import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Input from 'modules/common/components/input';
import CreateMarketFormErrors from 'modules/create-market/components/create-market-form-errors';

import { EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC } from 'modules/create-market/constants/new-market-constraints';

export default class CreateMarketFormExpirySource extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps -- ', nextProps);
    // if (this.props.description !== nextProps.description) this.validateForm(nextProps.description);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.errors !== nextState.errors) nextProps.updateValidity(!nextState.errors.length);
  }

  validateForm(description) {
    const errors = [];

    // if (!description || !description.length) {
    //   errors.push('Please enter your question');
    // }
    //
    // if (description.length < DESCRIPTION_MIN_LENGTH) {
    //   errors.push(`Text must be a minimum length of ${DESCRIPTION_MIN_LENGTH}`);
    // }
    //
    // if (description.length > DESCRIPTION_MAX_LENGTH) {
    //   errors.push(`Text exceeds the maximum length of ${DESCRIPTION_MAX_LENGTH}`);
    // }

    this.setState({ errors });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        <h2>Resolution Source</h2>
        <label htmlFor="expiry_generic">
          <input
            id="expiry_generic"
            value={EXPIRY_SOURCE_GENERIC}
            type="radio"
            checked={p.expirySourceType === EXPIRY_SOURCE_GENERIC}
            onChange={() => p.updateNewMarket({
              expirySourceType: EXPIRY_SOURCE_GENERIC,
              expirySource: ''
            })}
          />
          Outcome will be covered by local, national or international news media.
        </label>
        <label htmlFor="expiry_specific">
          <input
            id="expiry_specific"
            value={EXPIRY_SOURCE_SPECIFIC}
            type="radio"
            checked={p.expirySourceType === EXPIRY_SOURCE_SPECIFIC}
            onChange={() => p.updateNewMarket({
              expirySourceType: EXPIRY_SOURCE_SPECIFIC,
              expirySource: ''
            })}
          />
          Outcome will be detailed on a specific publicly available website:
        </label>
        <Input
          className={classNames({ 'hide-field': p.expirySourceType !== EXPIRY_SOURCE_SPECIFIC })}
          type="text"
          value={p.expirySource}
          onChange={expirySource => p.updateNewMarket({ expirySource })}
        />
        <CreateMarketFormErrors
          errors={s.errors}
        />
      </article>
    );
  }
}

CreateMarketFormExpirySource.propTypes = {
  expirySourceType: PropTypes.string.isRequired,
  expirySource: PropTypes.string.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
