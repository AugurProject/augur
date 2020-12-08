import React from 'react';
import Styles from 'modules/common/buttons.styles.less';
import classNames from 'classnames';

interface PrimaryButtonProps {
  text?: string;
}

export const PrimaryButton = ({ text }: PrimaryButtonProps) => {
  return <button className={Styles.PrimaryButton}>{text}</button>;
};
