import React, {ReactNode} from 'react';
import Styles from 'modules/common/buttons.styles.less';
import classNames from 'classnames';
import { Arrow } from './icons';

interface ButtonProps {
  text?: string;
  className?: string;
  disabled?: boolean;
  action?: Function;
  icon?: ReactNode;
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
      className={classNames({
        [Styles.TextAndIcon]: text && icon,
        [Styles.Disabled]: disabled,
        [Styles.Selected]: selected,
      }, className)}
      onClick={(e) => action && action(e)}
    >
      {text}
      {icon && icon}
    </button>
  );
};

export const PrimaryButton = (props: ButtonProps) => <Button className={Styles.PrimaryButton} {...props} />;
export const SecondaryButton = (props: ButtonProps) => <Button className={Styles.SecondaryButton} {...props} />;
export const TinyButton = (props: ButtonProps) => <Button className={Styles.TinyButton} {...props} />;
export const BuySellButton = (props: ButtonProps) => <Button className={Styles.BuySellButton} {...props} />;

export interface DirectionButtonProps {
  action: Function;
  disabled?: boolean;
  title?: string;
  left?: boolean;
}

export const DirectionButton = ({
  action,
  disabled,
  title,
  left,
}: DirectionButtonProps) => (
  <button
    onClick={(e) => action(e)}
    className={classNames(Styles.DirectionButton, {
      [Styles.Left]: left,
    })}
    disabled={disabled}
    title={title}
  >
    {Arrow}
  </button>
);
