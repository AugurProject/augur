import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { selectMarket } from "modules/markets/selectors/market";
import { createBigNumber } from "utils/create-big-number";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import {
  formatGasCostToEther,
  formatAttoRep,
  formatAttoEth,
  formatEther,
  formatRep
} from "utils/format-number";
import { closeModal } from "modules/modal/actions/close-modal";
import { Proceeds } from "modules/modal/proceeds";
import { ActionRowsProps } from "modules/modal/common";
import {
  CLAIM_FEES_GAS_COST,
  redeemStake
} from "modules/reports/actions/claim-reporting-fees";
import {
  ALL,
  CLAIM_FEE_WINDOWS,
  CLAIM_STAKE_FEES
} from "modules/common-elements/constants";

const mapStateToProps = (state: any) => ({
  modal: state.modal,
  gasCost: formatGasCostToEther(
    CLAIM_FEES_GAS_COST,
    { decimalsRounded: 4 },
    getGasPrice(state)
  ),
  pendingQueue: state.pendingQueue || [],
  reportingFees: state.reportingWindowStats.reportingFees,
  feeWindows: state.reportingWindowStats.reportingFees.feeWindows,
  nonforkedMarkets: state.reportingWindowStats.reportingFees.nonforkedMarkets
});

const mapDispatchToProps = (dispatch: Function) => ({
  closeModal: () => dispatch(closeModal()),
  redeemStake: (options, callback) => dispatch(redeemStake(options, callback))
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const marketIdsToTest = sP.nonforkedMarkets;
  const markets: Array<ActionRowsProps> = [];
  const claimableMarkets = [];
  let unclaimedRep = createBigNumber(
    sP.reportingFees.unclaimedRep.fullPrecision
  );
  let unclaimedEth = createBigNumber(
    sP.reportingFees.unclaimedEth.fullPrecision
  );
  marketIdsToTest.forEach(marketObj => {
    const market = selectMarket(marketObj.marketId);
    const ethFees = formatAttoEth(marketObj.unclaimedEthFees, {
      decimals: 4,
      decimalsRounded: 4,
      zeroStyled: false
    });
    const total = createBigNumber(ethFees.fullPrecision);

    if (market) {
      const marketRep = formatAttoRep(marketObj.unclaimedRepTotal, {
        decimals: 4,
        decimalsRounded: 4,
        zeroStyled: false
      });

      const pending =
        sP.pendingQueue[CLAIM_STAKE_FEES] &&
        sP.pendingQueue[CLAIM_STAKE_FEES][marketObj.marketId];
      if (!pending) {
        claimableMarkets.push(marketObj);
      } else {
        unclaimedRep = unclaimedRep.minus(
          createBigNumber(marketRep.fullPrecision)
        );
        unclaimedEth = unclaimedEth.minus(
          createBigNumber(ethFees.fullPrecision)
        );
      }

      markets.push({
        title: market.description,
        text: "Claim Proceeds",
        status: pending && pending.status,
        properties: [
          {
            label: "reporting stake",
            value: `${marketRep.formatted || 0} REP`,
            addExtraSpace: true
          },
          {
            label: "Reporting Fees",
            value: `${ethFees.formatted || 0} ETH`
          },
          {
            label: "est gas cost",
            value: `${marketObj.gasCost} ETH`
          },
          {
            label: "total eth",
            value: `${
              formatEther(
                createBigNumber(total)
                  .minus(createBigNumber(marketObj.gasCost))
                  .abs()
              ).formatted
            } ETH`
          }
        ],
        action: () => {
          const marketIndex = sP.reportingFees.nonforkedMarkets.findIndex(
            market => market.marketId === marketObj.marketId
          );
          const RedeemStakeOptions = {
            feeWindows: [],
            nonforkedMarkets: [sP.nonforkedMarkets[marketIndex]],
            pendingId: sP.nonforkedMarkets[marketIndex].marketId
          };
          dP.redeemStake(RedeemStakeOptions);
        }
      });
    }
  });
  let feeWindowsPending = false;
  if (sP.feeWindows.length > 0) {
    const totalMinusGas = createBigNumber(
      sP.reportingFees.unclaimedParticipationTokenEthFees.fullPrecision
    )
      .minus(createBigNumber(sP.reportingFees.gasCosts[CLAIM_FEE_WINDOWS]))
      .abs();

    feeWindowsPending =
      sP.pendingQueue[CLAIM_STAKE_FEES] &&
      sP.pendingQueue[CLAIM_STAKE_FEES][CLAIM_FEE_WINDOWS];

    if (feeWindowsPending) {
      unclaimedRep = unclaimedRep.minus(
        createBigNumber(
          sP.reportingFees.participationTokenRepStaked.fullPrecision
        )
      );
      unclaimedEth = unclaimedEth.minus(
        createBigNumber(
          sP.reportingFees.unclaimedParticipationTokenEthFees.fullPrecision
        )
      );
    }

    markets.push({
      title: "Reedeem all participation tokens",
      text: "Claim",
      status: feeWindowsPending && feeWindowsPending.status,
      properties: [
        {
          label: "Reporting Stake",
          value: `${
            sP.reportingFees.participationTokenRepStaked.formatted
          } REP`,
          addExtraSpace: true
        },
        {
          label: "Reporting Fees",
          value: `${
            sP.reportingFees.unclaimedParticipationTokenEthFees.formatted
          } ETH`
        },
        {
          label: "Est Gas cost",
          value: `${
            formatEther(sP.reportingFees.gasCosts[CLAIM_FEE_WINDOWS]).formatted
          } ETH`
        },
        {
          label: "Total Eth",
          value: `${formatEther(totalMinusGas).formatted} ETH`
        }
      ],
      action: () => {
        const RedeemStakeOptions = {
          feeWindows: sP.feeWindows,
          nonforkedMarkets: [],
          pendingId: CLAIM_FEE_WINDOWS
        };
        dP.redeemStake(RedeemStakeOptions);
      }
    });
  }

  const breakdown =
    markets.length > 1
      ? [
          {
            label: "Total REP",
            value: `${formatRep(unclaimedRep.toNumber()).full}`
          },
          {
            label: "Total Fees",
            value: `${formatEther(unclaimedEth.toNumber()).full}`
          },
          {
            label: "Total Gas Cost (ETH)",
            value: `${sP.reportingFees.gasCosts[ALL]} ETH`
          }
        ]
      : null;

  return {
    title: "Claim Stake & Fees",
    descriptionMessage: [
      {
        preText: "You have",
        boldText: `${sP.reportingFees.unclaimedRep.full} REP`,
        postText: "available to be claimed from your reporting stake "
      },
      {
        preText: " and",
        boldText: `${sP.reportingFees.unclaimedEth.full} ETH`,
        postText: "of reporting fees to collect from the following markets:"
      }
    ],
    rows: markets,
    breakdown,
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    buttons: [
      {
        text: "Claim All",
        disabled: markets.find(market => market.status === "pending"),
        action: () => {
          const RedeemStakeOptions = {
            feeWindows: feeWindowsPending ? [] : sP.reportingFees.feeWindows,
            nonforkedMarkets: claimableMarkets,
            onSent: () => {
              if (sP.modal.cb) {
                sP.modal.cb();
              }
            }
          };
          dP.redeemStake(RedeemStakeOptions, () => {
            if (sP.modal.cb) {
              sP.modal.cb();
            }
          });
          dP.closeModal();
        }
      },
      {
        text: "Close",
        action: () => {
          if (sP.modal.cb) {
            sP.modal.cb();
          }
          dP.closeModal();
        }
      }
    ]
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Proceeds)
);
