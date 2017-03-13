import React, { PropTypes, Component } from 'react';
import BigNumber from 'bignumber.js';
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


// NOTE --  Discrete component due to vastly different functionality as compared to `market-preview.jsx`
export default class CreateMarketPreview extends Component {
  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      initialLiquidity: null
    };

    this.updatePreviewHeight = this.updatePreviewHeight.bind(this);
  }

  componentDidMount() {
    this.updatePreviewHeight();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.newMarket !== nextProps.newMarket) {
      this.updatePreviewHeight(nextProps.newMarket.currentStep);
    }

    if (this.props.newMarket.orderBook !== nextProps.newMarket.orderBook) this.updateMarketLiquidity(nextProps.newMarket.orderBook);
  }

  updatePreviewHeight(step) {
    let newHeight = 0;
    if (step && step !== 0) newHeight = this.marketPreview.getElementsByClassName('create-market-preview-content')[0].clientHeight + 13; // 2 for horizontal borders

    if (step === 0) {
      this.marketPreview.style.height = `${newHeight}px`;
    } else {
      setTimeout(() => {
        this.marketPreview.style.height = `${newHeight}px`;
      }, 1500);
    }
  }

  updateMarketLiquidity(orderBook) {
    const initialLiquidity = Object.keys(orderBook).reduce((p, outcome) => p.plus(orderBook[outcome].reduce((p, order) => p.plus(order.quantity.times(order.price)), new BigNumber(0))), new BigNumber(0)).toNumber().toLocaleString();

    this.setState({ initialLiquidity });
  }

  render() {
    const p = this.props;
    const s = this.state;
    const newMarket = this.props.newMarket;

    console.log('newMarket.takerFee -- ', newMarket.takerFee, newMarket.makerFee);

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
                <button
                  className={classNames('unstyled prop-container create-market-keywords', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_KEYWORDS
                  })}
                  onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_KEYWORDS) })}
                >
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
                </button>
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
                <button
                  className={classNames('unstyled prop-container create-market-property create-market-property-fees', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_FEES
                  })}
                  onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_FEES) })}
                >
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
                </button>
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
          </div>
        </div>
      </article>
    );
  }
}
