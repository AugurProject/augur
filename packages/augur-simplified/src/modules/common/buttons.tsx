import React from 'react';
import Styles from 'modules/common/buttons.styles.less';
import classNames from 'classnames';
import { Arrow } from './icons';
// import classNames from 'classnames';

interface ButtonProps {
  text?: string;
  className?: string;
  disabled?: boolean;
  action?: Function;
  icon?: any;
  selected?: boolean;
}

const Button = ({
  text,
  className,
  disabled,
  action,
  icon,
  selected,
}: ButtonProps) => {
  return (
    <button
      className={classNames(className, {
        [Styles.disabled]: disabled,
        [Styles.selected]: selected,
      })}
      onClick={(e) => action && action(e)}
    >
      {text}
      {icon && icon}
    </button>
  );
};

export const PrimaryButton = (props: ButtonProps) => {
  return <Button className={Styles.PrimaryButton} {...props} />;
};

export const SecondaryButton = (props: ButtonProps) => {
  return <Button className={Styles.SecondaryButton} {...props} />;
};

export interface DirectionButtonProps {
  action: Function;
  disabled?: boolean;
  title?: string;
  left?: boolean;
}

export const DirectionButton = (props: DirectionButtonProps) => (
  <button
    onClick={(e) => props.action(e)}
    className={classNames(Styles.DirectionButton, {
      [Styles.left]: props.left,
    })}
    disabled={props.disabled}
    title={props.title}
  >
    {Arrow}
  </button>
);

export const SmallRoundedButton = (props: ButtonProps) => {
  return <Button className={Styles.SmallRoundedButton} {...props} />;
};
