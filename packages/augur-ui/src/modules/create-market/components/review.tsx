import React from 'react';
import classNames from 'classnames';

import { createBigNumber, BigNumber } from 'utils/create-big-number';
import getValue from 'utils/get-value';
import findInsufficientFunds, { InsufficientFunds } from 'modules/markets/helpers/insufficient-funds';
import {
  Header,
  LineBreak,
  SmallSubheaders,
  Subheaders,
  OutcomesList,
  SmallSubheadersTooltip,
  NoFundsErrors,
  DateTimeHeaders,
  PreviewMarketTitleHeader
} from "modules/create-market/components/common";
import { LinearPropertyLabel, TransactionFeeLabel } from "modules/common/labels";
import {
  SCALAR,
  CATEGORICAL,
  DESIGNATED_REPORTER_SELF,
  ETH,
  DAI,
  REP,
  GWEI_CONVERSION
} from 'modules/common/constants';
import { MARKET_TYPE_NAME, MARKET_COPY_LIST } from 'modules/create-market/constants';
import { getCreateMarketBreakdown } from 'modules/contracts/actions/contractCalls';
import {
  formatEtherEstimate,
  formatGasCostToEther,
  formatDaiPrice,
  formatEther,
  formatDai,
} from 'utils/format-number';
import { NewMarket, FormattedNumber } from 'modules/types';

import Styles from 'modules/create-market/components/review.styles.less';
import { buildResolutionDetails } from 'modules/create-market/get-template';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { ActivateWalletButton } from 'modules/reporting/common';

interface ReviewProps {
  newMarket: NewMarket;
  address: string;
  gasPrice: string;
  availableRepFormatted: FormattedNumber;
  availableEthFormatted: FormattedNumber;
  availableDaiFormatted: FormattedNumber;
  estimateSubmitNewMarket: Function;
  GsnEnabled: boolean;
  setDisableCreate: Function;
  setIsApproved: Function;
  showAddFundsModal: Function;
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

