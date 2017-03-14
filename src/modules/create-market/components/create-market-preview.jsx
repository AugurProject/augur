import React, { PropTypes, Component } from 'react';
import BigNumber from 'bignumber.js';
import Highcharts from 'highcharts';
import classNames from 'classnames';

import { EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC } from 'modules/create-market/constants/new-market-constraints';
import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import {
  NEW_MARKET_DESCRIPTION,
  NEW_MARKET_OUTCOMES,
  NEW_MARKET_EXPIRY_SOURCE,
  NEW_MARKET_END_DATE,
  NEW_MARKET_DETAILS,
  NEW_MARKET_TOPIC,
  NEW_MARKET_KEYWORDS,
  NEW_MARKET_FEES,
  NEW_MARKET_ORDER_BOOK,
  NEW_MARKET_REVIEW
} from 'modules/create-market/constants/new-market-creation-steps';
import { BINARY, CATEGORICAL } from 'modules/markets/constants/market-types';
import { BID, ASK } from 'modules/transactions/constants/types';

import getValue from 'utils/get-value';
import debounce from 'utils/debounce';


// NOTE --  Discrete component due to vastly different functionality as compared to `market-preview.jsx`
export default class CreateMarketPreview extends Component {
  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      previousStep: null,
      initialLiquidity: null,
      selectedOutcome: props.newMarket.outcomes[0],
      shouldUpdateHeight: false
    };

    this.shouldUpdateHeight = debounce(this.shouldUpdateHeight.bind(this));
    this.updatePreviewHeight = debounce(this.updatePreviewHeight.bind(this));
    this.updateChart = debounce(this.updateChart.bind(this));
  }

  componentDidMount() {
    this.updatePreviewHeight(this.props.newMarket.currentStep);

    this.orderBookPreviewChart = new Highcharts.Chart('order_book_preview_chart_preview', {
      chart: {
        width: 0,
        height: 0
      },
      lang: {
        noData: 'No orders to display'
      },
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
      series: [
        {
          type: 'line',
          name: 'Bids',
          step: 'left',
          data: []
        },
        {
          type: 'line',
          name: 'Asks',
          step: 'left',
          data: []
        }
      ],
      credits: {
        enabled: false
      }
    });

    window.addEventListener('resize', () => {
      this.shouldUpdateHeight(true);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.newMarket.currentStep !== nextProps.newMarket.currentStep) this.setState({ previousStep: this.props.newMarket.currentStep });

    if (this.props.newMarket !== nextProps.newMarket) {
      this.updatePreviewHeight(nextProps.newMarket.currentStep);
    }

    if (this.props.newMarket.orderBook !== nextProps.newMarket.orderBook) this.updateMarketLiquidity(nextProps.newMarket.orderBook);
    if (this.props.newMarket.outcomes !== nextProps.newMarket.outcomes) this.setState({ selectedOutcome: nextProps.newMarket.outcomes[0] });
    if (this.props.newMarket.orderBookSeries !== nextProps.newMarket.orderBookSeries) this.updateChart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.shouldUpdateHeight && prevState.shouldUpdateHeight !== this.state.shouldUpdateHeight) {
      this.updatePreviewHeight(this.props.newMarket.currentStep);
      this.updateChart();
      this.shouldUpdateHeight(false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePreviewHeight);
  }

  updatePreviewHeight(step) {
    let newHeight = 0;
    if (step && step !== 0) newHeight = this.marketPreview.getElementsByClassName('create-market-preview-content')[0].clientHeight + 13; // + value to accomodate padding + borders

    if (step === 0 || this.state.previousStep !== 0) {
      this.marketPreview.style.height = `${newHeight}px`;
    } else {
      setTimeout(() => {
        this.marketPreview.style.height = `${newHeight}px`;
      }, 1500);
    }
  }

  updateChart() {
    const bidSeries = getValue(this.props.newMarket.orderBookSeries[this.state.selectedOutcome], `${BID}`) || [];
    const askSeries = getValue(this.props.newMarket.orderBookSeries[this.state.selectedOutcome], `${ASK}`) || [];
    let width;

    if (window.getComputedStyle(this.orderBookChart).getPropertyValue('will-change') === 'contents') {
      width = this.orderBookPreview.clientWidth - 40; // 20px horizontal padding
    } else {
      width = this.orderBookPreview.clientWidth * 0.60;
    }

    this.orderBookPreviewChart.update({
      title: {
        text: `${this.state.selectedOutcome}: Depth Chart`
      },
      chart: {
        width,
        height: 300
      }
    }, false);

    this.orderBookPreviewChart.series[0].setData(bidSeries, false);
    this.orderBookPreviewChart.series[1].setData(askSeries, false);

    this.orderBookPreviewChart.redraw();
  }

  updateMarketLiquidity(orderBook) {
    const initialLiquidity = Object.keys(orderBook).reduce((p, outcome) => p.plus(orderBook[outcome].reduce((p, order) => p.plus(order.quantity.times(order.price)), new BigNumber(0))), new BigNumber(0)).toNumber().toLocaleString();

    this.setState({ initialLiquidity });
  }

  shouldUpdateHeight(shouldUpdateHeight) {
    this.setState({ shouldUpdateHeight });
  }

  render() {
    const p = this.props;
    const s = this.state;
    const newMarket = this.props.newMarket;

    const bids = getValue(newMarket.orderBookSorted[s.selectedOutcome], `${BID}`);
    const asks = getValue(newMarket.orderBookSorted[s.selectedOutcome], `${ASK}`);

    return (
      <article
        ref={(marketPreview) => { this.marketPreview = marketPreview; }}
        className={classNames('create-market-preview', {
          'preview-is-visible': newMarket.currentStep > 0,
          'preview-is-hidden': newMarket.currentStep === 0
        })}
      >
        <div className="create-market-preview-container">
          <div className="create-market-preview-content">
            <div className="create-market-details">
              <ul className="create-market-tags">
                <li
                  className={classNames('prop-container create-market-tag', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_TOPIC,
                    'is-null': !newMarket.topic,
                    'has-value': !!newMarket.topic
                  })}
                >
                  <button
                    className="unstyled"
                    onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_TOPIC) })}
                  >
                    <span className="null-mask" />
                    <span className="prop-value">{newMarket.topic || '\u00a0'}</span>
                  </button>
                </li>
                <li>
                  <button
                    className={classNames('unstyled prop-container create-market-keywords', {
                      'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_KEYWORDS
                    })}
                    onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_KEYWORDS) })}
                  >
                    <ul>
                      <li
                        className={classNames('prop-container create-market-tag', {
                          'is-null': !(newMarket.keywords && newMarket.keywords[0]),
                          'is-unused': !(newMarket.keywords && newMarket.keywords[0]) && newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_REVIEW,
                          'has-value': newMarket.keywords && !!newMarket.keywords[0]
                        })}
                      >
                        <span className="null-mask" />
                        <span className="prop-value">{(newMarket.keywords && newMarket.keywords[0]) || '\u00a0'}</span>
                      </li>
                      <li
                        className={classNames('prop-container create-market-tag', {
                          'is-null': !(newMarket.keywords && newMarket.keywords[1]),
                          'is-unused': !(newMarket.keywords && newMarket.keywords[1]) && newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_REVIEW,
                          'has-value': newMarket.keywords && !!newMarket.keywords[1]
                        })}
                      >
                        <span className="null-mask" />
                        <span className="prop-value">{(newMarket.keywords && newMarket.keywords[1]) || '\u00a0'}</span>
                      </li>
                    </ul>
                  </button>
                </li>
              </ul>
              <div
                className={classNames('prop-container create-market-description', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_DESCRIPTION,
                  'is-null': !newMarket.description,
                  'has-value': !!newMarket.description
                })}
              >
                <button
                  className="unstyled"
                  onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_DESCRIPTION) })}
                >
                  <span className="null-mask" />
                  <span className="prop-value">{newMarket.description || '\u00a0'}</span>
                </button>
              </div>
              <span
                className={classNames('prop-container create-market-expiry-source', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_EXPIRY_SOURCE,
                  'is-null': !newMarket.expirySource && (newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC || !newMarket.expirySourceType),
                  'has-value': newMarket.expirySourceType === EXPIRY_SOURCE_GENERIC || (newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC && !!newMarket.expirySource)
                })}
              >
                <button
                  className="unstyled"
                  onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_EXPIRY_SOURCE) })}
                >
                  <span className="null-mask" />
                  <span className="prop-value">
                    {newMarket.expirySourceType === EXPIRY_SOURCE_GENERIC && <span>Source: <span className="market-property-value"> News Media</span></span>}
                    {newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC && !!newMarket.expirySource && <span>Source: <span className="market-property-value">{newMarket.expirySource}</span></span>}
                    { newMarket.expirySourceType !== EXPIRY_SOURCE_GENERIC &&
                      !(newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC &&
                      !!newMarket.expirySource) &&
                      '\u00a0'
                    }
                  </span>
                </button>
              </span>
              <span
                className={classNames('prop-container create-market-details', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_DETAILS,
                  'is-null': !newMarket.detailsText,
                  'is-unused': !newMarket.detailsText && newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_REVIEW,
                  'has-value': !!newMarket.detailsText
                })}
              >
                <button
                  className="unstyled"
                  onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_DETAILS) })}
                >
                  <span className="null-mask" />
                  <span className="prop-value">{(!!newMarket.detailsText && <span>Additional Details: <span className="market-property-value">{newMarket.detailsText}</span></span>) || '\u00a0'}</span>
                </button>
              </span>
              <ul className="create-market-properties">
                <li
                  className={classNames('prop-container create-market-property', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_END_DATE,
                    'is-null': !Object.keys(newMarket.endDate).length,
                    'has-value': !!Object.keys(newMarket.endDate).length
                  })}
                >
                  <button
                    className="unstyled"
                    onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_END_DATE) })}
                  >
                    <span className="null-mask" />
                    <span className="prop-value">{(!!Object.keys(newMarket.endDate).length && <span>Ends: <span className="market-property-value">{newMarket.endDate.formatted}</span></span>) || '\u00a0'}</span>
                  </button>
                </li>
                <li>
                  <button
                    className={classNames('unstyled prop-container create-market-property create-market-property-fees', {
                      'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_FEES
                    })}
                    onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_FEES) })}
                  >
                    <ul>
                      <li
                        className={classNames('prop-container', {
                          'is-null': !newMarket.makerFee || newMarket.validations.indexOf(NEW_MARKET_FEES) === -1,
                          'has-value': newMarket.makerFee && (newMarket.validations.indexOf(NEW_MARKET_FEES) > -1 || newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_FEES)
                        })}
                      >
                        <span className="null-mask" />
                        <span className="prop-value">{(newMarket.makerFee && (newMarket.validations.indexOf(NEW_MARKET_FEES) > -1 || newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_FEES) && <span>Maker Fee: <span className="market-property-value">{newMarket.makerFee}%</span></span>) || '\u00a0'}</span>
                      </li>
                      <li
                        className={classNames('prop-container', {
                          'is-null': !newMarket.takerFee || newMarket.validations.indexOf(NEW_MARKET_FEES) === -1,
                          'has-value': newMarket.takerFee && (newMarket.validations.indexOf(NEW_MARKET_FEES) > -1 || newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_FEES)
                        })}
                      >
                        <span className="null-mask" />
                        <span className="prop-value">{(newMarket.takerFee && (newMarket.validations.indexOf(NEW_MARKET_FEES) > -1 || newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_FEES) && <span>Taker Fee: <span className="market-property-value">{newMarket.takerFee}%</span></span>) || '\u00a0'}</span>
                      </li>
                    </ul>
                  </button>
                </li>
                <li
                  className={classNames('prop-container create-market-property', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_ORDER_BOOK,
                    'is-null': !Object.keys(newMarket.orderBook).length,
                    'is-unused': !Object.keys(newMarket.orderBook).length && newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_REVIEW,
                    'has-value': !!Object.keys(newMarket.orderBook).length
                  })}
                >
                  <button
                    className="unstyled"
                    onClick={() => p.newMarket.validations.indexOf(NEW_MARKET_OUTCOMES) !== -1 && p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_ORDER_BOOK) })}
                  >
                    <span className="null-mask" />
                    <span className="prop-value">{(Object.keys(newMarket.orderBook).length && s.initialLiquidity != null && <span>Initial Liquidity: <span className="market-property-value">{s.initialLiquidity} Eth</span></span>) || '\u00a0'}</span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="create-market-outcomes">
              <ul
                className={classNames('prop-container create-market-outcome-list', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_OUTCOMES,
                  'is-null': !newMarket.outcomes.length || newMarket.outcomes[0] === '',
                  'has-value': newMarket.outcomes.length && newMarket.outcomes[0] !== ''
                })}
              >
                <button
                  className="unstyled"
                  onClick={() => newMarket.type !== BINARY && p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_OUTCOMES) })}
                >
                  <div className="outcome-null-masks">
                    {newMarket.type === CATEGORICAL ?
                      <div className="null-outcomes">
                        <li className="null-mask" />
                        <li className="null-mask" />
                        <li className="null-mask" />
                        <li className="null-mask" />
                      </div> :
                      <div className="null-outcomes">
                        <li className="null-mask" />
                      </div>
                    }
                  </div>
                  {newMarket.outcomes.map(outcome => <li>{outcome}</li>)}
                </button>
              </ul>
            </div>
            <div
              ref={(initialLiquidityPreview) => { this.initialLiquidityPreview = initialLiquidityPreview; }}
              className={classNames('create-market-initial-liquidity', {
                'reveal-initial-liquidity': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_REVIEW && s.initialLiquidity != null,
                'hide-initial-liquidity': newMarketCreationOrder[newMarket.currentStep] !== NEW_MARKET_REVIEW || s.initialLiquidity == null,
              })}
            >
              {newMarket.type === CATEGORICAL &&
                <div className="order-book-outcomes-table">
                  <div className="order-book-outcomes-header">
                    <span>Outcomes</span>
                  </div>
                  <div className="order-book-outcomes">
                    {newMarket.outcomes.map(outcome => (
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
              <div
                ref={(orderBookPreview) => { this.orderBookPreview = orderBookPreview; }}
                className="create-market-initial-liquidity-preview order-book-preview"
              >
                <div
                  ref={(orderBookChart) => { this.orderBookChart = orderBookChart; }}
                  id="order_book_preview_chart_preview"
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
                        bids.map((bid, i) => <li>
                          <span>
                            {`${bid.quantity}`}
                          </span>
                          <span>
                            {`${bid.price}`}
                          </span>
                        </li>
                      ) :
                        <span>No Bids</span>
                      }
                    </ul>
                    <ul className="order-book-preview-table-asks">
                      {asks ?
                        asks.map((ask, i) =>
                          <li>
                            <span>
                              {`${ask.price}`}
                            </span>
                            <span>
                              {`${ask.quantity}`}
                            </span>
                          </li>
                        ) :
                        <span>No Asks</span>
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }
}
