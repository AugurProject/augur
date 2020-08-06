import React, { useEffect, useState } from "react";

import {
  ETH,
  DAI,
  REP,
  TRANSACTIONS,
  SWAPEXACTTOKENSFORTOKENS,
  SWAPTOKENSFOREXACTETH,
  SWAPETHFOREXACTTOKENS,
  ZERO,
  USDC,
  USDT,
} from "modules/common/constants";
import { AccountBalances, FormattedNumber } from "modules/types";
import {
  SwapArrow,
  AugurLogo as REPIcon,
  ETH as ETHIcon,
  DaiLogoIcon,
  DollarIcon,
} from "modules/common/icons";
import { formatEther } from "utils/format-number";
import { BigNumber, createBigNumber } from "utils/create-big-number";
import { Rate } from "modules/swap/components/rate";
import { SwapRow } from "modules/swap/components/swap-row";
import classNames from "classnames";
import {
  uniswapEthForDai,
  uniswapEthForRep,
  checkSetApprovalAmount,
  uniswapTokenForETH,
  uniswapTokenForDai,
  uniswapTokenForRep,
} from "modules/contracts/actions/contractCalls";
import {
  ProcessingButton,
  PrimaryButton,
  ExternalLinkButton,
} from "modules/common/buttons";
import type { SDKConfiguration } from "@augurproject/artifacts";
import { augurSdk } from "services/augursdk";

import Styles from "modules/swap/components/index.styles.less";

interface SwapProps {
  balances: AccountBalances;
  toToken: string;
  fromToken: string;
  ETH_RATE: BigNumber;
  REP_RATE: BigNumber;
  config: SDKConfiguration;
  address: string;
  ethToDaiRate: FormattedNumber;
  repToDaiRate: FormattedNumber;
  usdcToDaiRate: FormattedNumber;
  usdtToDaiRate: FormattedNumber;
}

const tokenIconImageMap = {
  eth: ETHIcon,
  rep: REPIcon,
  dai: DaiLogoIcon,
  usdc: DollarIcon,
  usdt: DollarIcon,
};

