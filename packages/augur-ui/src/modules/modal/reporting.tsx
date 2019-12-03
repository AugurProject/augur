import React, { Component } from 'react';
import { MarketData, DisputeInputtedValues } from 'modules/types';
import { Title } from 'modules/modal/common';
import { SecondaryButton } from 'modules/common/buttons';
import { MarketTypeLabel, RepBalance } from 'modules/common/labels';
import { Subheaders } from 'modules/reporting/common';
import {
  ReportingRadioBarGroup,
  ReportingRadioBarProps,
  MigrateRepInfo,
} from 'modules/common/form';
import {
  SCALAR,
  REPORTING_STATE,
  INVALID_OUTCOME_NAME,
} from 'modules/common/constants';
import {
  doInitialReport,
  contribute,
  addRepToTentativeWinningOutcome,
  migrateRepToUniverse,
  reportAndMigrateMarket,
  migrateRepToUniverseEstimateGas,
  reportAndMigrateMarket_estimateGas,
  doInitialReport_estimaetGas,
  addRepToTentativeWinningOutcome_estimateGas,
  contribute_estimateGas,
} from 'modules/contracts/actions/contractCalls';

import Styles from 'modules/modal/modal.styles.less';
import { Getters } from '@augurproject/sdk';
import { loadAccountCurrentDisputeHistory } from 'modules/auth/actions/load-account-reporting';
import ReleasableRepNotice from 'modules/reporting/containers/releasable-rep-notice';

interface ModalReportingProps {
  closeAction: Function;
  market: MarketData;
  rep: string;
  title: string;
  selectedOutcome?: number;
  reportAction: Function;
  userAccount?: string;
  migrateRep: boolean;
  migrateMarket: boolean;
  isDisputing: boolean;
  getRepModal: Function;
}

