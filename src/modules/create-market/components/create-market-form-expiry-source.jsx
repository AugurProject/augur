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
      expirySource: '',
      canCheckURL: false
    };

    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.canCheckURL &&
      (this.props.expirySource.length || nextProps.expirySource.length)
    ) {
      this.setState({ canCheckURL: true });
    }
  }

  validateForm(type, expirySource, canCheckURL) {
    const errors = [];

    if (!canCheckURL && type === EXPIRY_SOURCE_SPECIFIC) {
      this.props.updateValidity(false);
    } else if (canCheckURL &&
        type === EXPIRY_SOURCE_SPECIFIC &&
        (expirySource == null || !expirySource.length)
    ) {
      errors.push('Please enter the full URL of the website.');
    } else {
      this.props.updateValidity(true);
    }

    this.setState({ errors });

    if (!errors.length) {
      this.props.updateNewMarket({ expirySource });
    } else {
      this.props.updateNewMarket({ expirySource: '' });
      this.props.updateValidity(false);
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className={`create-market-form-part create-market-form-part-expiry-source ${p.className || ''}`}>
        <div className="create-market-form-part-content">
          <aside>
            <h3>Expiration Source</h3>
            <span>Where will reporters and traders be able to learn more details about the resolution of this market?</span>
          </aside>
          <div className="vertical-form-divider" />
          <form className="">
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
                  this.validateForm(EXPIRY_SOURCE_GENERIC, s.expirySource);
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
                  this.validateForm(EXPIRY_SOURCE_SPECIFIC, s.expirySource);
                }}
              />
              Outcome will be detailed on a specific publicly available website:
            </label>
            <Input
              className={classNames({ 'hide-field': p.expirySourceType !== EXPIRY_SOURCE_SPECIFIC })}
              type="text"
              value={s.expirySource}
              onChange={(expirySource) => {
                this.setState({ expirySource });
                this.validateForm(p.expirySourceType, expirySource, true);
              }}
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