export const Swap = ({
  balances,
  fromToken,
  toToken,
  ETH_RATE,
  REP_RATE,
  config,
  address,
  ethToDaiRate,
  usdtToDaiRate,
  usdcToDaiRate,
  repToDaiRate,
}: SwapProps) => {
  const VALID_TOKENS = [DAI, REP, ETH, USDC, USDT];

  const toTokenBalance = balances[toToken.toLowerCase()] || 0;
  const hasEth = createBigNumber(balances.eth || 0).gt(ZERO);
  const hasRep = createBigNumber(balances.rep || 0).gt(ZERO);
  const hasDai = createBigNumber(balances.dai || 0).gt(ZERO);
  const hasUSDC = createBigNumber(balances.usdc || 0).gt(ZERO);
  const hasUSDT = createBigNumber(balances.usdt || 0).gt(ZERO);

  let tokenSwapTypes = [];

  if (hasEth) {
    tokenSwapTypes = tokenSwapTypes.concat(ETH);
  }

  if (hasRep) {
    tokenSwapTypes = tokenSwapTypes.concat(REP);
  }

  if (hasDai) {
    tokenSwapTypes = tokenSwapTypes.concat(DAI);
  }

  // Only add USDC/USDT to convert to DAI/ETH since there are no USDC/USDT -> REPv2 liquidity pools at this time
  if (toToken !== REP) {
    if (hasUSDC) {
      tokenSwapTypes = tokenSwapTypes.concat(USDC);
    }
    if (hasUSDT) {
      tokenSwapTypes = tokenSwapTypes.concat(USDT);
    }
  }

  // remove the token that is being swaapped for
  tokenSwapTypes = tokenSwapTypes.filter((token) => token !== toToken);

  // If user has no token balanaces, show all tokens
  if (tokenSwapTypes.length === 0) {
    tokenSwapTypes = VALID_TOKENS.filter((token) => token !== toToken);
  }

  let formattedInputAmount: FormattedNumber;
  let outputAmount: FormattedNumber = formatEther(0);

  const getBalanceForToken = (token) => {
    let balance = 0;
    balance = balances[token.toLowerCase()] || 0;
    return balance;
  };

  const setAmountToSwap = (
    amount: BigNumber,
    formattedInputAmount: BigNumber
  ) => {
    setErrorMessage("");
    if (amount.lt(0) || isNaN(amount.toNumber())) {
      setErrorMessage("Check conversion amount");
    } else if (amount.gt(formattedInputAmount)) {
      setErrorMessage("Check amount is not greater than balance");
    } else {
      setInputAmount(amount);
    }
  };

  const clearForm = () => {
    setInputAmount(createBigNumber(0));
    outputAmount = formatEther(0);
  };

  const makeTrade = async () => {
    const { contracts } = augurSdk.get();

    const input = inputAmount;
    const output = createBigNumber(outputAmount.value);
    const exchangeRateBufferMultiplier =
      config.uniswap?.exchangeRateBufferMultiplier || 1.005;

    try {
      if (fromTokenType === DAI) {
        await checkSetApprovalAmount(address, contracts.cash);
        if (toToken === ETH) {
          await uniswapTokenForETH(
            contracts.cash.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        } else if (toToken === REP) {
          await uniswapTokenForRep(
            contracts.cash.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        }
        clearForm();
      } else if (fromTokenType === REP) {
        await checkSetApprovalAmount(address, contracts.reputationToken);
        if (toToken === ETH) {
          await uniswapTokenForETH(
            contracts.reputationToken.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        } else if (toToken === DAI) {
          await uniswapTokenForDai(
            contracts.reputationToken.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        }
        clearForm();
      } else if (fromTokenType === ETH) {
        await checkSetApprovalAmount(address, contracts.weth);
        if (toToken === DAI) {
          await uniswapEthForDai(input, output, exchangeRateBufferMultiplier);
        } else if (toToken === REP) {
          await uniswapEthForRep(input, output, exchangeRateBufferMultiplier);
        }
        clearForm();
      } else if (fromTokenType === USDC) {
        await checkSetApprovalAmount(address, contracts.usdc);
        if (toToken === DAI) {
          await uniswapTokenForDai(
            contracts.usdc.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        } else if (toToken === REP) {
          await uniswapTokenForRep(
            contracts.usdc.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        }
        clearForm();
      } else if (fromTokenType === USDT) {
        await checkSetApprovalAmount(address, contracts.usdt);
        if (toToken === DAI) {
          await uniswapTokenForDai(
            contracts.usdt.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        } else if (toToken === REP) {
          await uniswapTokenForRep(
            contracts.usdt.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        }
        clearForm();
      }
    } catch (error) {
      if (error && error.message.indexOf("exception") !== -1) {
        setErrorMessage(
          "Liquidity error, please try reducing the size of your trade to avoid a price slippage."
        );
      }
    }
  };

  const handleSetToken = () => {
    setErrorMessage("");
    const nextToken =
      currentTokenIndex === tokenSwapTypes.length - 1
        ? 0
        : currentTokenIndex + 1;
    setCurrentTokenIndex(nextToken);
    setFromTokenType(tokenSwapTypes[nextToken]);
    updateBalance(getBalanceForToken(tokenSwapTypes[nextToken]));
    clearForm();
  };

  const [inputAmount, setInputAmount] = useState(createBigNumber(0.0));
  const [fromTokenType, setFromTokenType] = useState(
    fromToken ? fromToken : tokenSwapTypes[0]
  );
  const [balance, updateBalance] = useState(getBalanceForToken(fromTokenType));
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);

  if (!VALID_TOKENS.includes(fromTokenType)) {
    throw Error("unsupported uniswap token");
  }

  formattedInputAmount = formatEther(Number(balance) || 0);

  let altExchangeMessage = null;
  if (toToken === ETH) {
    altExchangeMessage =
      "Have USDC, USDT, DAI or REPv2 and looking to get a large quantity of ETH at lower slippage?";
  } else if (toToken === DAI) {
    altExchangeMessage =
      "Have USDC, USDT, REPv2 or ETH and looking to get a large quantity of DAI at lower slippage?";
  } else if (toToken === REP) {
    altExchangeMessage =
      "Have USDC, USDT, DAI or ETH and looking to get a large quantity of REPv2 at lower slippage?";
  }

  if (!inputAmount.lt || inputAmount.lt(0)) {
    outputAmount = formatEther(0);
  } else {
    const rateUSDT = createBigNumber(usdtToDaiRate.value / 10**12);
    const rateUSDC = createBigNumber(usdcToDaiRate.value / 10**12);
    const repInDai = REP_RATE.multipliedBy(ethToDaiRate.value);

    if (toToken === REP) {
      const inputValueRepInDai = createBigNumber(1)
        .dividedBy(repToDaiRate.value)
        .multipliedBy(inputAmount);

      if (fromTokenType === DAI) {
        outputAmount = formatEther(inputValueRepInDai);
      } else if (fromTokenType === ETH) {
        outputAmount = formatEther(
          createBigNumber(ethToDaiRate.value)
            .multipliedBy(inputAmount)
            .dividedBy(repToDaiRate.value)
        );
      } else if (fromTokenType === USDC) {
        outputAmount = formatEther(rateUSDC.multipliedBy(inputValueRepInDai));
      } else if (fromTokenType === USDT) {
        outputAmount = formatEther(rateUSDT.multipliedBy(inputValueRepInDai));
      }
    } else if (toToken === DAI) {
      if (fromTokenType === REP) {
        outputAmount = formatEther(
          createBigNumber(repToDaiRate.value).multipliedBy(inputAmount)
        );
      } else if (fromTokenType === ETH) {
        outputAmount = formatEther(
          createBigNumber(inputAmount).dividedBy(ETH_RATE)
        );
      } else if (fromTokenType === USDC) {
        outputAmount = formatEther(rateUSDC.multipliedBy(inputAmount));
      } else if (fromTokenType === USDT) {
        outputAmount = formatEther(rateUSDT.multipliedBy(inputAmount));
      }
    } else if (toToken === ETH) {
      if (fromTokenType === DAI) {
        outputAmount = formatEther(
          createBigNumber(ETH_RATE).multipliedBy(inputAmount)
        );
      } else if (fromTokenType === REP) {
        outputAmount = formatEther(
          createBigNumber(REP_RATE).multipliedBy(inputAmount)
        );
      }
    }
  }

  return (
    <div className={Styles.Swap}>
      <>
        <SwapRow
          amount={formatEther(inputAmount)}
          token={fromTokenType}
          label={"Input"}
          showChevron={tokenSwapTypes.length > 1}
          balance={formattedInputAmount}
          logo={tokenIconImageMap[fromTokenType.toLowerCase()] || ETHIcon}
          setAmount={setAmountToSwap}
          setMaxAmount={setInputAmount}
          setToken={() => handleSetToken()}
        />

        <div>{SwapArrow}</div>

        <SwapRow
          amount={outputAmount}
          token={toToken}
          label={"Output (estimated)"}
          balance={formatEther(toTokenBalance)}
          logo={tokenIconImageMap[toToken.toLowerCase()] || ETHIcon}
        />
      </>
      <Rate
        baseToken={fromTokenType}
        swapForToken={toToken}
        repRate={REP_RATE}
        ethRate={ETH_RATE}
        ethToDaiRate={ethToDaiRate}
        repToDaiRate={repToDaiRate}
        usdcToDaiRate={usdcToDaiRate}
        usdtToDaiRate={usdtToDaiRate}
      />

      <div>
        <ProcessingButton
          text={"Convert"}
          action={() => makeTrade()}
          queueName={TRANSACTIONS}
          disabled={
            !outputAmount ||
            (errorMessage && errorMessage.indexOf("Liquidity") === -1)
          }
          queueId={
            fromTokenType === ETH
              ? SWAPETHFOREXACTTOKENS
              : toToken === ETH
              ? SWAPTOKENSFOREXACTETH
              : SWAPEXACTTOKENSFORTOKENS
          }
        />
        {errorMessage && <div>{errorMessage}</div>}
        {altExchangeMessage && (
          <div>
            {altExchangeMessage}
            <br />
            Try{" "}
            <ExternalLinkButton
              URL={"https://1inch.exchange"}
              label={"1inch.exchange"}
            />
          </div>
        )}
      </div>
    </div>
  );
};
