import React, { Component } from 'react';

export default class CreateMarketFormDescription extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const p = this.props;

    return (
      <article
        className={`create-market-form-part ${p.className || ''}`}
      >
        <h2>Description</h2>
        <div className="input-container">
          <h3>What do you want to ask?</h3>
            <Input
              type="text"
              value={p.description}
              placeholder={p.descriptionPlaceholder}
              maxLength={p.descriptionMaxLength}
              onChange={value => p.onValuesUpdated({ description: value })}
            />
        </div>
      </article>
    );
  }
}
