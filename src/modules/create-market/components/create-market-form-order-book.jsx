import React, { Component, PropTypes } from 'react';
import BigNumber from 'bignumber.js';

import ComponentNav from 'modules/common/components/component-nav';
import Input from 'modules/common/components/input';
import CreateMarketFormErrors from 'modules/create-market/components/create-market-form-errors';

import { BID, ASK } from 'modules/transactions/constants/types';

export default class CreateMarketFormOrderBook extends Component {
  constructor(props) {
    super(props);

    this.navItems = {
      [BID]: {
        label: 'Bid'
      },
      [ASK]: {
        label: 'Ask'
      }
    };

    this.state = {
      errors: [],
      selectedOutcome: props.outcomes[0],
      selectedNav: Object.keys(this.navItems)[0],
      orderPrice: '',
      orderQuantity: ''
    };

    this.handleOrderPriceUpdate = this.handleOrderPriceUpdate.bind(this);
    this.handleOrderQuantityUpdate = this.handleOrderQuantityUpdate.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.outcomes !== nextProps.outcomes) this.setState({ selectedOutcome: nextProps.outcomes[0] });
    // if (this.props.description !== nextProps.description) this.validateForm(nextProps.description);
  }

  componentWillUpdate(nextProps, nextState) {
    // if (this.state.errors !== nextState.errors) nextProps.updateValidity(!nextState.errors.length);
  }

  handleOrderPriceUpdate(orderPriceRaw) {
    const orderPrice = orderPriceRaw instanceof BigNumber ? orderPriceRaw.toNumber() : parseFloat(orderPriceRaw);

    // TODO -- handle validation
    this.setState({ orderPrice });
  }

  handleOrderQuantityUpdate(orderQuantityRaw) {
    const orderQuantity = orderQuantityRaw instanceof BigNumber ? orderQuantityRaw.toNumber() : parseFloat(orderQuantityRaw);

    // TODO -- handle validation
    this.setState({ orderQuantity });
  }

  validateForm(orderBook) {
    const errors = [];

    if (Object.keys(orderBook).length) {
      // TODO -- validate new orders
    }

    this.setState({ errors });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className={`create-market-form-part create-market-form-order-book ${p.className || ''}`}>
        <h2>Order Book</h2>
        <div className="order-book-actions">
          <div className="order-book-outcomes-table">
            <div className="order-book-outcomes-header">
              <span>Outcomes</span>
            </div>
            <div className="order-book-outcomes">
              {p.outcomes.map((outcome) => {
                return (
                  <div
                    key={outcome}
                    className={`order-book-outcome-row ${s.selectedOutcome === outcome ? 'selected' : ''}`}
                  >
                    <button className="unstyled">
                      <span>{outcome}</span>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="order-book-entry-container">
            <div className="order-book-entry">
              <ComponentNav
                fullWidth
                navItems={this.navItems}
                selectedNav={s.selectedNav}
                updateSelectedNav={selectedNav => this.setState({ selectedNav })}
              />
              <div className="order-book-entry-inputs">
                <Input
                  type="number"
                  placeholder="Price"
                  value={s.orderPrice}
                  isIncrementable
                  incrementAmount={0.1}
                  updateValue={this.handleOrderPriceUpdate}
                  onChange={this.handleOrderPriceUpdate}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={s.orderQuantity}
                  isIncrementable
                  incrementAmount={0.1}
                  updateValue={this.handleOrderQuantityUpdate}
                  onChange={this.handleOrderQuantityUpdate}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="order-book-preview">
          <div className="order-book-entry-preview-chart">

          </div>
          <div className="order-book-entry-preview-table">

          </div>
        </div>
      </article>
    );
  }
}

CreateMarketFormOrderBook.propTypes = {
  outcomes: PropTypes.array.isRequired,
  orderBook: PropTypes.object.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};

// <CreateMarketFormErrors
//   errors={s.errors}
// />
