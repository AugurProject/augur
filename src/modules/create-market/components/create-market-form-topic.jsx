import React, { Component, PropTypes } from 'react';

import Input from 'modules/common/components/input';
import CreateMarketFormErrors from 'modules/create-market/components/create-market-form-errors';

import { TAGS_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints';

export default class CreateMarketFormTopic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.topic !== nextProps.topic) this.validateForm(nextProps.topic);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.errors !== nextState.errors) nextProps.updateValidity(!nextState.errors.length);
  }

  validateForm(topic) {
    const errors = [];

    if (!topic || !topic.length) {
      errors.push('Please enter a topic.');
    }

    if (topic.length > TAGS_MAX_LENGTH) {
      errors.push(`Topic exceeds the maximum length of ${TAGS_MAX_LENGTH}`);
    }

    this.setState({ errors });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        <h2>Topic</h2>
        <Input
          type="text"
          value={p.topic}
          maxLength={TAGS_MAX_LENGTH}
          onChange={topic => p.updateNewMarket({ topic })}
        />
        <CreateMarketFormErrors
          errors={s.errors}
        />
      </article>
    );
  }
}

CreateMarketFormTopic.propTypes = {
  topic: PropTypes.string.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
