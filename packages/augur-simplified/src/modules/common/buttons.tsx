import React from 'react';
import Styles from 'modules/common/buttons.styles.less';
import classNames from 'classnames';
import { Arrow } from './icons';
// import classNames from 'classnames';

interface ButtonProps {
  text?: string;
  className?: string
}

const Button = ({ text, className }: ButtonProps) => {
  return <button className={classNames(className)}>{text}</button>;
};

export const PrimaryButton = (props: ButtonProps) => {
  return <Button className={Styles.PrimaryButton} {...props}/>;
};

export const SecondaryButton = (props: ButtonProps) => {
  return <Button className={Styles.SecondaryButton} {...props}/>;
};

export interface DirectionButtonProps {
  action: Function;
  disabled?: boolean;
  title?: string;
  left?: boolean;
}

export const DirectionButton = (props: DirectionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.DirectionButton, {
      [Styles.left]: props.left,
    })}
    disabled={props.disabled}
    title={props.title}
  >
    {Arrow}
  </button>
);