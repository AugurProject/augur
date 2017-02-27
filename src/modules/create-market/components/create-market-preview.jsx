import React, { PropTypes } from 'react';
import classNames from 'classnames';

// NOTE --  Discrete component due to vastly different functionality as compared to `market-preview.jsx`
const CreateMarketPreview = p => (
  <article className="create-market-preview">
    <div className="create-market-details">
      <div className="create-market-tags">
        <ul>
          <li
            className={classNames('tag', {
              isNull: !p.topic,
              hasValue: !!p.topic
            })}
          >
            {p.topic}
          </li>
          <li
            className={classNames('tag', {
              isNull: !(p.keywords && p.keywords[0]),
              hasValue: p.keywords && !!p.keywords[0]
            })}
          >
            {p.keywords && p.keywords[0]}
          </li>
          <li
            className={classNames('tag', {
              isNull: !(p.keywords && p.keywords[1]),
              hasValue: p.keywords && !!p.keywords[1]
            })}
          >
            {p.keywords && p.keywords[1]}
          </li>
        </ul>
      </div>
      <span
        className={classNames('create-market-description', {
          isNull: !p.description,
          hasValue: !!p.description
        })}
      >
        {p.description}
      </span>
      <div className="create-market-properties"></div>
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
