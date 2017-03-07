import React, { Component, PropTypes } from 'react';

import Input from 'modules/common/components/input';
import CreateMarketFormErrors from 'modules/create-market/components/create-market-form-errors';

import { TAGS_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints';

export default class CreateMarketFormTopic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      topic: props.topic
    };

    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.topic !== nextProps.topic) this.setState({ topic: nextProps.topic });
  }

  validateForm(topic) {
    const errors = [];

    if (!topic || !topic.length) {
      errors.push('Please enter a topic.');
    } else {
      this.props.updateValidity(true);
    }

    if (!errors.length) {
      this.props.updateNewMarket({ topic });
    } else {
      this.props.updateNewMarket({ topic: '' });
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
              <h3>Event Topic</h3>
              <span>Specify the general category of the event the market is for.</span>
            </aside>
            <div className="vertical-form-divider" />
            <form>
              <Input
                type="text"
                value={s.topic}
                maxLength={TAGS_MAX_LENGTH}
                onChange={(topic) => {
                  this.setState({ topic });
                  this.validateForm(topic);
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

CreateMarketFormTopic.propTypes = {
  topic: PropTypes.string.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
