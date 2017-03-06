import React from 'react';
import classNames from 'classnames';

const CreateMarketFormErrors = p => (
  <ul className={classNames('create-market-form-errors', p.classNames, { hasErrors: p.errors.length })} >
    {(p.errors || []).map(error => (
      <li
        key={error}
      >
        {error}
      </li>
    ))}
  </ul>
);

export default CreateMarketFormErrors;
