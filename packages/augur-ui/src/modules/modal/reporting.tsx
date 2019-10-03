import React, { Component } from 'react';
import { MarketData, DisputeInputtedValues } from 'modules/types';
import { Title } from 'modules/modal/common';
import { SecondaryButton } from 'modules/common/buttons';
import { MarketTypeLabel, RepBalance } from 'modules/common/labels';
import { Subheaders } from 'modules/reporting/common';
import { ReportingRadioBarGroup, ReportingRadioBarProps } from 'modules/common/form';
import { formatAttoRep } from 'utils/format-number';
import { SCALAR, REPORTING_STATE, INVALID_OUTCOME_NAME } from 'modules/common/constants';
import {
  doInitialReport,
  contribute,
  addRepToTentativeWinningOutcome,
} from 'modules/contracts/actions/contractCalls';

import Styles from 'modules/modal/modal.styles.less';
import { createBigNumber } from 'utils/create-big-number';
import { convertDisplayValuetoAttoValue, Getters } from '@augurproject/sdk';
import { loadAccountCurrentDisputeHistory } from 'modules/auth/actions/load-account-reporting';
interface ModalReportingProps {
  closeAction: Function;
  market: MarketData;
  rep: string;
  title: string;
  selectedOutcome?: number;
  reportAction: Function;
  userAccount?: string;
}

interface ModalReportingState {
  checked: string;
  preFilledStake: string;
  disputeStake: DisputeInputtedValues;
  inputScalarOutcome: string;
  isReporting: boolean;
  userCurrentDisputeRound: Getters.Accounts.UserCurrentOutcomeDisputeStake[] | [];
  radioButtons: ReportingRadioBarProps[];
}

export default class ModalReporting extends Component<
  ModalReportingProps,
  ModalReportingState
