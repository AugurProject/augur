/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import { TextInput } from 'modules/common/form';
import Styles from 'modules/modal/components/common/common.styles.less';
import { formatRep, formatGasCostToEther, formatEtherEstimate, formatDai } from 'utils/format-number';
import { BUY_PARTICIPATION_TOKENS_GAS_LIMIT } from 'modules/common/constants';
import ModalActions from './common/modal-actions';
import {
  Title,
  DescriptionMessage,
  AlertMessageProps,
  Breakdown,
} from '../common';

interface ModalParticipateProps {
  rep: string;
  gasPrice: string;
  closeModal: (...args: any[]) => any;
  purchaseParticipationTokens: Function;
  messages: AlertMessageProps[];
  title: string;
  Gnosis_ENABLED: boolean;
  ethToDaiRate: BigNumber;
}

interface ModalParticipateState {
  quantity: string;
  gasEstimate: BigNumber;
  isValid: boolean;
  errors: string[];
}

export default class ModalParticipate extends Component<
  ModalParticipateProps,
  ModalParticipateState
> {
  constructor(props) {
    super(props);

    this.state = {
      quantity: '',
      gasEstimate: BUY_PARTICIPATION_TOKENS_GAS_LIMIT,
      isValid: false,
      errors: [],
    };

    this.triggerReview = this.triggerReview.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleMaxClick = this.handleMaxClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  triggerReview() {
    const { purchaseParticipationTokens } = this.props;
    if (this.state.isValid) {
      purchaseParticipationTokens(
        this.state.quantity,
        true,
        (err, gasEstimate) => {
          if (!err && !!gasEstimate) this.setState({ gasEstimate });
        }
      );
    }
  }

  submitForm() {
    const { purchaseParticipationTokens } = this.props;
    purchaseParticipationTokens(this.state.quantity, false, err => {
      if (err) console.log('ERR for purchaseParticipationTokens', err);
      this.props.closeModal();
    });
  }

  updateQuantity(quantity) {
    const { errors, isValid } = this.validateForm(quantity);
    this.setState({ isValid, errors, quantity });
    this.triggerReview();
  }

  validateForm(quantity) {
    const { rep } = this.props;
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
      errors.push('Insufficient Funds.');
      isValid = false;
    }

    if (isNaN(quantity)) {
      errors.push('Value not a number');
      isValid = false;
    }

    return { errors, isValid };
  }

  handleMaxClick() {
    const { rep } = this.props;
    this.setState({ quantity: rep, isValid: true, errors: [] });
  }

  handleKeyDown(e) {
    // if enter is pressed, lets handle this so we don't close modal
    if (e.keyCode === 13) {
      e.preventDefault();
      if (this.state.isValid) this.triggerReview();
    }
  }

  render() {
    const { closeModal, gasPrice, messages, title, Gnosis_ENABLED, ethToDaiRate } = this.props;
    const { errors, isValid, quantity, gasEstimate } = this.state;
    const formattedQuantity = formatRep(quantity || 0);
    const formattedGas = formatEtherEstimate(
      formatGasCostToEther(
        gasEstimate,
        { decimalsRounded: 4 },
        gasPrice
      )
    );

    let formattedGasDai = null;
    if (Gnosis_ENABLED && ethToDaiRate) {
      formattedGasDai = formatDai(ethToDaiRate.multipliedBy(createBigNumber(formattedGas.formattedValue)));
    }

    const items = [
      {
        label: 'quantity',
        value: formattedQuantity,
        denomination: '',
      },
      {
        label: 'price',
        value: formattedQuantity,
        denomination: 'REP',
        showDenomination: true,
      },
      {
        label: 'gas',
        value: Gnosis_ENABLED ? formattedGasDai : formattedGas,
        denomination: Gnosis_ENABLED ? 'DAI' : 'ETH',
        showDenomination: true,
      },
    ];

    return (
      <section className={Styles.ModalContainer}>
        <Title title={title} closeAction={() => closeModal()} />
        <div className={Styles.ModalParticipation}>
          <DescriptionMessage messages={messages} />
          <TextInput
            placeholder={'0.0000'}
            value={quantity}
            onChange={value => this.updateQuantity(value)}
            errorMessage={errors[0]}
            innerLabel="REP"
          />
          <Breakdown rows={items} />
        </div>
        <ModalActions
          buttons={[
            {
              label: 'cancel',
              action: closeModal,
              type: 'gray',
            },
            {
              label: 'buy',
              action: this.submitForm,
              type: 'purple',
              isDisabled: !isValid,
            },
          ]}
        />
      </section>
    );
  }
}
