import React, { Component } from 'react';
import classNames from 'classnames';

import Styles from 'modules/create-market/link.styles.less';
import { ButtonActionType } from 'modules/types';

export interface LinkProps {
  href?: string;
  underline?: Boolean;
  ownLine?: Boolean;
  updateModal: ButtonActionType;
}

const Link = (props: LinkProps) => (
  <button
    className={classNames(Styles.Link, {[Styles.underline]: props.underline, [Styles.ownLine]: props.ownLine})}
    onClick={props.updateModal}
  >
    Learn more
  </button>
);

export default Link;
