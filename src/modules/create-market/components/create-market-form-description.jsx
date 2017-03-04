import React, { Component, PropTypes } from 'react';

import Input from 'modules/common/components/input';
import CreateMarketFormErrors from 'modules/create-market/components/create-market-form-errors';

import { DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints';

export default class CreateMarketFormDescription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.description !== nextProps.description) this.validateForm(nextProps.description);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.errors !== nextState.errors) nextProps.updateValidity(!nextState.errors.length);
  }

  validateForm(description) {
    const errors = [];

    if (!description || !description.length) {
      errors.push('Please enter your question');
    }

    if (description.length < DESCRIPTION_MIN_LENGTH) {
      errors.push(`Text must be a minimum length of ${DESCRIPTION_MIN_LENGTH}`);
    }

    if (description.length > DESCRIPTION_MAX_LENGTH) {
      errors.push(`Text exceeds the maximum length of ${DESCRIPTION_MAX_LENGTH}`);
    }

    this.setState({ errors });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        <div className="form-part-content">
          <h2>Description</h2>
          <Input
            type="text"
            value={p.description}
            maxLength={DESCRIPTION_MAX_LENGTH}
            onChange={description => p.updateNewMarket({ description })}
          />
          <CreateMarketFormErrors
            errors={s.errors}
          />
        </div>
      </article>
    );
  }
}

CreateMarketFormDescription.propTypes = {
  description: PropTypes.string.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
