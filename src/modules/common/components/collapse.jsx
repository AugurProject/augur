// Provides collapsible wrapper (default is div)
import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Collapse = p => (
  <div className={classNames('collapse', { displayNone: !p.isOpen })} >
    {p.children}
  </div>
);

Collapse.propTypes = {
  isOpen: PropTypes.bool,
  component: PropTypes.any,
  children: PropTypes.any
};

export default Collapse;
