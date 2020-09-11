import React, { useState, useEffect } from 'react';
import { createBigNumber } from 'utils/create-big-number';
import { TextInput } from 'modules/common/form';
import { formatRep, formatGasCostToEther } from 'utils/format-number';
import {
  BUY_PARTICIPATION_TOKENS_GAS_LIMIT,
  REP,
  GWEI_CONVERSION,
} from 'modules/common/constants';
import {
  Title,
  MaxDescription,
  AlertMessageProps,
  Breakdown, ButtonsRow,
} from 'modules/modal/common';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { FormattedNumber } from 'modules/types';
import { getGasCost } from 'modules/modal/gas';
import Styles from 'modules/modal/components/common/common.styles.less';

interface ModalStakingProps {
  tokenBalance: string;
  gasPrice: number;
  closeModal: (...args: any[]) => any;
  stakeTokens: Function;
  messages: AlertMessageProps[];
  title: string;
  GsnEnabled: boolean;
  ethToDaiRate: FormattedNumber;
  gsnWalletInfoSeen: boolean;
  gsnUnavailable: boolean;
  initializeGsnWallet: Function;
  transactionLabel: string;
  tokenName: string;
}

export const ModalStaking = ({
  closeModal,
  gasPrice,
  messages,
  title,
  GsnEnabled,
  transactionLabel,
  ethToDaiRate,
  stakeTokens,
  tokenName,
  tokenBalance,
}: ModalStakingProps) => {

  const [isValid, setIsValid] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [gasLimit, setGasLimit] = useState(BUY_PARTICIPATION_TOKENS_GAS_LIMIT);
  const [errors, setErrors] = useState([]);
  const formattedQuantity = formatRep(quantity || 0);
  const gasCostDai = getGasCost(gasLimit, gasPrice, ethToDaiRate);
  const formatBalance = formatRep(tokenBalance || 0);

  useEffect(() => {
    /*
    TODO: need to wire up gas estimate
    stakeTokens(1, true, (err, gasLimit) => {
      if (!err && gasLimit) {
        setGasLimit(gasLimit);
      }
    });
    */
  }, []);

  const submitForm = () => {
    stakeTokens(quantity, err => {
      if (err) console.log('ERR for stakeTokens', err);
      closeModal();
    });
  };

  const validateForm = quantity => {
    const bnRep = createBigNumber(tokenBalance, 10);
    const errors: string[] = [];
    let isValid = true;

    if (quantity === '') {
      isValid = false;
      // exit early, as the other check doesn't matter.
      return { errors, isValid };
    }
    const bnQuantity = createBigNumber(quantity, 10);

    if (bnQuantity.lte(0)) {
      errors.push('Quantity must greater than 0.');
      isValid = false;
      // exit early, as the other check doesn't matter.
      return { errors, isValid };
    }

    if (bnQuantity.gt(bnRep)) {
      errors.push(`Value is bigger than ${tokenName} balance: ${formatBalance.formatted} ${tokenName}`);
      isValid = false;
    }

    if (isNaN(quantity)) {
      errors.push('Value not a number');
      isValid = false;
    }

    return { errors, isValid };
  };

  const max = () => {
    updateQuantity(tokenBalance)
  }
  const updateQuantity = quantity => {
    const { errors, isValid } = validateForm(quantity);
    setQuantity(quantity);
    setIsValid(isValid);
    setErrors(errors);
  };

  const items = [
    {
      label: 'quantity',
      value: formattedQuantity,
      denomination: '',
    },
    {
      label: transactionLabel,
      value: gasCostDai,
      denomination: 'DAI',
      showDenomination: true,
    },
  ];

  const buttons = [{
    text: 'Stake',
    action: () => {
      submitForm();
      closeModal();
    },
    disabled: !isValid,
  }, {
    text: 'Cancel',
    action: () => closeModal(),
  }];

  return (
    <section className={Styles.ModalContainer}>
      <Title title={title} closeAction={() => closeModal()} />
      <div className={Styles.ModalParticipation}>
        <MaxDescription label={'Quantity'} balance={formatRep(tokenBalance).formatted} max={max} />
        <TextInput
          placeholder={'0.0000'}
          value={quantity}
          onChange={value => updateQuantity(value)}
          errorMessage={errors[0]}
          innerLabel={tokenName}
        />
        <Breakdown rows={items} />
        <ButtonsRow buttons={buttons}/>
      </div>
    </section>
  );
};
