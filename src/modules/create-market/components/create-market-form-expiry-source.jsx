import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Input from 'modules/common/components/input';
import CreateMarketFormErrors from 'modules/create-market/components/create-market-form-errors';

import { EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC } from 'modules/create-market/constants/new-market-constraints';

export default class CreateMarketFormExpirySource extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      canCheckURL: false
    };

    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.expirySourceType !== nextProps.expirySourceType ||
        (nextProps.expirySourceType === EXPIRY_SOURCE_SPECIFIC && this.props.expirySource !== nextProps.expirySource)
    ) {
      this.validateForm(nextProps.expirySourceType, nextProps.expirySource);
    }

    if (!this.state.canCheckURL &&
      (this.props.expirySource.length || nextProps.expirySource.length)
    ) {
      this.setState({ canCheckURL: true });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.errors !== nextState.errors) nextProps.updateValidity(!nextState.errors.length);
  }

  validateForm(type, source) {
    const errors = [];

    if (type == null || !type.length) {
      errors.push('Please choose an expiry source.');
    }

    if (this.state.canCheckURL &&
        type === EXPIRY_SOURCE_SPECIFIC &&
        (source == null || !source.length)
    ) {
      errors.push('Please enter the full URL of the website.');
    }

    this.setState({ errors });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        <div className="create-market-form-part-content">
          <aside>
            <h3>Expiration Source</h3>
            <span>Where will reporters and traders be able to learn about the resolution of this market?</span>
          </aside>
          <div className="vertical-form-divider" />
          <form>
            <label htmlFor="expiry_generic">
              <input
                id="expiry_generic"
                value={EXPIRY_SOURCE_GENERIC}
                type="radio"
                checked={p.expirySourceType === EXPIRY_SOURCE_GENERIC}
                onChange={() => {
                  p.updateNewMarket({
                    expirySourceType: EXPIRY_SOURCE_GENERIC,
                    expirySource: ''
                  });
                  this.setState({ canCheckURL: false });
                }}
              />
              Outcome will be covered by local, national or international news media.
            </label>
            <label htmlFor="expiry_specific">
              <input
                id="expiry_specific"
                value={EXPIRY_SOURCE_SPECIFIC}
                type="radio"
                checked={p.expirySourceType === EXPIRY_SOURCE_SPECIFIC}
                onChange={() => {
                  p.updateNewMarket({
                    expirySourceType: EXPIRY_SOURCE_SPECIFIC,
                    expirySource: ''
                  });
                  this.setState({ canCheckURL: false });
                }}
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
          </form>
        </div>
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
