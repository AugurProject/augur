import React, { PropTypes, Component } from 'react';
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
import { CATEGORICAL } from 'modules/markets/constants/market-types';


// NOTE --  Discrete component due to vastly different functionality as compared to `market-preview.jsx`
export default class CreateMarketPreview extends Component {
  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.updatePreviewHeight = this.updatePreviewHeight.bind(this);
  }

  componentDidMount() {
    this.updatePreviewHeight();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.newMarket.currentStep !== nextProps.newMarket.currentStep) {
      this.updatePreviewHeight(nextProps.newMarket.currentStep);
    }
  }

  updatePreviewHeight(step) {
    let newHeight = 0;
    if (step && step !== 0) newHeight = this.marketPreview.getElementsByClassName('create-market-preview-content')[0].clientHeight + 3; // 2 for horizontal borders

    if (step === 0) {
      this.marketPreview.style.height = `${newHeight}px`;
    } else {
      setTimeout(() => {
        this.marketPreview.style.height = `${newHeight}px`;
      }, 1500);
    }
  }

  render() {
    const newMarket = this.props.newMarket;

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
                  <span className="null-mask" />
                  <span className="prop-value">{newMarket.topic || '\u00a0'}</span>
                </li>
                <div
                  className={classNames('prop-container create-market-keywords', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_KEYWORDS,
                  })}
                >
                  <li
                    className={classNames('create-market-tag', {
                      'is-null': !(newMarket.keywords && newMarket.keywords[0]),
                      'has-value': newMarket.keywords && !!newMarket.keywords[0]
                    })}
                  >
                    <span className="null-mask" />
                    <span className="prop-value">{(newMarket.keywords && newMarket.keywords[0]) || '\u00a0'}</span>
                  </li>
                  <li
                    className={classNames('create-market-tag', {
                      'is-null': !(newMarket.keywords && newMarket.keywords[1]),
                      'has-value': newMarket.keywords && !!newMarket.keywords[1]
                    })}
                  >
                    <span className="null-mask" />
                    <span className="prop-value">{(newMarket.keywords && newMarket.keywords[1]) || '\u00a0'}</span>
                  </li>
                </div>
              </ul>
              <div
                className={classNames('prop-container create-market-description', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_DESCRIPTION,
                  'is-null': !newMarket.description,
                  'has-value': !!newMarket.description
                })}
              >
                <span className="null-mask" />
                <span className="prop-value">{newMarket.description || '\u00a0'}</span>
              </div>
              <span
                className={classNames('prop-container create-market-expiry-source', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_EXPIRY_SOURCE,
                  'is-null': !newMarket.expirySource && (newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC || !newMarket.expirySourceType),
                  'has-value': newMarket.expirySourceType === EXPIRY_SOURCE_GENERIC || (newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC && !!newMarket.expirySource)
                })}
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
              </span>
              <span
                className={classNames('prop-container create-market-details', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_DETAILS,
                  'is-null': !newMarket.detailsText,
                  'has-value': !!newMarket.detailsText
                })}
              >
                <span className="null-mask" />
                <span className="prop-value">{(!!newMarket.detailsText && <span>Additional Details: <span className="market-property-value">{newMarket.detailsText}</span></span>) || '\u00a0'}</span>
              </span>
              <ul className="create-market-properties">
                <li
                  className={classNames('prop-container create-market-property', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_END_DATE,
                    'is-null': !Object.keys(newMarket.endDate).length,
                    'has-value': !!Object.keys(newMarket.endDate).length
                  })}
                >
                  <span className="null-mask" />
                  <span className="prop-value">{(!!Object.keys(newMarket.endDate).length && <span>Ends: <span className="market-property-value">{newMarket.endDate.formatted}</span></span>) || '\u00a0'}</span>
                </li>
                <li
                  className={classNames('prop-container create-market-property', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_FEES,
                    'is-null': !newMarket.makerFee,
                    'has-value': !!newMarket.makerFee
                  })}
                >
                  <span className="null-mask" />
                  <span className="prop-value">{<span>Maker Fee: <span className="market-property-value">{newMarket.makerFee}</span></span> || '\u00a0'}</span>
                </li>
                <li
                  className={classNames('prop-container create-market-property', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_FEES,
                    'is-null': !newMarket.takerFee,
                    'has-value': !!newMarket.takerFee
                  })}
                >
                  <span className="null-mask" />
                  <span className="prop-value">{<span>Taker Fee: <span className="market-property-value">{newMarket.takerFee}</span></span> || '\u00a0'}</span>
                </li>
                <li
                  className={classNames('prop-container create-market-property', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_ORDER_BOOK,
                    'is-null': !Object.keys(newMarket.orderBook).length,
                    'has-value': !!Object.keys(newMarket.orderBook).length
                  })}
                >
                  <span className="null-mask" />
                  <span className="prop-value">{(!!Object.keys(newMarket.orderBook).length && `Initial Liquidity: TODO`) || '\u00a0'}</span>
                </li>
              </ul>
            </div>
            <div className="create-market-outcomes">
              <ul
                className={classNames('prop-container create-market-outcome-placeholders', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_OUTCOMES,
                  'is-null': !newMarket.outcomes.length || newMarket.outcomes[0] === '',
                  'has-value': newMarket.outcomes.length && newMarket.outcomes[0] !== ''
                })}
              >
                <div className="outcome-null-masks">
                  {newMarket.type === CATEGORICAL ?
                    <div>
                      <li className="null-mask" />
                      <li className="null-mask" />
                      <li className="null-mask" />
                      <li className="null-mask" />
                    </div> :
                    <li className="null-mask" />
                  }
                </div>
                {newMarket.outcomes.map(outcome => <li>{outcome}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </article>
    );
  }
}
