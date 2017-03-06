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
    console.log('updatePreviewHeight -- ', step);
    let newHeight = 0;
    if (step && step !== 0) newHeight = this.marketPreview.getElementsByClassName('create-market-preview-content')[0].clientHeight + 3; // 2 for horizontal borders
    this.marketPreview.style.height = `${newHeight}px`;
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
                  className={classNames('create-market-tag', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_TOPIC,
                    'is-null': !newMarket.topic,
                    'has-value': !!newMarket.topic
                  })}
                >
                  {newMarket.topic}
                </li>
                <div
                  className={classNames('create-market-keywords', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_KEYWORDS,
                  })}
                >
                  <li
                    className={classNames('create-market-tag', {
                      'is-null': !(newMarket.keywords && newMarket.keywords[0]),
                      'has-value': newMarket.keywords && !!newMarket.keywords[0]
                    })}
                  >
                    {newMarket.keywords && newMarket.keywords[0]}
                  </li>
                  <li
                    className={classNames('create-market-tag', {
                      'is-null': !(newMarket.keywords && newMarket.keywords[1]),
                      'has-value': newMarket.keywords && !!newMarket.keywords[1]
                    })}
                  >
                    {newMarket.keywords && newMarket.keywords[1]}
                  </li>
                </div>
              </ul>
              <span
                className={classNames('create-market-description', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_DESCRIPTION,
                  'is-null': !newMarket.description,
                  'has-value': !!newMarket.description
                })}
              >
                {newMarket.description}
              </span>
              <span
                className={classNames('create-market-expiry-source', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_EXPIRY_SOURCE,
                  'is-null': !newMarket.expirySource && (newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC || !newMarket.expirySourceType),
                  'has-value': !!newMarket.expirySource && !!newMarket.expirySourceType
                })}
              >
                {newMarket.expirySourceType === EXPIRY_SOURCE_GENERIC && 'Source: News Media'}
                {newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC && !!newMarket.expirySource && `Source: ${newMarket.expirySource}`}
              </span>
              <span
                className={classNames('create-market-details', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_DETAILS,
                  'is-null': !newMarket.detailsText,
                  'has-value': !!newMarket.detailsText
                })}
              >
                {!!newMarket.detailsText && `Additional Details: ${newMarket.detailsText}`}
              </span>
              <ul className="create-market-properties">
                <li
                  className={classNames('create-market-property', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_END_DATE,
                    'is-null': !Object.keys(newMarket.endDate).length,
                    'has-value': !!Object.keys(newMarket.endDate).length
                  })}
                >
                  {!!Object.keys(newMarket.endDate).length && `Ends: ${newMarket.endDate.formatted}`}
                </li>
                <div
                  className={classNames('create-market-fees', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_FEES,
                  })}
                >
                  <li
                    className={classNames('create-market-property', {
                      'is-null': !newMarket.makerFee,
                      'has-value': !!newMarket.makerFee
                    })}
                  >
                    {newMarket.makerFee}
                  </li>
                  <li
                    className={classNames('create-market-property', {
                      'is-null': !newMarket.takerFee,
                      'has-value': !!newMarket.takerFee
                    })}
                  >
                    {newMarket.takerFee}
                  </li>
                </div>
                <li
                  className={classNames('create-market-property', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_ORDER_BOOK,
                    'is-null': !Object.keys(newMarket.orderBook).length,
                    'has-value': !!Object.keys(newMarket.orderBook).length
                  })}
                >
                  {!!Object.keys(newMarket.orderBook).length && `Initial Liquidity: TODO`}
                </li>
              </ul>
            </div>
            <ul className="create-market-outcomes">
              {newMarket.outcomes.length ?
                newMarket.outcomes.map(outcome => <li>{outcome}</li>) :
                <div
                  className={classNames('create-market-outcome-placeholders', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_OUTCOMES,
                  })}
                >
                  <li className="is-null" />
                  {newMarket.type === CATEGORICAL &&
                    <div>
                      <li className="is-null" />
                      <li className="is-null" />
                      <li className="is-null" />
                      <li className="is-null" />
                    </div>
                  }
                </div>
              }
            </ul>
          </div>
        </div>
      </article>
    );
  }
}
