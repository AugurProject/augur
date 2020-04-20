import React from 'react';

import { FormattedNumber } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';

import Styles from 'modules/swap/components/swap-row.styles.less';
import { TextInput } from 'modules/common/form';
import { ChevronDown } from 'modules/common/icons';

interface SwapBlockProps {
  token: string;
  label: string;
  balance: FormattedNumber;
  amount: FormattedNumber;
  setMaxAmount?: Function;
  setToken?: Function;
  setAmount?: Function;
  logo?: React.ReactFragment;
  showChevron?: boolean
}

export const SwapRow = ({
  token,
  label,
  balance,
  amount,
  setMaxAmount,
  setAmount,
  setToken,
  logo = null,
  showChevron = false,
}: SwapBlockProps) => (
  <div className={Styles.SwapRow}>
    <div>
      <div>{label}</div>
      <div
        onClick={
          setMaxAmount
            ? () => setMaxAmount(createBigNumber(balance.value))
            : null
        }
      >
        Balance: {balance.formattedValue}
      </div>
    </div>

    <div>
      {!setAmount && <div>{amount.formattedValue}</div>}
      {setAmount && (
        <TextInput
          placeholder={'0.0000'}
          value={String(amount.formattedValue)}
          onChange={value => {
            setAmount(
              createBigNumber(value),
              createBigNumber(balance.value)
            );
          }}
          errorMessage={''}
          innerLabel={' '}
        />
      )}
      <div>
        <div onClick={setToken ? () => setToken() : null}>
          {logo} {token} {showChevron && <ChevronDown />}
        </div>
      </div>
    </div>
  </div>
);
