import React, {ReactNode, useEffect, useState} from 'react';
import Styles from 'modules/common/buttons.styles.less';
import classNames from 'classnames';
import { Arrow } from './icons';
import { useApproveCallback, useIsTokenApproved } from '../hooks/use-approval-callback';
import { useAppStatusStore } from '../stores/app-status';
import { ApprovalAction, ApprovalState } from '../constants';

interface ButtonProps {
  text?: string;
  className?: string;
  disabled?: boolean;
  action?: Function;
  icon?: ReactNode;
  selected?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

const Button = ({
  text,
  className,
  disabled,
  action,
  icon,
  selected,
  href,
  target = '_blank',
  rel = 'noopener noreferrer'
}: ButtonProps) => {
  return href ? (
    <a
      href={href}
      className={classNames(Styles.Button, {
        [Styles.TextAndIcon]: text && icon,
        [Styles.Disabled]: disabled,
        [Styles.Selected]: selected,
      }, className)}
      onClick={(e) => action && action(e)}
      target={target}
      rel={rel}
    >
      {text}
      {icon && icon}
    </a>
  ) : (
    <button
      className={classNames(Styles.Button, {
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

export const PrimaryButton = (props: ButtonProps) => <Button {...props} className={classNames(Styles.PrimaryButton, props.className)} />;
export const SecondaryButton = (props: ButtonProps) => <Button {...props} className={classNames(Styles.SecondaryButton, props.className)} />;
export const TinyButton = (props: ButtonProps) => <Button {...props} className={classNames(Styles.TinyButton, props.className)} />;
export const BuySellButton = (props: ButtonProps) => <Button className={classNames(Styles.BuySellButton, props.className)} {...props} />;
export const ApproveButton = (props: ButtonProps) => <Button className={classNames(Styles.ApproveButton, props.className)} {...props} />;

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

export const ApprovalButton = ({ amm, actionType }) => {
  const marketCashType = amm?.cash?.name;
  const tokenAddress = amm?.cash?.address

  const [isApprovedToTrade, setIsApprovedToTrade] = useState(false);
  const [isPendingTx, setIsPendingTx] = useState(false);

  const {
    loginAccount,
    approvals,
    actions: { setApprovals }
  } = useAppStatusStore();

  const isTokenApproved = useIsTokenApproved(tokenAddress, loginAccount.account);
  const [approvalState, approve ] = useApproveCallback(tokenAddress, marketCashType, loginAccount.account);

  useEffect(() => {
    if (loginAccount && !isApprovedToTrade) {
      isTokenApproved
      .then(isApproved => {
        if (isApproved) {
          setIsPendingTx(false);
          setIsApprovedToTrade(true);
          const approvalState = approvals;
          approvalState.trade[marketCashType] = true;
          setApprovals(approvalState);
        }
      })
      .catch(error => {
        console.log('error', error)
        setIsApprovedToTrade(false);
      })
    }
  }, [loginAccount, isTokenApproved, isApprovedToTrade, marketCashType, approvals, setApprovals]);

  const approveTrade = () => {
    if ([ApprovalState.UNKNOWN, ApprovalState.NOT_APPROVED].includes(approvalState)) {
      setIsPendingTx(true);
      approve()
        .then(_ => {
          setIsPendingTx(false);
          setIsApprovedToTrade(true);
          const approvalState = approvals;
          approvalState.trade[marketCashType] = true;
          setApprovals(approvalState);
      })
      .catch(error => {
        console.log(error)
        setIsPendingTx(false);
      });
    }
    else if (ApprovalState.PENDING === approvalState) {
      // TODO
    }
    else if (ApprovalState.APPROVED === approvalState) {
      // TODO
    }
  }

  if (!loginAccount) {
    return null;
  }

  if (isApprovedToTrade) {
    return null;
  }

  return (
    <div className={Styles.Approval}>
      {ApprovalAction.TRADE === actionType &&
        <ApproveButton
          disabled={isPendingTx}
          text={isPendingTx ? 'Approving...' : 'Approve to Buy'}
          action={() => approveTrade()}
        />
      }
    </div>
  )
}
