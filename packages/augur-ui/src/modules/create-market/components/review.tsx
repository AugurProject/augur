import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { createBigNumber } from 'utils/create-big-number';
import findInsufficientFunds, {
  InsufficientFunds,
} from 'modules/markets/helpers/insufficient-funds';
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
  GWEI_CONVERSION,
  ZERO,
} from 'modules/common/constants';
import {
  MARKET_TYPE_NAME,
  MARKET_COPY_LIST,
} from 'modules/create-market/constants';
import { getCreateMarketBreakdown } from 'modules/contracts/actions/contractCalls';
import {
  formatEtherEstimate,
  formatGasCostToEther,
  formatDai,
  formatEther,
  formatRep,
} from 'utils/format-number';

import Styles from 'modules/create-market/components/review.styles.less';
import { buildResolutionDetails } from 'modules/create-market/get-template';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { totalTradingBalance } from 'modules/auth/helpers/login-account';
import { estimateSubmitNewMarket } from 'modules/markets/actions/estimate-submit-new-market';
import { getGasCost } from 'modules/modal/gas';

interface ReviewProps {
  setDisableCreate: Function;
}

const Review = ({ setDisableCreate }: ReviewProps) => {
  const {
    newMarket,
    ethToDaiRate,
    gasPriceInfo,
    loginAccount: {
      balances: { eth, rep },
    },
  } = useAppStatusStore();
  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  const availableEthFormatted = formatEther(eth);
  const availableDaiFormatted = formatDai(totalTradingBalance());
  const availableRepFormatted = formatRep(rep);

  const [state, setState] = useState({
    gasCost: ZERO,
    validityBond: null,
    designatedReportNoShowReputationBond: null,
    insufficientFunds: {},
    formattedInitialLiquidityDai: formatEtherEstimate(
      newMarket.initialLiquidityDai
    ),
    formattedInitialLiquidityGas: formatEtherEstimate(
      formatGasCostToEther(
        newMarket.initialLiquidityGas,
        { decimalsRounded: 4 },
        createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
      )
    ),
  });

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
  const {
    gasCost,
    validityBond,
    designatedReportNoShowReputationBond,
    insufficientFunds,
    formattedInitialLiquidityDai,
  } = state;

  useEffect(() => {
      calculateMarketCreationCosts();
  }, [
    newMarket.initialLiquidityDai,
    newMarket.initialLiquidityGas,
    availableEthFormatted.value,
    availableRepFormatted.value,
    gasPrice
  ]);

  async function calculateMarketCreationCosts() {
    const marketCreationCostBreakdown = await getCreateMarketBreakdown();
    estimateSubmitNewMarket(newMarket, (err, gasEstimateValue) => {
      if (err) console.error(err);
      const formattedLiquidityGas = formatEtherEstimate(
        formatGasCostToEther(
          newMarket.initialLiquidityGas,
          { decimalsRounded: 4 },
          createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
        )
      );
      const formattedLiquidityDai = formatEtherEstimate(
        newMarket.initialLiquidityDai
      );
      const insufficientFunds = getInsufficientFundsAmounts({
        valididtyBond:
          marketCreationCostBreakdown.validityBondFormatted.formattedValue,
        gasCost: gasEstimateValue.formattedValue,
        designatedReportNoShowReputationBond:
          marketCreationCostBreakdown.noShowFormatted.formattedValue,
        formattedInitialLiquidityGas: formattedLiquidityGas.formattedValue,
        formattedInitialLiquidityDai: formattedLiquidityDai.formattedValue,
      });

      setState({
        ...state,
        insufficientFunds,
        validityBond: marketCreationCostBreakdown.validityBondFormatted,
        gasCost: gasEstimateValue,
        designatedReportNoShowReputationBond:
          marketCreationCostBreakdown.noShowFormatted,
        formattedInitialLiquidityGas: formattedLiquidityGas,
        formattedInitialLiquidityDai: formattedLiquidityDai,
      });
    });
  }

  function getInsufficientFundsAmounts({
    valididtyBond,
    gasCost,
    designatedReportNoShowReputationBond,
    formattedInitialLiquidityGas,
    formattedInitialLiquidityDai,
  }): InsufficientFunds {
    let insufficientFunds: InsufficientFunds = null;
    if (valididtyBond) {
      insufficientFunds = findInsufficientFunds(
        validityBond,
        gasCost || '0',
        designatedReportNoShowReputationBond,
        createBigNumber(availableEthFormatted.value || 0),
        createBigNumber(availableRepFormatted.value || 0),
        createBigNumber(availableDaiFormatted.value || 0),
        formattedInitialLiquidityGas || '0',
        formattedInitialLiquidityDai || '0',
      );
    }
    return insufficientFunds;
  }

  const totalDai = formatDai(
    createBigNumber(validityBond ? validityBond.value : 0).plus(
      createBigNumber(
        formattedInitialLiquidityDai ? formattedInitialLiquidityDai.value : 0
      )
    )
  );

  // Total Gas in ETH
  const totalEth = formatEtherEstimate(
    formatGasCostToEther(
      gasCost,
      { decimalsRounded: 4 },
      createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
    )
  );

  // Total Gas in DAI

  const gasCostDai = getGasCost(gasCost, gasPrice, ethToDaiRate);
  const displayfee = `$${gasCostDai.formattedValue}`;


  const noEth = insufficientFunds[ETH];
  const noRep = insufficientFunds[REP];
  const noDai = insufficientFunds[DAI];
  setDisableCreate(noEth || noRep || noDai);
  const resolutionDetails = template
    ? buildResolutionDetails(detailsText, template.resolutionRules)
    : detailsText;
  return (
    <div
      className={classNames(Styles.Review, {
        [Styles.Scalar]: marketType === SCALAR,
        [Styles.Categorical]: marketType === CATEGORICAL,
      })}
    >
      <Header text="Market details" />
      <div>
        <SmallSubheaders
          header="Market Type"
          subheader={MARKET_TYPE_NAME[marketType]}
        />
        <SmallSubheaders header="Primary Category" subheader={categories[0]} />
        <SmallSubheaders
          header="Secondary category"
          subheader={categories[1]}
        />
        <SmallSubheaders
          header="Sub category"
          subheader={categories[2] === '' ? '–' : categories[2]}
        />
        <PreviewMarketTitleHeader market={newMarket} />

        {marketType === SCALAR && (
          <>
            <SmallSubheaders
              header="Unit of Measurement"
              subheader={scalarDenomination}
            />
            <SmallSubheaders
              header="Numeric range"
              subheader={`${minPrice} to ${maxPrice}`}
            />
            <SmallSubheaders
              header="precision"
              subheader={tickSize.toString()}
            />
          </>
        )}
        {marketType === CATEGORICAL && <OutcomesList outcomes={outcomes} />}
        <SmallSubheaders
          header="Market creator fee"
          subheader={`${settlementFee}%`}
        />
        <SmallSubheadersTooltip
          tooltipSubheader
          header="Affiliate fee"
          subheader={`${affiliateFee}%`}
          text="The affiliate fee % is a percentage of the market creator fee"
        />
      </div>

      <LineBreak />
      <Header text="Resolution information" />
      <div>
        <DateTimeHeaders
          header="Event expiration date and time"
          timezone={timezone}
          subheader={endTimeFormatted?.formattedUtc}
          timezoneDateTime={
            endTimeFormatted?.formattedLocalShortDateTimeWithTimezone
          }
        />
        <SmallSubheaders
          header="resolution details"
          renderMarkdown
          subheader={resolutionDetails === '' ? '–' : resolutionDetails}
        />
        <SmallSubheaders
          header="Designated Reporter"
          subheader={
            designatedReporterType === DESIGNATED_REPORTER_SELF
              ? 'Myself'
              : `Someone else: ${designatedReporterAddress}`
          }
        />
      </div>

      <LineBreak />
      <Header text="Funds required" />
      <div>
        <Subheaders
          copyType={MARKET_COPY_LIST.VALIDITY_BOND}
          header="Validity bond"
          subheader={
            'The bond is paid in DAI and is refunded to the Market Creator if the Final Outcome of the Market is not Invalid. The Validity Bond is a dynamic amount based on the percentage of Markets in Augur that are being Finalized as Invalid.'
          }
          link
        />
        <span>
          <LinearPropertyLabel
            label="Validity Bond"
            value={validityBond && validityBond.formattedValue + ' DAI'}
          />
        </span>

        <Subheaders
          copyType={MARKET_COPY_LIST.NO_SHOW_BOND}
          header="No-show bond"
          subheader=
            'A “no-show” bond must be put up by the market creator which is lost if the designated reporter doesn’t show up on time (within 3 days of the market end time) to put forth the initial tentative outcome.'
          link
        />
        <span>
          <LinearPropertyLabel
            label='No-Show Bond'
            value={
              designatedReportNoShowReputationBond &&
              designatedReportNoShowReputationBond.formattedValue + ' REPv2'
            }
          />
        </span>

        {formattedInitialLiquidityDai.value > 0 && (
          <>
            <Subheaders
              header="Initial liquidity"
              subheader={
                'The total of the initial liquidity of orders you added on the previous step. These orders can be approved and sent after the market is created'
              }
            />
            <span>
              <LinearPropertyLabel
                label={'Initial Liquidity'}
                value={formattedInitialLiquidityDai.formattedValue + ' DAI'}
              />
            </span>
          </>
        )}

        <Subheaders
          header="Totals"
          subheader={'Sum total of DAI and REPv2 required to create this market'}
        />
        <span>
          <LinearPropertyLabel
            label="Total DAI"
            value={`${totalDai.formattedValue} DAI`}
          />
          <TransactionFeeLabel gasCostDai={displayfee} />
          <LinearPropertyLabel
            label="TOTAL REPv2"
            value={
              designatedReportNoShowReputationBond &&
              designatedReportNoShowReputationBond.formattedValue + ' REPv2'
            }
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
          totalRep={designatedReportNoShowReputationBond}
        />
      </div>
    </div>
  );
};

export default Review;
