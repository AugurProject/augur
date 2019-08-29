import React, { Component } from "react";
import classNames from "classnames";

import { MarketData } from "modules/types";
import { Title } from "modules/modal/common";
import { SecondaryButton } from "modules/common/buttons";
import { MarketTypeLabel, RepBalance } from "modules/common/labels";
import { Subheaders } from 'modules/reporting/common';
import { RadioBarGroup } from 'modules/common/form';
import { formatAttoRep } from "utils/format-number";
import { SCALAR } from 'modules/common/constants';

import Styles from "modules/modal/modal.styles.less";

interface ModalReportingProps {
  closeAction: Function;
  market: MarketData;
  rep: string;
  isReporting: boolean;
  title: string;
}

interface ModalReportingState {
  checked: number;
}

export default class ModalReporting extends Component<ModalReportingProps, ModalReportingState> {
  state: ModalReportingState = {
    checked: null,
  };

  updateChecked = (checked: number) => {
    this.setState({checked});
  }

  render() {
    const { 
      closeAction, 
      title, 
      market, 
      rep, 
      isReporting 
    } = this.props;
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
      disputeInfo
    } = market;

    // todo: need to add already staked outcomes for scalar markets for disputing
    const radioButtons = outcomesFormatted.filter(outcome => marketType === SCALAR ? outcome.id === 0 : true).map(outcome => {
      let stake = disputeInfo.stakes.find(stake => parseFloat(stake.outcome) === outcome.id);
      if (!stake) {
        stake = {
          tentativeWinning: false,
          bondSizeCurrent: "0",
          bondSizeTotal: disputeInfo.bondSizeOfNewStake,
          preFilledStake: "0",
        }
      }
      return {
        header: outcome.description,
        value: outcome.id,
        checked: s.checked === outcome.id,
        isInvalid: outcome.id === 0,
        stake: {
          ...stake,
          preFilledStake: formatAttoRep(stake.preFilledStake),
          bondSizeCurrent: formatAttoRep(stake.bondSizeCurrent),
          bondSizeTotal: formatAttoRep(stake.bondSizeTotal),
        }
      };
    });

    return (
      <div className={Styles.ModalReporting}>
        <Title title={title} closeAction={closeAction} bright />
        <main>
          <div>
            <MarketTypeLabel marketType={marketType} />
            <span>{description}</span>
            <Subheaders small header="Resolution Source" subheader={resolutionSource} />
            <Subheaders small header="Resolution Details" subheader={details === null ? "N/A" : details} />
            <div>
              <Subheaders small header="Date Created" subheader={creationTimeFormatted.formattedUtc} />
              <Subheaders small header="Reporting Started" subheader={endTimeFormatted.formattedUtc} />
            </div>
          </div>
          {!isReporting &&
            <div>
              <RepBalance alternate rep={rep} />
              <SecondaryButton text="Get REP" action={null} />
            </div>
          }
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
            />
          </div>
        </main>
      </div>
    );
  }
}
