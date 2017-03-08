import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';
import ReactHighcharts from 'react-highcharts';

import ComponentNav from 'modules/common/components/component-nav';
import Input from 'modules/common/components/input';
// import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import { NEW_MARKET_ORDER_BOOK } from 'modules/create-market/constants/new-market-creation-steps';
import { BID, ASK } from 'modules/transactions/constants/types';
import { CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';

export default class CreateMarketFormOrderBook extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    currentStep: PropTypes.number.isRequired,
    outcomes: PropTypes.array.isRequired,
    orderBook: PropTypes.object.isRequired,
    scalarBigNum: PropTypes.string.isRequired,
    scalarSmallNum: PropTypes.string.isRequired,
    updateValidity: PropTypes.func.isRequired,
    addOrderToNewMarket: PropTypes.func.isRequired,
    removeOrderFromNewMarket: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  }

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
      errors: {
        quantity: [],
        price: []
      },
      isOrderValid: false,
      selectedOutcome: props.outcomes[0],
      selectedNav: Object.keys(this.navItems)[0],
      orderPrice: '',
      orderQuantity: '',
      orderBookSorted: {}, // Used in Order Book Table
      orderBookSeries: {} // Used in Order Book Chart
    };

    this.handleAddOrder = this.handleAddOrder.bind(this);
    // this.handleRemoveOrder = this.handleRemoveOrder.bind(this);
    this.updateSeries = this.updateSeries.bind(this);
    this.sortOrderBook = this.sortOrderBook.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep &&
      newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_ORDER_BOOK
    ) {
      nextProps.updateValidity(true);
    }

    if (this.props.outcomes !== nextProps.outcomes) this.setState({ selectedOutcome: nextProps.outcomes[0] });
    if (this.props.orderBook !== nextProps.orderBook) this.sortOrderBook(nextProps.orderBook);
  }

  handleAddOrder() {
    this.setState({ orderPrice: '', orderQuantity: '' }); // Clear Inputs
    // TODO -- refocus first input

    this.props.addOrderToNewMarket({
      outcome: this.state.selectedOutcome,
      type: this.state.selectedNav,
      price: this.state.orderPrice,
      quantity: this.state.orderQuantity
    });
  }

  // handleRemoveOrder() {
  //   // TODO
  // }

  sortOrderBook(orderBook) {
    const orderBookSorted = Object.keys(orderBook).reduce((p, outcome) => {
      if (p[outcome] == null) p[outcome] = {};

      // Filter Orders By Type
      orderBook[outcome].forEach((order) => {
        if (p[outcome][order.type] == null) p[outcome][order.type] = [];
        p[outcome][order.type].push({ price: order.price, quantity: order.quantity });
      });

      // Sort Order By Price
      Object.keys(p[outcome]).forEach((type) => {
        if (type === BID) p[outcome][type] = p[outcome][type].sort((a, b) => a.price - b.price);
        if (type === ASK) p[outcome][type] = p[outcome][type].sort((a, b) => b.price - a.price);
      });

      return p;
    }, {});

    this.setState({ orderBookSorted });
  }

  updateSeries(orderBook) {
    const orderBookSeries = Object.keys(orderBook).reduce((p, outcome) => {
      if (p[outcome] == null) p[outcome] = {};

      Object.keys(orderBook[outcome]).forEach((type) => {
        if (p[outcome][type] == null) p[outcome][type] = [];

        let totalQuantity = orderBook[outcome][type].reduce((p, order) => p + order.quantity, 0);

        orderBook[outcome][type].forEach((order) => {
          p[outcome][type].push([order.price, totalQuantity]);
          totalQuantity -= order.quantity;
        });
      });

      return p;
    }, {});

    this.setState({ orderBookSeries });
  }

  validateForm(orderQuantityRaw = this.state.orderQuantity, orderPriceRaw = this.state.orderPrice) {
    console.log('### validateFrom -- ', orderQuantityRaw, orderPriceRaw);

    let orderQuantity = orderQuantityRaw instanceof BigNumber ? orderQuantityRaw.toNumber() : parseFloat(orderQuantityRaw || 0);
    let orderPrice = orderPriceRaw instanceof BigNumber ? orderPriceRaw.toNumber() : parseFloat(orderPriceRaw || 0);

    const errors = {
      quantity: [],
      price: []
    };
    let isOrderValid;

    // Basic Validations
    if (orderQuantityRaw === '') {
      orderQuantity = '';
      isOrderValid = false;
    }
    if (orderPriceRaw === '') {
      orderPrice = '';
      isOrderValid = false;
    }

    // Validate Quantity
    if (orderQuantity !== '' && orderQuantity <= 0) {
      errors.quantity.push('Quantity must be positive');
    }

    // Validate Price
    if (orderPrice !== '') {
      const bids = getValue(this.state.orderBookSorted[this.state.selectedOutcome], `${BID}`);
      const asks = getValue(this.state.orderBookSorted[this.state.selectedOutcome], `${ASK}`);

      console.log(bids, asks);

      if (this.props.type !== SCALAR) {
        if (orderPrice > 1) {
          errors.price.push('Price cannot exceed 1');
        } else if (orderPrice < 0) {
          errors.price.push('Price cannot be below 0');
        } else if (this.state.selectedNav === BID && asks && asks.length && orderPrice > asks[0].price) {
          errors.price.push(`Price must be less than best ask price of: ${asks[0].price}`);
        } else if (this.state.selectedNav === ASK && bids && bids.length && orderPrice < bids[0].price) {
          errors.price.push(`Price must be greater than best bid price of: ${bids[0].price}`);
        }
      } else {
        // TODO
      }
    }

    this.setState({
      errors,
      isOrderValid,
      orderQuantity,
      orderPrice
    });
  }

  render() {
    const p = this.props;
    const s = this.state;

    const bidSeries = getValue(s.orderBookSeries[s.selectedOutcome], `${BID}`);
    const askSeries = getValue(s.orderBookSeries[s.selectedOutcome], `${ASK}`);
    const bids = getValue(s.orderBookSorted[s.selectedOutcome], `${BID}`);
    const asks = getValue(s.orderBookSorted[s.selectedOutcome], `${ASK}`);

    return (
      <article className={`create-market-form-part create-market-form-order-book ${p.className || ''}`}>
        <div className="create-market-form-part-content">
          <div className="create-market-form-part-input">
            <aside>
              <h3>Initial Liquidity</h3>
              <h4>Optional</h4>
              <span>Use this form to add initial liquidty for your market.</span>
            </aside>
            <div className="vertical-form-divider" />
            <form onSubmit={e => e.preventDefault()} >
              <div className="order-book-actions">
                {p.type === CATEGORICAL &&
                  <div className="order-book-outcomes-table">
                    <div className="order-book-outcomes-header">
                      <span>Outcomes</span>
                    </div>
                    <div className="order-book-outcomes">
                      {p.outcomes.map(outcome => (
                        <div
                          key={outcome}
                          className={`order-book-outcome-row ${s.selectedOutcome === outcome ? 'selected' : ''}`}
                        >
                          <button
                            className="unstyled"
                            onClick={() => {
                              this.setState({ selectedOutcome: outcome });
                            }}
                          >
                            <span>{outcome}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                }
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
                        className={classNames({ 'input-error': s.errors.quantity.length })}
                        type="number"
                        placeholder="Quantity"
                        value={s.orderQuantity}
                        isIncrementable
                        incrementAmount={0.1}
                        updateValue={quantity => this.validateForm(quantity, undefined)}
                        onChange={quantity => this.validateForm(quantity, undefined)}
                      />
                      <span>@</span>
                      <Input
                        className={classNames({ 'input-error': s.errors.price.length })}
                        type="number"
                        placeholder="Price"
                        value={s.orderPrice}
                        isIncrementable
                        incrementAmount={0.1}
                        updateValue={price => this.validateForm(undefined, price)}
                        onChange={price => this.validateForm(undefined, price)}
                      />
                    </div>
                    <button
                      className={classNames({ disabled: !s.isOrderValid })}
                      onClick={s.isOrderValid && this.handleAddOrder}
                    >
                      Add Order
                    </button>
                  </div>
                </div>
              </div>
              <div className="order-book-preview">
                <ReactHighcharts
                  className="order-book-preview-chart"
                  config={{
                    title: {
                      text: `${s.selectedOutcome}: Depth Chart`
                    },
                    series: [
                      {
                        type: 'line',
                        name: 'Bids',
                        step: 'right',
                        data: bidSeries
                      },
                      {
                        type: 'line',
                        name: 'Asks',
                        step: 'right',
                        data: askSeries
                      }
                    ],
                    yAxis: {
                      title: {
                        text: 'Shares'
                      }
                    },
                    xAxis: {
                      title: {
                        text: 'Price'
                      }
                    },
                    credits: {
                      enabled: false
                    }
                  }}
                />
                <div className="order-book-preview-table">
                  <div className="order-book-preview-table-header">
                    <span>Bid Q.</span>
                    <span>Bid</span>
                    <span>Ask</span>
                    <span>Ask Q.</span>
                  </div>
                  <div className="order-book-preview-table-content">
                    <ul className="order-book-preview-table-bids">
                      {bids ?
                        bids.map(bid => <li><span>{`${bid.quantity}`}</span><span>{`${bid.price}`}</span></li>) :
                        <span>No Bids</span>
                      }
                    </ul>
                    <ul className="order-book-preview-table-asks">
                      {asks ?
                        asks.map(ask => <li><span>{`${ask.price}`}</span><span>{`${ask.quantity}`}</span></li>) :
                        <span>No Asks</span>
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </article>
    );
  }
}
