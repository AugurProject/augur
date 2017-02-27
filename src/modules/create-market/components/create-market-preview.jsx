import React, { PropTypes } from 'react';
import classNames from 'classnames';

// NOTE --  Discrete component due to vastly different functionality as compared to `market-preview.jsx`
const CreateMarketPreview = p => (
  <article className="create-market-preview">
    <div className="create-market-details">
      <ul className="create-market-tags">
        <li
          className={classNames('create-market-tag', {
            isNull: !p.topic,
            hasValue: !!p.topic
          })}
        >
          {p.topic}
        </li>
        <li
          className={classNames('creat-market-tag', {
            isNull: !(p.keywords && p.keywords[0]),
            hasValue: p.keywords && !!p.keywords[0]
          })}
        >
          {p.keywords && p.keywords[0]}
        </li>
        <li
          className={classNames('create-market-tag', {
            isNull: !(p.keywords && p.keywords[1]),
            hasValue: p.keywords && !!p.keywords[1]
          })}
        >
          {p.keywords && p.keywords[1]}
        </li>
      </ul>
      <span
        className={classNames('create-market-description', {
          isNull: !p.description,
          hasValue: !!p.description
        })}
      >
        {p.description}
      </span>
      <ul className="create-market-properties">
        <li
          className={classNames('create-market-property', {
            isNull: !p.endDate,
            hasValue: !!p.endDate
          })}
        >
          {p.endDate}
        </li>
        <li
          className={classNames('create-market-property', {
            isNull: !p.makerFee,
            hasValue: !!p.makerFee
          })}
        >
          {p.makerFee}
        </li>
        <li
          className={classNames('create-market-property', {
            isNull: !p.takerFee,
            hasValue: !!p.takerFee
          })}
        >
          {p.takerFee}
        </li>
      </ul>
    </div>
    <ul className="create-market-outcomes">
    </ul>
  </article>
);

export default CreateMarketPreview;

CreateMarketPreview.propTypes = {
  newMarket: PropTypes.object.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