  constructor(props: ReviewProps) {
    super(props);

    this.state = {
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
          createBigNumber(GWEI_CONVERSION).multipliedBy(this.props.gasPrice)
        )
      ),
    };

    this.calculateMarketCreationCosts();
  }

  componentDidUpdate(prevProps, prevState) {
    const { newMarket, gasPrice } = this.props;

    if (
      newMarket.initialLiquidityDai !== prevProps.newMarket.initialLiquidityDai
    ) {
      this.setState({
        formattedInitialLiquidityDai: formatEtherEstimate(
          prevProps.newMarket.initialLiquidityDai
        ),
      });
    }
    if (
      newMarket.initialLiquidityGas !==
      prevProps.newMarket.initialLiquidityGas ||
      gasPrice !== prevProps.gasPrice
    ) {
      this.setState(
        {
          formattedInitialLiquidityGas: formatEtherEstimate(
            formatGasCostToEther(
              prevProps.newMarket.initialLiquidityGas,
              { decimalsRounded: 4 },
              createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
            )
          ),
        },
        () => {
          this.calculateMarketCreationCosts();
        }
      );
    }

    if (this.state.validityBond !== prevState.validityBond) {
      if (this.state.validityBond) {
        const insufficientFunds = this.getInsufficientFundsAmounts();
        if (this.state.insufficientFunds !== insufficientFunds) {
          this.updateFunds(insufficientFunds);
        }
      }
    }

    if (
      this.props.availableEthFormatted.value !== prevProps.availableEthFormatted.value ||
      this.props.availableRepFormatted.value !== prevProps.availableRepFormatted.value
    ) {
      this.calculateMarketCreationCosts();
    }
  }


  getInsufficientFundsAmounts(): InsufficientFunds {
    const { availableEthFormatted, availableRepFormatted, availableDaiFormatted, GsnEnabled } = this.props;
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
        GsnEnabled
      );
    }

    return insufficientFunds;
  }

  updateFunds(insufficientFunds) {
    this.setState({ insufficientFunds });
  }

  async calculateMarketCreationCosts() {
    const { newMarket, gasPrice, GsnEnabled } = this.props;

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
            const gasCost = gasEstimateValue;


            this.setState(
              {
                gasCost,
              },
              () => {
                this.updateFunds(this.getInsufficientFundsAmounts());
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
      GsnEnabled,
      showAddFundsModal,
      gasPrice,
    } = this.props;
    const s = this.state;

    const {
      categories,
      marketType,
      detailsText,
      designatedReporterType,
      designatedReporterAddress,
      scalarDenomination,
      minPrice,
      maxPrice,
      tickSize,
      outcomes,
      settlementFee,
      affiliateFee,
      endTimeFormatted,
      timezone,
      template,
    } = newMarket;
    const totalDai = formatDai(createBigNumber(s.validityBond ? s.validityBond.value : 0).plus(createBigNumber(s.formattedInitialLiquidityDai ? s.formattedInitialLiquidityDai.value : 0)));

    // Total Gas in ETH
    const gasCost = createBigNumber(s.gasCost ? s.gasCost : 0);
    const totalEth = formatEtherEstimate(
      formatGasCostToEther(
        gasCost,
        { decimalsRounded: 4 },
        createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
      )
    );

    const noEth = s.insufficientFunds[ETH];
    const noRep = s.insufficientFunds[REP];
    const noDai = s.insufficientFunds[DAI];
    this.props.setDisableCreate(noEth || noRep || noDai);
    const resolutionDetails = template ? buildResolutionDetails(detailsText, template.resolutionRules) : detailsText;
    return (
      <div className={classNames(Styles.Review, {[Styles.Scalar]: marketType === SCALAR, [Styles.Categorical]: marketType === CATEGORICAL})}>
        <Header text="Market details" />
        <div>
          <SmallSubheaders header="Market Type" subheader={MARKET_TYPE_NAME[marketType]} />
          <SmallSubheaders header="Primary Category" subheader={categories[0]} />
          <SmallSubheaders header="Secondary category" subheader={categories[1]} />
          <SmallSubheaders header="Sub category" subheader={categories[2] === "" ? "–" : categories[2]} />
          <PreviewMarketTitleHeader market={newMarket} />

          {marketType === SCALAR &&
            <>
              <SmallSubheaders header="Unit of Measurement" subheader={scalarDenomination} />
              <SmallSubheaders header="Numeric range" subheader={minPrice + " to " + maxPrice} />
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
          <DateTimeHeaders header="Event expiration date and time" timezone={timezone} subheader={endTimeFormatted && endTimeFormatted.formattedUtc} timezoneDateTime={endTimeFormatted && endTimeFormatted.formattedLocalShortDateTimeWithTimezone} />
          <SmallSubheaders header="resolution details" renderMarkdown subheader={resolutionDetails === "" ? "–" : resolutionDetails} />
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
          <Subheaders copyType={MARKET_COPY_LIST.VALIDITY_BOND} header="Validity bond" subheader={"The bond is paid in DAI and is refunded to the Market Creator if the Final Outcome of the Market is not Invalid. The Validity Bond is a dynamic amount based on the percentage of Markets in Augur that are being Finalized as Invalid."} link />
          <span>
            <LinearPropertyLabel
              label={"Validity Bond"}
              value={s.validityBond && s.validityBond.formattedValue + " DAI"}
            />
          </span>

          <Subheaders copyType={MARKET_COPY_LIST.NO_SHOW_BOND} header="No-show bond" subheader={"A “no-show” bond must be put up by the market creator which is lost if the designated reporter doesn’t show up on time (within 1 day of the market end time) to put forth the initial tentative outcome."} link />
          <span>
            <LinearPropertyLabel
              label={"No-Show Bond"}
              value={s.designatedReportNoShowReputationBond && s.designatedReportNoShowReputationBond.formattedValue + " REPv2"}
            />
          </span>

          { s.formattedInitialLiquidityDai.value > 0 &&
          <>
            <Subheaders header="Initial liquidity" subheader={"The total of the initial liquidity of orders you added on the previous step. These orders can be approved and sent after the market is created"} />
            <span>
              <LinearPropertyLabel
                label={"Initial Liquidity"}
                value={s.formattedInitialLiquidityDai.formattedValue + " DAI"}
              />
            </span>
          </>}

          <Subheaders header="Totals" subheader={GsnEnabled ? "Sum total of DAI and REPv2 required to create this market" : "Sum total of DAI, ETH and REPv2 required to create this market"} />
          <span>
            <LinearPropertyLabel
              label={"Total DAI"}
              value={totalDai.formattedValue + " DAI"}
            />
            <TransactionFeeLabel gasEstimate={gasCost} />
            <LinearPropertyLabel
              label={"TOTAL REPv2"}
              value={s.designatedReportNoShowReputationBond && s.designatedReportNoShowReputationBond.formattedValue + " REPv2"}
            />

          </span>
          <NoFundsErrors
            noEth={noEth}
            showAddFundsModal={showAddFundsModal}
            noRep={noRep}
            noDai={noDai}
            availableDaiFormatted={availableDaiFormatted}
            availableEthFormatted={availableEthFormatted}
            availableRepFormatted={availableRepFormatted}
            totalDai={totalDai}
            totalEth={totalEth}
            totalRep={s.designatedReportNoShowReputationBond}
            GsnEnabled={GsnEnabled}
          />
          <ActivateWalletButton />
        </div>
      </div>
    );
  }
}
