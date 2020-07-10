import React from 'react';
import classNames from 'classnames';

import Styles from 'modules/create-market/link.styles.less';
import { ButtonActionType } from 'modules/types';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { MODAL_CREATION_HELP } from 'modules/common/constants';

export interface LinkProps {
  href?: string;
  copyType?: string;
  underline?: Boolean;
  ownLine?: Boolean;
  updateModal: ButtonActionType;
}

const Link = ({
  href,
  copyType,
  underline,
  ownLine,
}: LinkProps) => {
  const { actions: { setModal }} = useAppStatusStore();
  return (
  <button
    className={classNames(Styles.Link, {[Styles.underline]: underline, [Styles.ownLine]: ownLine})}
    onClick={(cb) => setModal({ type: MODAL_CREATION_HELP, copyType, cb })}
  >
    Learn more
  </button>
);
}
export default Link;
