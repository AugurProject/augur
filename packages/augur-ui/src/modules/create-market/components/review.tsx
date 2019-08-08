import React from "react";
import classNames from "classnames";

import { createBigNumber } from 'utils/create-big-number';
import getValue from 'utils/get-value';
import findInsufficientFunds, { InsufficientFunds } from 'modules/markets/helpers/insufficient-funds';
import {
  Header,
  LineBreak,
  SmallSubheaders,
  Subheaders,
  OutcomesList,
  SmallSubheadersTooltip,
  NoFundsErrors
} from "modules/create-market/components/common";
import { LinearPropertyLabel, LinearPropertyLabelTooltip } from "modules/common/labels";
import {
  SCALAR,
  CATEGORICAL,
  EXPIRY_SOURCE_GENERIC,
  DESIGNATED_REPORTER_SELF,
  ETH,
  DAI,
  REP
} from "modules/common/constants";
import { MARKET_TYPE_NAME } from "modules/create-market/constants";
import { getCreateMarketBreakdown } from 'modules/contracts/actions/contractCalls';
import {
  formatEtherEstimate,
  formatGasCostToEther,
  formatDai,
  formatEther,
} from 'utils/format-number';
import { NewMarket, FormattedNumber } from 'modules/types';

import Styles from "modules/create-market/components/review.styles.less";

interface ReviewProps {
  newMarket: NewMarket;
  updateNewMarket: Function;
  address: string;
  gasPrice: string;
  availableRepFormatted: FormattedNumber;
  availableEthFormatted: FormattedNumber;
  availableDaiFormatted: FormattedNumber;
  estimateSubmitNewMarket: Function;
}

interface ReviewState {
  gasCost: FormattedNumber;
  validityBond: FormattedNumber;
  designatedReportNoShowReputationBond: FormattedNumber;
  insufficientFunds: InsufficientFunds;
  formattedInitialLiquidityDai: FormattedNumber;
  formattedInitialLiquidityGas: FormattedNumber;
}

export default class Review extends React.Component<
  ReviewProps,
  ReviewState
