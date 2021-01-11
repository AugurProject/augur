import React, { ReactNode, useEffect, useState } from 'react';
import Styles from 'modules/common/buttons.styles.less';
import classNames from 'classnames';
import { Arrow } from './icons';
import { approveERC20Contract, checkAllowance} from '../hooks/use-approval-callback';
import { useAppStatusStore } from '../stores/app-status';
import { ApprovalAction, ApprovalState, ETH } from '../constants';
import { AmmExchange, Cash } from '../types';

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
  error?: string;
}

const Button = ({
  text,
  className,
  disabled,
  action,
  icon,
  selected,
  href,
  error,
  target = '_blank',
  rel = 'noopener noreferrer',
}: ButtonProps) => {
  return href ? (
    <a
      href={href}
      className={classNames(
        Styles.Button,
        {
          [Styles.TextAndIcon]: text && icon,
          [Styles.Disabled]: disabled,
          [Styles.Selected]: selected,
          [Styles.Error]: error && error !== ''
        },
        className
      )}
      onClick={(e) => action && action(e)}
      target={target}
      rel={rel}
    >
      {error && error !== '' ? error : text}
      {icon && icon}
    </a>
  ) : (
    <button
      className={classNames(
        Styles.Button,
        {
          [Styles.TextAndIcon]: text && icon,
          [Styles.Disabled]: disabled,
          [Styles.Selected]: selected,
          [Styles.Error]: error && error !== ''
        },
        className
      )}
      onClick={(e) => action && action(e)}
    >
      {error && error !== '' ? error : text}
      {icon && icon}
    </button>
  );
};

export const PrimaryButton = (props: ButtonProps) => (
  <Button
    {...props}
    className={classNames(Styles.PrimaryButton, props.className)}
  />
);
export const SecondaryButton = (props: ButtonProps) => (
  <Button
    {...props}
    className={classNames(Styles.SecondaryButton, props.className)}
  />
);
export const TinyButton = (props: ButtonProps) => (
  <Button
    {...props}
    className={classNames(Styles.TinyButton, props.className)}
  />
);
export const BuySellButton = (props: ButtonProps) => (
  <Button
    className={classNames(Styles.BuySellButton, props.className)}
    {...props}
  />
);
export const ApproveButton = (props: ButtonProps) => (
  <Button
    className={classNames(Styles.ApproveButton, props.className)}
    {...props}
  />
);

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

export const ApprovalButton = ({ amm, cash, actionType }: { amm?: AmmExchange, cash: Cash, actionType: ApprovalAction}) => {
  const [isPendingTx, setIsPendingTx] = useState(false);
  const [isApproved, setIsApproved] = useState(ApprovalState.UNKNOWN);

  const {
    loginAccount,
    approvals,
    paraConfig,
    transactions,
    actions: { addTransaction, setApprovals, removeTransaction }
  } = useAppStatusStore();

  const marketCashType = amm?.cash?.name;
  const tokenAddress = amm?.cash?.address
  const approvingName = amm?.cash?.symbol;
  const { addresses } = paraConfig;
  const { AMMFactory, WethWrapperForAMMExchange } = addresses;
  const isETH = amm?.cash?.symbol === ETH;

  const approve = async () => {
    if (actionType === ApprovalAction.ADD_LIQUIDITY) {
      try {
        setIsPendingTx(true);
        const tx = await approveERC20Contract(amm?.cash?.address, approvingName, AMMFactory, loginAccount);
        addTransaction(tx);
      } catch (error) {
        setIsPendingTx(false);
        console.error(error);
      }
    }

    else if (actionType === ApprovalAction.REMOVE_LIQUIDITY) {
      try {
        setIsPendingTx(true);
        const tx = await approveERC20Contract(amm.id, approvingName, WethWrapperForAMMExchange, loginAccount);
        addTransaction(tx);
      } catch (error) {
        setIsPendingTx(false);
        console.error(error);
      }
    }

    else if (actionType === ApprovalAction.ENTER_POSITION) {
      try {
        setIsPendingTx(true);
        const tx = await approveERC20Contract(tokenAddress, marketCashType, loginAccount.account, loginAccount);
        addTransaction(tx);
      } catch (error) {
        setIsPendingTx(false);
        console.error(error);
      }

    }
  }

  useEffect(() => {
    const checkIfApproved = async () => {
      if (actionType === ApprovalAction.ENTER_POSITION) {
        const check = await checkAllowance(tokenAddress, loginAccount.account, loginAccount, transactions);
        if (check === ApprovalState.PENDING) {
          setIsPendingTx(true);
        } else if (check === ApprovalState.APPROVED) {
          setIsPendingTx(false);
          if (transactions.length > 0) {
            const tx = transactions.find(tx => tx.approval
              && tx?.approval?.spender === loginAccount.account
              && tx?.approval?.tokenAddress === tokenAddress)
            if (tx) {
              removeTransaction(tx.hash);
            }
          }
        }
        setIsApproved(check);
      }

      if (actionType === ApprovalAction.ADD_LIQUIDITY) {
        if (isETH) {
          setIsApproved(ApprovalState.APPROVED);
        } else {
          const check = await checkAllowance(amm?.cash?.address, AMMFactory, loginAccount, transactions)
          setIsApproved(check);
        }
      }

      if (actionType === ApprovalAction.REMOVE_LIQUIDITY) {
        if (isETH) {
          setIsApproved(ApprovalState.APPROVED);
        } else {
          const check = await checkAllowance(amm.id, WethWrapperForAMMExchange, loginAccount, transactions)
          setIsApproved(check);
        }
      }
    }

    if (isApproved !== ApprovalState.APPROVED && loginAccount) {
      checkIfApproved();
    } else {
      if (approvals
          && ((actionType === ApprovalAction.ENTER_POSITION && !approvals.trade[marketCashType])
          || (actionType === ApprovalAction.ADD_LIQUIDITY && !approvals.liquidity[marketCashType]))) {
        let newState = approvals;
        if (actionType === ApprovalAction.ENTER_POSITION) {
          newState.trade[marketCashType] = true;
        }
        else if (actionType === ApprovalAction.ADD_LIQUIDITY) {
          newState.liquidity[marketCashType] = true;
        }
        setApprovals(newState);
      }
    }
  }, [setApprovals, loginAccount, isApproved, actionType, amm, paraConfig, tokenAddress, approvals, transactions, AMMFactory, WethWrapperForAMMExchange, amm?.cash?.address, isETH, marketCashType, removeTransaction]);


  if (!loginAccount) {
    return null;
  }

  if (isApproved === ApprovalState.APPROVED) {
    return null;
  }

  let buttonText = '';

  if (actionType === ApprovalAction.ENTER_POSITION) {
    buttonText = 'Approve to Buy';
  } else if (actionType === ApprovalAction.ADD_LIQUIDITY || actionType === ApprovalAction.REMOVE_LIQUIDITY) {
    buttonText = `Approve ${marketCashType}`;
  }

  return (
    <div className={Styles.Approval}>
      <ApproveButton
        disabled={isPendingTx}
        text={isPendingTx ? 'Approving...' : buttonText}
        action={() => approve()}
      />
    </div>
  )
}
