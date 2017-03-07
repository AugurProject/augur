import React, { Component, PropTypes } from 'react';

import Input from 'modules/common/components/input';
import CreateMarketFormErrors from 'modules/create-market/components/create-market-form-errors';

import { DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints';

export default class CreateMarketFormDescription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      description: this.props.description
    };

    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.description !== nextProps.description) this.setState({ description: nextProps.description });
  }

  validateForm(description) {
    const errors = [];

    if (!description || !description.length) {
      errors.push('Please enter your question');
    } else if (description.length < DESCRIPTION_MIN_LENGTH) {
      errors.push(`Text must be a minimum length of ${DESCRIPTION_MIN_LENGTH}`);
    } else if (description.length > DESCRIPTION_MAX_LENGTH) {
      errors.push(`Text exceeds the maximum length of ${DESCRIPTION_MAX_LENGTH}`);
    } else {
      this.props.updateValidity(true);
    }

    if (!errors.length) {
      this.props.updateNewMarket({ description });
    } else {
      this.props.updateNewMarket({ description: '' });
      this.props.updateValidity(false);
    }

    this.setState({ errors });
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
              <CreateMarketFormErrors
                errors={s.errors}
              />
            </form>
          </div>
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
