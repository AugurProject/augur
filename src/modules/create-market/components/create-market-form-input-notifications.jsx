import React from 'react';
import classNames from 'classnames';

const CreateMarketFormInputNotifications = p => (
  <ul className={classNames('create-market-form-input-notifications', p.classNames, { hasNotifications: (p.errors && p.errors.length) || (p.warning && p.warnings.length) })} >
    {(p.errors || []).map(error => (
      <li
        key={error}
        className="notification-error"
      >
        {error}
      </li>
    ))}
    {(p.warnings || []).map(warning => (
      <li
        key={warning}
        className="notification-warning"
      >
        {warning}
      </li>
    ))}
  </ul>
);

export default CreateMarketFormInputNotifications;
