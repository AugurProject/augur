import React, { Component, PropTypes } from 'react';

import Input from 'modules/common/components/input';
import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import { NEW_MARKET_TOPIC } from 'modules/create-market/constants/new-market-creation-steps';
import { TAGS_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints';

export default class CreateMarketFormTopic extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    topic: PropTypes.string.isRequired,
    updateValidity: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      warnings: []
    };

    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep && nextProps.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_TOPIC)) this.validateForm(nextProps.topic);
  }

  validateForm(topic = '') {
    const warnings = [];

    // Error Check
    if (!topic.length) {
      this.props.updateValidity(false);
    } else {
      this.props.updateValidity(true);
    }

    // Warnings Check
    if (topic.length === TAGS_MAX_LENGTH) warnings.push(`Maximum tag length is: ${TAGS_MAX_LENGTH}`);

    this.props.updateNewMarket({ topic });

    this.setState({ warnings });
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
                value={p.topic}
                maxLength={TAGS_MAX_LENGTH}
                onChange={topic => this.validateForm(topic)}
              />
              <CreateMarketFormInputNotifications
                warnings={s.warnings}
              />
            </form>
          </div>
        </div>
      </article>
    );
  }
}
