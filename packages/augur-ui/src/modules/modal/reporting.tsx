import React, { Component } from 'react';
import { MarketData } from 'modules/types';
import { Title } from 'modules/modal/common';
import { SecondaryButton } from 'modules/common/buttons';
import { MarketTypeLabel, RepBalance } from 'modules/common/labels';
import { Subheaders } from 'modules/reporting/common';
import { RadioBarGroup } from 'modules/common/form';
import { formatAttoRep } from 'utils/format-number';
import { SCALAR, INVALID_OUTCOME_ID, REPORTING_STATE } from 'modules/common/constants';
import {
  doInitialReport,
  contribute,
  addRepToTentativeWinningOutcome,
} from 'modules/contracts/actions/contractCalls';

import Styles from 'modules/modal/modal.styles.less';

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
  disputeStake: string;
  scalarOutcome: string;
  isReporting: boolean;
}

export default class ModalReporting extends Component<
  ModalReportingProps,
  ModalReportingState
> {
  state: ModalReportingState = {
    checked: this.props.selectedOutcome
      ? this.props.selectedOutcome.toString()
      : '',
    preFilledStake: '',
    disputeStake: '',
    scalarOutcome: '',
    isReporting: this.props.market.reportingState === REPORTING_STATE.OPEN_REPORTING ||
    this.props.market.reportingState === REPORTING_STATE.DESIGNATED_REPORTING,
  };

  updateChecked = (checked: string) => {

    this.updateDisputeStake("");
    this.updatePreFilledStake("");
    this.updateScalarOutcome("");

    this.setState({ checked });
  };

  updatePreFilledStake = (preFilledStake: string) => {
    this.setState({ preFilledStake });
  };

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
    let outcomeId = parseInt(this.state.checked, 10);
    if (marketType === SCALAR) {
      // checked might be invalid outcome
      outcomeId = parseFloat(this.state.scalarOutcome || this.state.checked);
    }

    if (isReporting) {
      doInitialReport({
        marketId,
        maxPrice,
        minPrice,
        numTicks,
        numOutcomes,
        marketType,
        description: '',
        attoRepAmount: this.state.preFilledStake,
        outcomeId,
        isInvalid: this.state.checked === INVALID_OUTCOME_ID.toString(),
      });
      // wait a moment before closing the form.
      // need to either give user wait indicator in form
      // or in the Reporting page
      // or in the market card, depending where they triggered the form modal
      setTimeout(() => this.props.closeAction(), 1000);
    } else {
      // disputing
      const tentativeWinningStake = disputeInfo.stakes.find(
        s => s.tentativeWinning
      );
      let tentativeOutcomeId = parseInt(tentativeWinningStake.outcome, 10);
      if (marketType === SCALAR) {
        tentativeOutcomeId = parseFloat(tentativeWinningStake.outcome);
      }
      if (tentativeOutcomeId && tentativeOutcomeId === outcomeId) {
        addRepToTentativeWinningOutcome({
          marketId,
          maxPrice,
          minPrice,
          numTicks,
          numOutcomes,
          marketType,
          description: '',
          attoRepAmount: this.state.disputeStake,
          outcomeId,
          isInvalid: this.state.checked === INVALID_OUTCOME_ID.toString(),
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
          attoRepAmount: this.state.disputeStake,
          outcomeId,
          isInvalid: this.state.checked === INVALID_OUTCOME_ID.toString(),
        });
      }

      setTimeout(() => this.props.closeAction(), 1000);
    }
  };

  updateDisputeStake = (disputeStake: string) => {
    this.setState({ disputeStake });
  };

  updateScalarOutcome = (scalarOutcome: string) => {
    this.setState({ scalarOutcome });
  };

  render() {
    const { closeAction, title, market, rep, selectedOutcome } = this.props;
    const {
      checked,
      isReporting,
      preFilledStake,
      scalarOutcome,
      disputeStake,
    } = this.state;
    const {
      description,
      marketType,
      resolutionSource,
      details,
      creationTimeFormatted,
      endTimeFormatted,
      outcomesFormatted,
      disputeInfo,
    } = market;

    // todo: need to add already staked outcomes for scalar markets for disputing
    let sortedOutcomes = outcomesFormatted;
    if (selectedOutcome || selectedOutcome == 0) {
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
        if (!stake) {
          stake = {
            outcome: outcome.id.toString(),
            bondSizeCurrent: disputeInfo.bondSizeOfNewStake,
            stakeCurrent: '0',
            stakeRemaining: disputeInfo.bondSizeOfNewStake,
            isInvalidOutcome: false,
            isMalformedOutcome: false,
            tentativeWinning: false,
          };
        }
        return {
          header: outcome.description,
          value: outcome.id,
          checked: checked === outcome.id.toString(),
          isInvalid: outcome.id === 0,
          preFilledStake: formatAttoRep('0').formatted,
          stake,
        };
      });

    if (marketType === SCALAR) {
      disputeInfo.stakes.forEach(stake => {
        radioButtons.push({
          header: stake.outcome,
          value: Number(stake.outcome),
          checked: checked === stake.outcome.toString(),
          isInvalid: stake.outcome === '0',
          preFilledStake: formatAttoRep(stake.stakeCurrent === '-' ? '0' : stake.stakeCurrent).formatted,
          stake,
        })
      })
    }

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
            <RadioBarGroup
              onChange={this.updateChecked}
              market={market}
              radioButtons={radioButtons}
              defaultSelected={checked}
              updatePreFilledStake={this.updatePreFilledStake}
              preFilledStake={preFilledStake}
              updateDisputeStake={this.updateDisputeStake}
              disputeStake={disputeStake}
              reportAction={this.reportingAction}
              updateScalarOutcome={this.updateScalarOutcome}
              scalarOutcome={scalarOutcome}
            />
          </div>
        </main>
      </div>
    );
  }
}
