import React, { Component } from 'react';
import { MarketData } from 'modules/types';
import { Title } from 'modules/modal/common';
import { SecondaryButton } from 'modules/common/buttons';
import { MarketTypeLabel, RepBalance } from 'modules/common/labels';
import { Subheaders } from 'modules/reporting/common';
import { RadioBarGroup } from 'modules/common/form';
import { formatAttoRep } from 'utils/format-number';
import { SCALAR, INVALID_OUTCOME_ID } from 'modules/common/constants';
import {
  doInitialReport,
  contribute,
  addRepToTentativeWinningOutcome,
} from 'modules/contracts/actions/contractCalls';

import Styles from 'modules/modal/modal.styles.less';
import { Getters } from '@augurproject/sdk';

interface ModalReportingProps {
  closeAction: Function;
  market: MarketData;
  rep: string;
  isReporting: boolean;
  title: string;
  selectedOutcome?: number;
  reportAction: Function;
}

interface ModalReportingState {
  checked: string;
  preFilledStake: string;
  disputeStake: string;
  scalarOutcome: string;
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
    let outcomeId = parseInt(this.state.checked, 10);
    if (marketType === SCALAR) {
      // checked might be invalid outcome
      outcomeId = parseFloat(this.state.scalarOutcome || this.state.checked);
    }

    if (this.props.isReporting) {
      doInitialReport({
        marketId,
        maxPrice,
        minPrice,
        numTicks,
        numOutcomes,
        marketType,
        description: '',
        amount: this.state.preFilledStake,
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
          amount: this.state.disputeStake,
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
          amount: this.state.disputeStake,
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
    const { closeAction, title, market, rep, isReporting } = this.props;
    const s = this.state;
    const {
      description,
      marketType,
      resolutionSource,
      details,
      creationTimeFormatted,
      endTimeFormatted,
      scalarDenomination,
      minPrice,
      maxPrice,
      outcomesFormatted,
      disputeInfo,
      noShowBondAmountFormatted, // this will be on MarketData once added to MarketInfo object
    } = market;

    // todo: need to add already staked outcomes for scalar markets for disputing

    let radioButtons = outcomesFormatted
      .filter(outcome => (marketType === SCALAR ? outcome.id === 0 : true))
      .map(outcome => {
        let stake = disputeInfo.stakes.find(
          stake => parseFloat(stake.outcome) === outcome.id
        );
        if (!stake) {
          stake = {
            tentativeWinning: false,
            bondSizeCurrent: '0',
            bondSizeTotal: disputeInfo.bondSizeOfNewStake,
            preFilledStake: '0',
            stakeCurrent: '0',
          };
        }
        return {
          header: outcome.description,
          value: outcome.id,
          checked: s.checked === outcome.id.toString(),
          isInvalid: outcome.id === 0,
          stake: {
            ...stake,
            stakeCurrent: formatAttoRep(stake.stakeCurrent),
            preFilledStake: formatAttoRep(stake.preFilledStake),
            bondSizeCurrent: formatAttoRep(stake.bondSizeCurrent),
            bondSizeTotal: formatAttoRep(stake.bondSizeTotal),
          },
        };
      });

    if (marketType === SCALAR) {
      disputeInfo.stakes.forEach(stake => {
        radioButtons.push({
          header: stake.outcome,
          value: stake.outcome,
          checked: s.checked === stake.outcome.toString(),
          isInvalid: stake.outcome === "0",

          stake: {
            ...stake,
            preFilledStake: formatAttoRep(stake.preFilledStake),
            bondSizeCurrent: formatAttoRep(stake.bondSizeCurrent),
            bondSizeTotal: formatAttoRep(stake.bondSizeTotal),
          },
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
              reporting={true}
              isReporting={isReporting}
              marketType={marketType}
              minPrice={minPrice}
              maxPrice={maxPrice}
              scalarDenomination={scalarDenomination}
              radioButtons={radioButtons}
              defaultSelected={s.checked}
              updatePreFilledStake={this.updatePreFilledStake}
              preFilledStake={s.preFilledStake}
              updateDisputeStake={this.updateDisputeStake}
              disputeStake={s.disputeStake}
              reportAction={this.reportingAction}
              updateScalarOutcome={this.updateScalarOutcome}
              scalarOutcome={s.scalarOutcome}
            />
          </div>
        </main>
      </div>
    );
  }
}