> {
  state: ModalReportingState = {
    checked: this.props.selectedOutcome
      ? this.props.selectedOutcome.toString()
      : null,
    preFilledStake: '',
    disputeStake: { inputStakeValue: '', inputToAttoRep: '' },
    inputScalarOutcome: '',
    isReporting: this.props.market.reportingState === REPORTING_STATE.OPEN_REPORTING ||
    this.props.market.reportingState === REPORTING_STATE.DESIGNATED_REPORTING,
    userCurrentDisputeRound: [],
    radioButtons: []
  };

  componentDidMount = () => {
    const { market, userAccount} = this.props;
    loadAccountCurrentDisputeHistory(market.marketId, userAccount, (err, userCurrentDisputeRound) => {
      if (err) {
        return console.error("could not get user current dispute round values", err);
      }
      this.setState({
        userCurrentDisputeRound: userCurrentDisputeRound ? userCurrentDisputeRound : []
      })
    })
    this.setState({ radioButtons: this.buildRadioButtonCollection() })
  }

  updateChecked = (selected: string, isInvalid: boolean = false) => {
    const { radioButtons } = this.state;
    this.updateDisputeStake({ inputStakeValue: '', inputToAttoRep: '' });
    radioButtons.map(r =>
      r.id === selected && r.isInvalid === isInvalid
        ? (r.checked = true)
        : (r.checked = false)
    );
    const radioValue = radioButtons.find(r => r.checked);
    this.updatePreFilledStake('');
    this.updateScalarOutcome(String(radioValue.value) ? String(radioValue.value) : '');
    this.setState({ radioButtons, checked: selected });
  };

  updatePreFilledStake = (preFilledStake: string) => {
    this.setState({ preFilledStake });
  };

  buildRadioButtonCollection = () => {
    const { market, selectedOutcome } = this.props;
    const {
      checked,
    } = this.state;
    const {
      marketType,
      outcomesFormatted,
      disputeInfo,
      minPrice,
      maxPrice
    } = market;

    let sortedOutcomes = outcomesFormatted;
    if (selectedOutcome !== null) {
      const selected = outcomesFormatted.find(o => o.id === Number(selectedOutcome))
      if (selected) {
        sortedOutcomes = [selected, ...outcomesFormatted.filter(o => o.id !== Number(selectedOutcome))]
      }
    }

    let radioButtons = sortedOutcomes
      .filter(outcome => (marketType === SCALAR ? outcome.id === 0 : true))
      .map(outcome => {
        let stake = disputeInfo.stakes.find(
          stake => parseFloat(stake.outcome) === outcome.id
        );

        return {
          id: String(outcome.id),
          header: outcome.description,
          value: outcome.id,
          description: stake.outcome,
          checked: checked === outcome.id.toString(),
          isInvalid: outcome.id === 0,
          preFilledStake: formatAttoRep(stake.stakeCurrent).formatted,
          stake,
        };
      });

    if (marketType === SCALAR) {
      if (selectedOutcome && String(selectedOutcome) !== 'null')
        this.updateScalarOutcome(String(selectedOutcome));
      radioButtons = [];
      const denomination = market.scalarDenomination;
      disputeInfo.stakes.forEach(stake => {
        const populatedHeader = stake.isInvalidOutcome
          ? INVALID_OUTCOME_NAME
          : `${stake.outcome} ${denomination}`;
        radioButtons.push({
          id: String(stake.outcome),
          header: stake.outcome
            ? populatedHeader
            : `Enter a range from ${minPrice} to ${maxPrice}`,
          value: stake.outcome ? Number(stake.outcome) : null,
          description: stake.outcome,
          checked: checked === stake.outcome,
          isInvalid: stake.isInvalidOutcome,
          preFilledStake: formatAttoRep(
            stake.stakeCurrent === '-' ? '0' : stake.stakeCurrent
          ).formatted,
          stake,
        });
      });
    }
    return radioButtons;
  }

  reportingAction = () => {
    const {
      marketId,
      maxPrice,
      minPrice,
      numTicks,
      numOutcomes,
      marketType,
      disputeInfo,
    } = this.props.market;
    const { isReporting } = this.state;
    let outcomeId = null;
    const selectedRadio = this.state.radioButtons.find(r => r.checked);
    // for cat and binary markets id is outcomeId
    outcomeId = selectedRadio.id;
    let isInvalid = selectedRadio.isInvalid;
    if (marketType === SCALAR) {
      // checked might be invalid outcome
      outcomeId = parseFloat(this.state.inputScalarOutcome || this.state.checked);
    }

    if (isReporting) {
      const { preFilledStake } = this.state;
      const attoRepAmount = convertDisplayValuetoAttoValue(createBigNumber(preFilledStake || '0')).toString();
      doInitialReport({
        marketId,
        maxPrice,
        minPrice,
        numTicks,
        numOutcomes,
        marketType,
        description: '',
        attoRepAmount,
        outcomeId,
        isInvalid,
      });
      // wait a moment before closing the form.
      // need to either give user wait indicator in form
      // or in the Reporting page
      // or in the market card, depending where they triggered the form modal
      setTimeout(() => this.props.closeAction(), 1000);
    } else {
      // disputing
      let tentativeWinningStake = disputeInfo.stakes.find(
        s => s.tentativeWinning
      );
      if (isInvalid) {
        tentativeWinningStake = disputeInfo.stakes.find(
          s => s.isInvalidOutcome
        );
        // only one outcome can be invalid. if choosen match outcomeIds
        outcomeId = tentativeWinningStake.outcome;
      }
      let tentativeOutcomeId = parseInt(tentativeWinningStake.outcome, 10);
      if (marketType === SCALAR) {
        tentativeOutcomeId = parseFloat(tentativeWinningStake.outcome);
      }
      if (
        tentativeOutcomeId === outcomeId
      ) {
        addRepToTentativeWinningOutcome({
          marketId,
          maxPrice,
          minPrice,
          numTicks,
          numOutcomes,
          marketType,
          description: '',
          attoRepAmount: this.state.disputeStake.inputToAttoRep,
          outcomeId,
          isInvalid,
        });
      } else {
        contribute({
          marketId,
          maxPrice,
          minPrice,
          numTicks,
          numOutcomes,
          marketType,
          description: '',
          attoRepAmount: this.state.disputeStake.inputToAttoRep,
          outcomeId,
          isInvalid,
        });
      }

      setTimeout(() => this.props.closeAction(), 1000);
    }
  };

  updateDisputeStake = (disputeStake: DisputeInputtedValues) => {
    this.setState({ disputeStake });
  };

  updateScalarOutcome = (inputScalarOutcome: string) => {
    this.setState({ inputScalarOutcome });
  };

  render() {
    const { closeAction, title, market, rep } = this.props;
    const {
      checked,
      isReporting,
      preFilledStake,
      inputScalarOutcome,
      disputeStake,
      userCurrentDisputeRound,
      radioButtons,
    } = this.state;
    const {
      description,
      marketType,
      resolutionSource,
      details,
      creationTimeFormatted,
      endTimeFormatted,
    } = market;

    return (
      <div className={Styles.ModalReporting}>
        <Title title={title} closeAction={closeAction} bright />
        <main>
          <div>
            <MarketTypeLabel marketType={marketType} />
            <span>{description}</span>
            <Subheaders
              small
              header="Resolution Source"
              subheader={resolutionSource}
            />
            <Subheaders
              small
              header="Resolution Details"
              subheader={details === null ? 'N/A' : details}
            />
            <div>
              <Subheaders
                small
                header="Date Created"
                subheader={creationTimeFormatted.formattedUtc}
              />
              <Subheaders
                small
                header="Reporting Started"
                subheader={endTimeFormatted.formattedUtc}
              />
            </div>
          </div>
          {!isReporting && (
            <div>
              <RepBalance alternate rep={rep} />
              <SecondaryButton text="Get REP" action={null} />
            </div>
          )}
          <div>
            <ReportingRadioBarGroup
              market={market}
              radioButtons={radioButtons}
              selected={checked}
              updateChecked={this.updateChecked}
              reportAction={this.reportingAction}
              preFilledStake={preFilledStake}
              updatePreFilledStake={this.updatePreFilledStake}
              disputeStake={disputeStake}
              updateDisputeStake={this.updateDisputeStake}
              updateScalarOutcome={this.updateScalarOutcome}
              inputScalarOutcome={inputScalarOutcome}
              userCurrentDisputeRound={userCurrentDisputeRound}
            />
          </div>
        </main>
      </div>
    );
  }
}
