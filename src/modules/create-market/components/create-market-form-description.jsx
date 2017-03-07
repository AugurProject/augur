import React, { Component, PropTypes } from 'react';

import Input from 'modules/common/components/input';
import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications';

import { DESCRIPTION_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints';

export default class CreateMarketFormDescription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      warnings: [],
      description: this.props.description
    };

    this.validateForm = this.validateForm.bind(this);
  }

  validateForm(description) {
    const errors = [];
    const warnings = [];

    // Error Check
    if (!description || !description.length) {
      this.props.updateValidity(false);
    } else {
      this.props.updateValidity(true);
    }

    // Warning Check
    if (description.length === DESCRIPTION_MAX_LENGTH) {
      warnings.push(`Maximum question length is ${DESCRIPTION_MAX_LENGTH}`);
    }

    if (!errors.length) {
      this.props.updateNewMarket({ description });
    } else {
      this.props.updateNewMarket({ description: '' });
    }

    this.setState({ errors, warnings });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        <div className="create-market-form-part-content">
          <div className="create-market-form-part-input">
            <aside>
              <h3>Event Question</h3>
              <span>This is the question that the market will attempt to answer.</span>
            </aside>
            <div className="vertical-form-divider" />
            <form>
              <Input
                type="text"
                value={s.description}
                maxLength={DESCRIPTION_MAX_LENGTH}
                onChange={(description) => {
                  this.setState({ description });
                  this.validateForm(description);
                }}
              />
              <CreateMarketFormInputNotifications
                errors={s.errors}
                warnings={s.warnings}
              />
            </form>
          </div>
        </div>
      </article>
    );
  }
}

CreateMarketFormDescription.propTypes = {
  isValid: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
