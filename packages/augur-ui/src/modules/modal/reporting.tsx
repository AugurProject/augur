import React, { Component } from 'react';
import { MarketData, DisputeInputtedValues } from 'modules/types';
import { Title } from 'modules/modal/common';
import { SecondaryButton } from 'modules/common/buttons';
import {
  MarketTypeLabel,
  RedFlag,
  RepBalance,
  TemplateShield,
} from 'modules/common/labels';
import {
  ReportingRadioBarGroup,
  ReportingRadioBarProps,
  MigrateRepInfo,
  Error
} from 'modules/common/form';
import {
  SCALAR,
  REPORTING_STATE,
  INVALID_OUTCOME_LABEL,
  SUBMIT_REPORT,
  SUBMIT_DISPUTE,
  MARKETMIGRATED,
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
import type { Getters } from '@augurproject/sdk';
import { TXEventName } from '@augurproject/sdk-lite';
import { loadAccountCurrentDisputeHistory } from 'modules/auth/actions/load-account-reporting';
import ReleasableRepNotice from 'modules/reporting/containers/releasable-rep-notice';
import { MultipleExplainerBlock } from 'modules/create-market/components/common';
import {
  AugurMarketsContent,
  EventDetailsContent,
  WarpSyncErrorHeader,
  WarpSyncErrorSubheader
} from 'modules/create-market/constants';
import CoreProperties from 'modules/market/components/core-properties/core-properties';
import MarkdownRenderer from 'modules/common/markdown-renderer';
import MarketLink from 'modules/market/components/market-link/market-link';

interface ModalReportingProps {
  closeAction: Function;
  market: MarketData;
  rep: string;
  availableEthBalance: string;
  title: string;
  selectedOutcome?: number;
  isInvalid?: boolean;
  reportAction: Function;
  userAccount?: string;
  migrateRep: boolean;
  migrateMarket: boolean;
  isDisputing: boolean;
  getRepModal: Function;
  addPendingData: Function;
  warpSyncHash?: string;
  addPendingReport: Function;
  addPendingDispute: Function;
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
    inputScalarOutcome:
      this.props.market.isWarpSync &&
      (this.props.market.reportingState === REPORTING_STATE.OPEN_REPORTING ||
        this.props.market.reportingState ===
          REPORTING_STATE.DESIGNATED_REPORTING)
        ? this.props.warpSyncHash
        : '',
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
      radioValue && radioValue.value && String(radioValue.value)
        ? String(radioValue.value)
        : ''
    );
    this.setState({ radioButtons, checked: selected });
  };

  buildRadioButtonCollection = () => {
    const { market, selectedOutcome, warpSyncHash, isInvalid } = this.props;
    const { checked } = this.state;
    const {
      marketType,
      outcomesFormatted,
      disputeInfo,
      minPrice,
      maxPrice,
      isWarpSync,
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
          description: stake && stake.outcome ? stake.outcome : '',
          checked: checked === outcome.id.toString(),
          isInvalid: outcome.id === 0,
          stake,
        };
      });

    if (isWarpSync) {
      if (selectedOutcome && String(selectedOutcome) !== 'null')
        this.updateScalarOutcome(String(selectedOutcome));
      radioButtons = [];
      disputeInfo.stakes
        .filter(stake => !stake.isInvalidOutcome)
        .forEach(stake => {
          const warpSyncHashValue = stake && stake.warpSyncHash;

          radioButtons.push({
            id: String(stake.outcome),
            header: warpSyncHashValue || `Enter a hash value`,
            value: warpSyncHashValue || warpSyncHash,
            description: warpSyncHashValue || stake.outcome,
            checked: checked === stake.outcome,
            isInvalid: false,
            stake,
          });
        });
    } else if (marketType === SCALAR) {
      if (selectedOutcome && String(selectedOutcome) !== 'null')
        this.updateScalarOutcome(String(selectedOutcome));
      radioButtons = [];
      const denomination = market.scalarDenomination;
      disputeInfo.stakes.forEach(stake => {
        const populatedHeader = stake.isInvalidOutcome
          ? INVALID_OUTCOME_LABEL
          : `${stake.outcome} ${denomination}`;
        radioButtons.push({
          id: String(stake.outcome),
          header: stake.outcome
            ? populatedHeader
            : `Enter a range from ${minPrice} to ${maxPrice}`,
          value: stake.outcome ? Number(stake.outcome) : null,
          description: stake.outcome,
          checked: (checked === stake.outcome && stake.isInvalidOutcome === isInvalid),
          isInvalid: stake.isInvalidOutcome,
          stake,
        });
      });
    }
    return radioButtons;
  };

  reportingAction = (estimateGas: boolean = false) => {
    const {
      migrateMarket,
      migrateRep,
      market,
      addPendingData,
      addPendingReport,
      addPendingDispute,
    } = this.props;
    const {
      marketId,
      maxPrice,
      minPrice,
      numTicks,
      numOutcomes,
      marketType,
      disputeInfo,
      isWarpSync,
      noShowBondAmount
    } = market;
    const { isReporting } = this.state;
    let outcomeId = null;
    const selectedRadio = this.state.radioButtons.find(r => r.checked);
    // for cat and binary markets id is outcomeId
    outcomeId = selectedRadio.id;
    let isSelectedOutcomeInvalid = selectedRadio.isInvalid;
    if (marketType === SCALAR) {
      // checked might be invalid outcome
      // check if existing outcomeId
      // check if new scalar outcome, outcomeId is 'null' in this case
      const inputted = outcomeId === "null" ? parseFloat(
        this.state.inputScalarOutcome) : outcomeId;
      outcomeId = estimateGas ? minPrice : !!this.state.inputScalarOutcome ? inputted : this.state.checked;
    }

    const report = {
      marketId,
      maxPrice,
      minPrice,
      numTicks,
      numOutcomes,
      marketType,
      description: '',
      attoRepAmount: estimateGas
        ? noShowBondAmount
        : this.state.inputtedReportingStake.inputToAttoRep,
      outcomeId,
      isInvalid: isSelectedOutcomeInvalid,
      warpSyncHash: isWarpSync && selectedRadio.value || this.state.inputScalarOutcome,
      isWarpSync,
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
        addPendingData(marketId, MARKETMIGRATED, TXEventName.Pending, '0', undefined);
        reportAndMigrateMarket(report).catch(err => {
          addPendingData(marketId, MARKETMIGRATED, TXEventName.Failure, '0', undefined);
        });
      }
    } else if (isReporting) {
      if (estimateGas) {
        return doInitialReport_estimaetGas(report);
      } else {
        addPendingReport(report);
        doInitialReport(report).catch(err => {
          addPendingData(marketId, SUBMIT_REPORT, TXEventName.Failure, 0, {});
        });
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
        if (selectedOutcome && selectedOutcome.tentativeWinning)
          contributeToTentativeWinner = true;
      }

      if (estimateGas) {
        if (contributeToTentativeWinner) {
          return addRepToTentativeWinningOutcome_estimateGas(report);
        } else {
          return contribute_estimateGas(report);
        }
      } else {
        addPendingDispute(report, {
          matchingId: report.outcomeId,
        });
        (contributeToTentativeWinner
          ? addRepToTentativeWinningOutcome(report)
          : contribute(report)
        ).catch(err => {
          addPendingData(marketId, SUBMIT_DISPUTE, TXEventName.Failure, 0, {
            matchingId: report.outcomeId,
          });
        });
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
    const {
      closeAction,
      title,
      market,
      rep,
      migrateRep,
      isDisputing,
      getRepModal,
      warpSyncHash,
      availableEthBalance
    } = this.props;
    const {
      checked,
      inputScalarOutcome,
      inputtedReportingStake,
      userCurrentDisputeRound,
      radioButtons,
    } = this.state;
    const { description, marketType, details, isTemplate, marketId } = market;

    return (
      <div className={Styles.ModalReporting}>
        <Title title={title} closeAction={closeAction} bright />
        <main>
          {market.isWarpSync && !warpSyncHash &&
            <Error header={WarpSyncErrorHeader} subheader={WarpSyncErrorSubheader} />
          }
          {migrateRep && <MigrateRepInfo />}
          <MultipleExplainerBlock
            isModal
            contents={[
              {
                title: AugurMarketsContent().explainerBlockTitle,
                subtexts: AugurMarketsContent().explainerBlockSubtexts,
                useBullets: AugurMarketsContent().useBullets,
              },
              {
                title: EventDetailsContent().explainerBlockTitle,
                subtexts: EventDetailsContent().explainerBlockSubtexts,
                useBullets: EventDetailsContent().useBullets,
              },
            ]}
          />
          <div>
            <section>
              <MarketTypeLabel
                marketType={marketType}
                isWarpSync={market.isWarpSync}
              />
              <RedFlag market={market} />
              {isTemplate && <TemplateShield market={market} />}
            </section>
            <MarketLink id={marketId}>
              <span>{description}</span>
            </MarketLink>
            {details && details.length > 0 && (
              <div className={Styles.Details}>
                <h2>Resolution Details</h2>
                <MarkdownRenderer text={details} hideLabel />
              </div>
            )}
            <CoreProperties market={market} reportingBarShowing={false} />
          </div>
          {isDisputing && (
            <div>
              <RepBalance alternate rep={rep} />
              <SecondaryButton text="Get REPv2" action={() => getRepModal()} />
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
              availableEthBalance={availableEthBalance}
            />
          </div>
        </main>
      </div>
    );
  }
}
