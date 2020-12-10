import React from 'react';
import Styles from 'modules/common/buttons.styles.less';
import classNames from 'classnames';
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