interface ModalReportingState {
  checked: string;
  inputtedReportingStake: DisputeInputtedValues;
  inputScalarOutcome: string;
  isReporting: boolean;
  userCurrentDisputeRound:
    | Getters.Accounts.UserCurrentOutcomeDisputeStake[]
    | [];
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
    inputtedReportingStake: { inputStakeValue: '', inputToAttoRep: '' },
    inputScalarOutcome: '',
    isReporting:
      this.props.market.reportingState === REPORTING_STATE.OPEN_REPORTING ||
      this.props.market.reportingState === REPORTING_STATE.DESIGNATED_REPORTING,
    userCurrentDisputeRound: [],
    radioButtons: [],
  };

  componentDidMount = () => {
    const { market, userAccount } = this.props;
    loadAccountCurrentDisputeHistory(
      market.marketId,
      userAccount,
      (err, userCurrentDisputeRound) => {
        if (err) {
          return console.error(
            'could not get user current dispute round values',
            err
          );
        }
        this.setState({
          userCurrentDisputeRound: userCurrentDisputeRound
            ? userCurrentDisputeRound
            : [],
        });
      }
    );
    this.setState({ radioButtons: this.buildRadioButtonCollection() });
  };

  updateChecked = (selected: string, isInvalid: boolean = false) => {
    const { radioButtons } = this.state;
    this.updateInputtedStake({ inputStakeValue: '', inputToAttoRep: '' });
    radioButtons.map(r =>
      r.id === selected && r.isInvalid === isInvalid
        ? (r.checked = true)
        : (r.checked = false)
    );
    const radioValue = radioButtons.find(r => r.checked);
    this.updateScalarOutcome(
      String(radioValue.value) ? String(radioValue.value) : ''
    );
    this.setState({ radioButtons, checked: selected });
  };

  buildRadioButtonCollection = () => {
    const { market, selectedOutcome } = this.props;
    const { checked } = this.state;
    const {
      marketType,
      outcomesFormatted,
      disputeInfo,
      minPrice,
      maxPrice,
    } = market;

    let sortedOutcomes = outcomesFormatted;
    if (selectedOutcome !== null) {
      const selected = outcomesFormatted.find(
        o => o.id === Number(selectedOutcome)
      );
      if (selected) {
        sortedOutcomes = [
          selected,
          ...outcomesFormatted.filter(o => o.id !== Number(selectedOutcome)),
        ];
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
          stake,
        });
      });
    }
    return radioButtons;
  };

  reportingAction = (estimateGas = false) => {
    const { migrateMarket, migrateRep, market } = this.props;
    const {
      marketId,
      maxPrice,
      minPrice,
      numTicks,
      numOutcomes,
      marketType,
      disputeInfo,
    } = market;
    const { isReporting } = this.state;
    let outcomeId = null;
    const selectedRadio = this.state.radioButtons.find(r => r.checked);
    // for cat and binary markets id is outcomeId
    outcomeId = selectedRadio.id;
    let isSelectedOutcomeInvalid = selectedRadio.isInvalid;
    if (marketType === SCALAR) {
      // checked might be invalid outcome
      outcomeId = parseFloat(
        this.state.inputScalarOutcome || this.state.checked
      );
    }
    const ONE_REP = '1000000000000000000';
    const report = {
      marketId,
      maxPrice,
      minPrice,
      numTicks,
      numOutcomes,
      marketType,
      description: '',
      attoRepAmount: estimateGas ? ONE_REP : this.state.inputtedReportingStake.inputToAttoRep,
      outcomeId,
      isInvalid: isSelectedOutcomeInvalid,
    };

    if (migrateRep) {
      if (estimateGas) {
        return migrateRepToUniverseEstimateGas(report);
      } else {
        migrateRepToUniverse(report);
      }
    } else if (migrateMarket) {
      if (estimateGas) {
        return reportAndMigrateMarket_estimateGas(report);
      } else {
        reportAndMigrateMarket(report);
      }
    } else if (isReporting) {
      if (estimateGas) {
        return doInitialReport_estimaetGas(report);
      } else {
        doInitialReport(report);
      }
    } else {
      // disputing
      let contributeToTentativeWinner = false;
      const tentativeWinningStake = disputeInfo.stakes.find(
        s => s.tentativeWinning
      );
      if (isSelectedOutcomeInvalid && tentativeWinningStake.isInvalidOutcome) {
        contributeToTentativeWinner = true;
      }
      if (tentativeWinningStake.outcome === report.outcomeId) {
        contributeToTentativeWinner = true;
      }
      if (marketType === SCALAR) {
        const selectedOutcome = disputeInfo.stakes.find(
          s => s.outcome === selectedRadio.id
        );
        if (selectedOutcome && selectedOutcome.tentativeWinning) contributeToTentativeWinner = true
      }

      if (estimateGas) {
        if (contributeToTentativeWinner) {
          return addRepToTentativeWinningOutcome_estimateGas(report);
        } else {
          return contribute_estimateGas(report);
        }
      } else {
        contributeToTentativeWinner
        ? addRepToTentativeWinningOutcome(report)
        : contribute(report);
      }
    }
    if (!estimateGas) {
      setTimeout(() => this.props.closeAction(), 1000);
    }
  };

  updateInputtedStake = (inputtedReportingStake: DisputeInputtedValues) => {
    this.setState({ inputtedReportingStake });
  };

  updateScalarOutcome = (inputScalarOutcome: string) => {
    this.setState({ inputScalarOutcome });
  };

  render() {
    const { closeAction, title, market, rep, migrateRep, isDisputing, getRepModal } = this.props;
    const {
      checked,
      inputScalarOutcome,
      inputtedReportingStake,
      userCurrentDisputeRound,
      radioButtons,
    } = this.state;
    const {
      description,
      marketType,
      details,
      creationTimeFormatted,
      endTimeFormatted,
    } = market;

    return (
      <div className={Styles.ModalReporting}>
        <Title title={title} closeAction={closeAction} bright />
        <main>
          <div>
            {migrateRep &&
              <MigrateRepInfo />
            }
            <MarketTypeLabel marketType={marketType} />
            <span>{description}</span>
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
                header="Event Expiration"
                subheader={endTimeFormatted.formattedUtc}
              />
            </div>
          </div>
          {isDisputing && (
            <div>
              <RepBalance alternate rep={rep} />
              <SecondaryButton text="Get REP" action={() => getRepModal()} />
            </div>
          )}
          <ReleasableRepNotice />
          <div>
            <ReportingRadioBarGroup
              market={market}
              radioButtons={radioButtons}
              selected={checked}
              updateChecked={this.updateChecked}
              reportAction={this.reportingAction}
              inputtedReportingStake={inputtedReportingStake}
              updateInputtedStake={this.updateInputtedStake}
              updateScalarOutcome={this.updateScalarOutcome}
              inputScalarOutcome={inputScalarOutcome}
              userCurrentDisputeRound={userCurrentDisputeRound}
              isDisputing={isDisputing}
            />
          </div>
        </main>
      </div>
    );
  }
}
