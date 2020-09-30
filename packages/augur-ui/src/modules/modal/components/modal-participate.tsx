import React, { useState, useEffect } from 'react';
import { createBigNumber } from 'utils/create-big-number';
import { TextInput } from 'modules/common/form';
import Styles from 'modules/modal/common.styles.less';
import { formatRep } from 'utils/format-number';
import {
  BUY_PARTICIPATION_TOKENS_GAS_LIMIT,
} from 'modules/common/constants';
import {
  Title,
  DescriptionMessage,
  Breakdown, ButtonsRow,
} from '../common';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { getTransactionLabel } from 'modules/auth/helpers/get-gas-price';
import { purchaseParticipationTokens } from 'modules/reporting/actions/participation-tokens-management';
import { getGasCost } from 'modules/modal/gas';
export const ModalParticipate = () => {
  const {
    loginAccount: {
      balances: { rep },
    },
    modal,
    gasPriceInfo,
    ethToDaiRate,
    actions: { closeModal, setModal }
  } = useAppStatusStore();

  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  const messages = [
    {
      key: 'quant',
      preText: 'Quantity (1 token @ 1 REPv2)',
    },
  ];
  const title = 'Buy Participation Tokens';
  const transactionLabel = getTransactionLabel();

  const [isValid, setIsValid] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [gasLimit, setGasLimit] = useState(BUY_PARTICIPATION_TOKENS_GAS_LIMIT);
  const [errors, setErrors] = useState([]);

  const formattedQuantity = formatRep(quantity || 0);
  const gasCostDai = getGasCost(gasLimit, gasPrice, ethToDaiRate);
  const displayfee = `$${gasCostDai.formattedValue}`;

  useEffect(() => {
    purchaseParticipationTokens(1, true, (err, gasLimit) => {
      if (!err && gasLimit) {
        setGasLimit(gasLimit);
      }
    });
  }, []);

  const submitForm = () => {
    purchaseParticipationTokens(quantity, false, err => {
      if (err) console.log('ERR for purchaseParticipationTokens', err);
      closeModal();
    });
  };

  const validateForm = quantity => {
    const bnRep = createBigNumber(rep, 10);
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
      errors.push(`Value is bigger than REPv2 balance: ${rep} REPv2`);
      isValid = false;
    }

    if (isNaN(quantity)) {
      errors.push('Value not a number');
      isValid = false;
    }

    return { errors, isValid };
  };

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
      label: 'price',
      value: formattedQuantity,
      denomination: 'REPv2',
      showDenomination: true,
    },
    {
      label: transactionLabel,
      value: displayfee,
      denomination: 'DAI',
      showDenomination: true,
    },
  ];

  const buttons = [{
    text: 'Buy',
    action: () => submitForm(),
    disabled: !isValid,
  }, {
    text: 'Cancel',
    action: () => closeModal(),
  }];

  return (
    <section className={Styles.ModalContainer}>
      <Title title={title} closeAction={() => closeModal()} />
      <div className={Styles.ModalParticipation}>
        <DescriptionMessage messages={messages} />
        <TextInput
          placeholder={'0.0000'}
          value={quantity}
          onChange={value => updateQuantity(value)}
          errorMessage={errors[0]}
          innerLabel={'REPv2'}
        />
        <Breakdown rows={items} />
        <ButtonsRow buttons={buttons}/>
      </div>
    </section>
  );
};