> {
  state: ReviewState = {
    gasCost: null,
    validityBond: null,
    designatedReportNoShowReputationBond: null,
    insufficientFunds: {},
    formattedInitialLiquidityDai: formatEtherEstimate(
      this.props.newMarket.initialLiquidityDai
    ),
    formattedInitialLiquidityGas: formatEtherEstimate(
      formatGasCostToEther(
        this.props.newMarket.initialLiquidityGas,
        { decimalsRounded: 4 },
        this.props.gasPrice
      )
    ),
  };

  componentWillMount() {
    this.calculateMarketCreationCosts();
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { newMarket, gasPrice } = this.props;
    if (
      newMarket.initialLiquidityDai !== nextProps.newMarket.initialLiquidityDai
    )
      this.setState({
        formattedInitialLiquidityDai: formatEtherEstimate(
          nextProps.newMarket.initialLiquidityDai
        ),
      });
    if (
      newMarket.initialLiquidityGas !==
        nextProps.newMarket.initialLiquidityGas ||
      gasPrice !== nextProps.gasPrice
    ) {
      this.setState(
        {
          formattedInitialLiquidityGas: formatEtherEstimate(
            formatGasCostToEther(
              nextProps.newMarket.initialLiquidityGas,
              { decimalsRounded: 4 },
              gasPrice
            )
          ),
        },
        () => {
          this.calculateMarketCreationCosts();
        }
      );
    }
    if (this.state.validityBond !== nextState.validityBond) {
      if (nextState.validityBond) {
        const insufficientFunds = this.getInsufficientFundsAmounts();
        if (this.state.insufficientFunds !== insufficientFunds) {
          this.updateFunds(insufficientFunds);
        }
      }
    }
    if (
      this.props.availableEthFormatted.value !== nextProps.availableEthFormatted.value ||
      this.props.availableRepFormatted.value !== nextProps.availableRepFormatted.value
    ) {
      this.calculateMarketCreationCosts();
    }
  }

  getInsufficientFundsAmounts(testWithLiquidity = false): InsufficientFunds {
    const { availableEthFormatted, availableRepFormatted, availableDaiFormatted } = this.props;
    const s = this.state;
    let insufficientFunds: InsufficientFunds = null;

    if (s.validityBond) {
      const validityBond = getValue(s, 'validityBond.formattedValue');
      const gasCost = getValue(s, 'gasCost.formattedValue');
      const designatedReportNoShowReputationBond = getValue(
        s,
        'designatedReportNoShowReputationBond.formattedValue'
      );
      const formattedInitialLiquidityGas = getValue(
        s,
        'formattedInitialLiquidityGas.formattedValue'
      );
      const formattedInitialLiquidityDai = getValue(
        s,
        'formattedInitialLiquidityDai.formattedValue'
      );
      insufficientFunds = findInsufficientFunds(
        validityBond,
        gasCost || '0',
        designatedReportNoShowReputationBond,
        createBigNumber(availableEthFormatted.value || '0'),
        createBigNumber(availableRepFormatted.value || '0'),
        createBigNumber(availableDaiFormatted.value || '0'),
        formattedInitialLiquidityGas || '0',
        formattedInitialLiquidityDai || '0',
        testWithLiquidity
      );
    }

    return insufficientFunds;
  }

  updateFunds(insufficientFunds) {
    this.setState({ insufficientFunds });
  }

  async calculateMarketCreationCosts() {
    const { newMarket, gasPrice } = this.props;

    const marketCreationCostBreakdown = await getCreateMarketBreakdown();
    this.setState(
      {
        designatedReportNoShowReputationBond:
          marketCreationCostBreakdown.noShowFormatted
        ,
        validityBond: marketCreationCostBreakdown.validityBondFormatted
        ,
      },
      () => {
        const funds = this.getInsufficientFundsAmounts();
        if (funds) {
          this.updateFunds(funds);
        }

        this.props.estimateSubmitNewMarket(
          newMarket,
          (err, gasEstimateValue) => {
            if (err) console.error(err);
            this.setState(
              {
                gasCost: formatEtherEstimate(
                  formatGasCostToEther(
                    gasEstimateValue || '0',
                    { decimalsRounded: 4 },
                    gasPrice
                  )
                ),
              },
              () => {
                this.updateFunds(this.getInsufficientFundsAmounts(true));
              }
            );
          }
        );
      }
    );
  }

  render() {
    const {
      newMarket,
      availableEthFormatted,
      availableDaiFormatted,
      availableRepFormatted,
    } = this.props;
    const s = this.state;

    const {
      categories,
      marketType,
      description,
      endTimeFormatted,
      detailsText,
      expirySourceType,
      expirySource,
      designatedReporterType,
      designatedReporterAddress,
      scalarDenomination,
      minPrice,
      maxPrice,
      tickSize,
      outcomes,
      settlementFee,
      affiliateFee
    } = newMarket;

    const totalDai = formatDai(createBigNumber(s.validityBond ? s.validityBond.value : 0).plus(createBigNumber(s.formattedInitialLiquidityDai ? s.formattedInitialLiquidityDai.value : 0)));
    const totalEth = formatEther(createBigNumber(s.formattedInitialLiquidityGas ? s.formattedInitialLiquidityGas.value : 0).plus(createBigNumber(s.gasCost ? s.gasCost.value : 0)));

    const noEth = s.insufficientFunds[ETH];
    const noRep = s.insufficientFunds[REP];
    const noDai = s.insufficientFunds[DAI];

    return (
      <div className={classNames(Styles.Review, {[Styles.Scalar]: marketType === SCALAR, [Styles.Categorical]: marketType === CATEGORICAL})}>
        <Header text="Market details" />
        <div>
          <SmallSubheaders header="Market Type" subheader={MARKET_TYPE_NAME[marketType]} />
          <SmallSubheaders header="Primary Category" subheader={categories[0]} />
          <SmallSubheaders header="Secondary category" subheader={categories[1]} />
          <SmallSubheaders header="Tertiary category" subheader={categories[2] === "" ? "–" : categories[2]} />
          <SmallSubheaders header="Market Question" subheader={description} />
          {marketType === SCALAR &&
            <>
              <SmallSubheaders header="Unit of Measurement" subheader={scalarDenomination} />
              <SmallSubheaders header="Numeric range" subheader={minPrice + "-" + maxPrice} />
              <SmallSubheaders header="precision" subheader={tickSize.toString()} />
            </>
          }
          {marketType === CATEGORICAL &&
            <OutcomesList
              outcomes={outcomes}
            />
          }
          <SmallSubheaders header="Market creator fee" subheader={settlementFee + "%"} />
          <SmallSubheadersTooltip tooltipSubheader header="Affiliate fee" subheader={affiliateFee + "%"} text="The affiliate fee % is a percentage of the market creator fee" />
        </div>

        <LineBreak />
        <Header text="Resolution information" />
        <div>
          <SmallSubheaders header="Reporting start date and time" subheader={endTimeFormatted.formattedUtc} />
          <SmallSubheaders header="resolution details" subheader={detailsText === "" ? "–" : detailsText} />
          <SmallSubheaders
            header="Resolution source"
            subheader={expirySourceType === EXPIRY_SOURCE_GENERIC
              ? "General knowledge"
              : `Outcome will be detailed on public website: ${
                  expirySource
                }`}
          />
          <SmallSubheaders
            header="Designated Reporter"
            subheader={designatedReporterType === DESIGNATED_REPORTER_SELF
                  ? "Myself"
                  : `Someone else: ${designatedReporterAddress}`}
          />
        </div>

        <LineBreak />
        <Header text="Funds required" />
        <div>
          <Subheaders header="Validity bond" subheader={"The bond is paid in ETH and is refunded to the Market Creator if the Final Outcome of the Market is not Invalid. The Validity Bond is a dynamic amount based on the percentage of Markets in Augur that are being Finalized as Invalid."} link />
          <span>
            <LinearPropertyLabel
              label={"Valididty Bond"}
              value={s.validityBond && s.validityBond.formattedValue + " DAI"}
            />
          </span>

          <Subheaders header="No-show bond" subheader={"A “no-show” bond must be put up by the market creator which is lost if the designated reporter doesn’t show up on time (within 3 days of the market end time) to put forth the initial tentative outcome."} link />
          <span>
            <LinearPropertyLabel
              label={"No-Show Bond"}
              value={s.designatedReportNoShowReputationBond && s.designatedReportNoShowReputationBond.formattedValue + " REP"}
            />
          </span>

          <Subheaders header="Initial liquidity" subheader={"The total of the initial batch of orders you added on the previous step."} />
          <span>
            <LinearPropertyLabel
              label={"Initial Liquidity"}
              value={s.formattedInitialLiquidityDai.formattedValue + " DAI"}
            />
            <LinearPropertyLabelTooltip
              label={"Estimated Gas Cost"}
              value={s.formattedInitialLiquidityGas.formattedValue + " ETH"}
            />
          </span>

          <Subheaders header="Totals" subheader={"Sum total of DAI, ETH and REP required to create this market"} />
          <span>
            <LinearPropertyLabel
              label={"Total DAI"}
              value={totalDai.formattedValue + " DAI"}
            />
            <LinearPropertyLabel
              label={"Total ETH"}
              value={totalEth.formattedValue + " ETH"}
            />
            <LinearPropertyLabel
              label={"TOTAL REP"}
              value={s.designatedReportNoShowReputationBond && s.designatedReportNoShowReputationBond.formattedValue + " REP"}
            />
          </span>
          <NoFundsErrors
            noEth={noEth}
            noRep={noRep}
            noDai={noDai}
            availableDaiFormatted={availableDaiFormatted}
            availableEthFormatted={availableEthFormatted}
            availableRepFormatted={availableRepFormatted}
            totalDai={totalDai}
            totalEth={totalEth}
            totalRep={s.designatedReportNoShowReputationBond}
          />
        </div>
      </div>
    );
  }
}
