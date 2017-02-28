import React, { PropTypes } from 'react';
import classNames from 'classnames';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import {
  NEW_MARKET_DESCRIPTION,
  NEW_MARKET_OUTCOMES,
  NEW_MARKET_RESOLUTION_SOURCE,
  NEW_MARKET_END_DATE,
  NEW_MARKET_ADDITIONAL_INFORMATION,
  NEW_MARKET_TOPIC,
  NEW_MARKET_KEYWORDS,
  NEW_MARKET_FEES,
  NEW_MARKET_ORDER_BOOK,
  NEW_MARKET_REVIEW
} from 'modules/create-market/constants/new-market-creation-steps';
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';


// NOTE --  Discrete component due to vastly different functionality as compared to `market-preview.jsx`
const CreateMarketPreview = (p) => {
  const newMarket = p.newMarket;

  return (
    <article
      className={classNames('create-market-preview', {
        'preview-is-visible': newMarket.currentStep > 0,
        'preview-is-hidden': newMarket.currentStep === 0
      })}
    >
      <div className="create-market-details">
        <ul className="create-market-tags">
          <li
            className={classNames('create-market-tag', {
              'is-null': !newMarket.topic,
              'has-value': !!newMarket.topic
            })}
          >
            {newMarket.topic}
          </li>
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
          className={classNames('create-market-resolution-source', {
            'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_RESOLUTION_SOURCE,
            'is-null': !newMarket.resolutionSource,
            'has-value': !!newMarket.resolutionSource
          })}
        >
          {newMarket.resolutionSource}
        </span>
        <ul className="create-market-properties">
          <li
            className={classNames('create-market-property', {
              'is-null': !newMarket.endDate,
              'has-value': !!newMarket.endDate
            })}
          >
            {newMarket.endDate}
          </li>
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
        </ul>
      </div>
      <ul className="create-market-outcomes">
        {newMarket.type === BINARY &&
          <li className="outcome">
            Yes
          </li>
        }
      </ul>
    </article>
  );
};

export default CreateMarketPreview;

CreateMarketPreview.propTypes = {
  newMarket: PropTypes.object.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
