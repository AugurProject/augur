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

  // SDK not loadeds
  if (!ethToDaiRate || !usdcToDaiRate || !usdcToDaiRate || !repToDaiRate || !balances) {
    return null;
  }

  const VALID_TOKENS = [DAI, REP, ETH, USDC, USDT];

  const [toTokenType, setToTokenType] = useState(toToken);

  const toTokenBalance = balances[toTokenType.toLowerCase()] || 0;
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

  // Only add USDC/USDT to convert to DAI/ETH since there are no USDC/USDT -> REPV2 liquidity pools at this time
  if (toTokenType !== REP) {
    if (hasUSDC) {
      tokenSwapTypes = tokenSwapTypes.concat(USDC);
    }
    if (hasUSDT) {
      tokenSwapTypes = tokenSwapTypes.concat(USDT);
    }
  }

  // remove the token that is being swaapped for
  tokenSwapTypes = tokenSwapTypes.filter((token) => token !== toTokenType);

  // If user has no token balanaces, show all tokens
  if (tokenSwapTypes.length === 0) {
    tokenSwapTypes = VALID_TOKENS.filter((token) => token !== toTokenType);
  }

  let formattedInputAmount: FormattedNumber;
  let outputAmount: FormattedNumber = formatEther(0);

  const getBalanceForToken = (token) => {
    if (!token) {
      return 0;
    }

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
        if (toTokenType === ETH) {
          await uniswapTokenForETH(
            contracts.cash.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        } else if (toTokenType === REP) {
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
        if (toTokenType === ETH) {
          await uniswapTokenForETH(
            contracts.reputationToken.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        } else if (toTokenType === DAI) {
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
        if (toTokenType === DAI) {
          await uniswapEthForDai(input, output, exchangeRateBufferMultiplier);
        } else if (toTokenType === REP) {
          await uniswapEthForRep(input, output, exchangeRateBufferMultiplier);
        }
        clearForm();
      } else if (fromTokenType === USDC) {
        await checkSetApprovalAmount(address, contracts.usdc);
        if (toTokenType === DAI) {
          await uniswapTokenForDai(
            contracts.usdc.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        } else if (toTokenType === REP) {
          await uniswapTokenForRep(
            contracts.usdc.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        }
        else if (toTokenType === ETH) {
          await uniswapTokenForETH(
            contracts.usdc.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        }
        clearForm();
      } else if (fromTokenType === USDT) {
        await checkSetApprovalAmount(address, contracts.usdt);
        if (toTokenType === DAI) {
          await uniswapTokenForDai(
            contracts.usdt.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        } else if (toTokenType === REP) {
          await uniswapTokenForRep(
            contracts.usdt.address,
            input,
            output,
            exchangeRateBufferMultiplier
          );
        }
        else if (toTokenType === ETH) {
          await uniswapTokenForETH(
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
  if (toTokenType === ETH) {
    altExchangeMessage =
      "Have USDC, USDT, DAI or REPv2 and looking to get a large quantity of ETH at lower slippage?";
  } else if (toTokenType === DAI) {
    altExchangeMessage =
      "Have USDC, USDT, REPv2 or ETH and looking to get a large quantity of DAI at lower slippage?";
  } else if (toTokenType === REP) {
    altExchangeMessage =
      "Have USDC, USDT, DAI or ETH and looking to get a large quantity of REPv2 at lower slippage?";
  }

  if (!inputAmount.lt || inputAmount.lt(0)) {
    outputAmount = formatEther(0);
  } else {
    const rateUSDT = createBigNumber(usdtToDaiRate.value / 10**12);
    const rateUSDC = createBigNumber(usdcToDaiRate.value / 10**12);
    const repInDai = REP_RATE.multipliedBy(ethToDaiRate.value);

    if (toTokenType === REP) {
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
    } else if (toTokenType === DAI) {
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
    } else if (toTokenType === ETH) {
      if (fromTokenType === DAI) {
        outputAmount = formatEther(
          createBigNumber(ETH_RATE).multipliedBy(inputAmount)
        );
      } else if (fromTokenType === REP) {
        outputAmount = formatEther(
          createBigNumber(REP_RATE).multipliedBy(inputAmount)
        );
      } else if (fromTokenType === USDT) {
        outputAmount = formatEther(
          rateUSDT.multipliedBy(ETH_RATE).multipliedBy(inputAmount)
        );
      } else if (fromTokenType === USDC) {
        outputAmount = formatEther(
          rateUSDC.multipliedBy(ETH_RATE).multipliedBy(inputAmount)
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
          token={toTokenType}
          label={"Output (estimated)"}
          showChevron={toTokenType === DAI || toTokenType === ETH}
          balance={formatEther(toTokenBalance)}
          logo={tokenIconImageMap[toTokenType.toLowerCase()] || ETHIcon}
          setToken={() => {
            if (toToken === DAI && toTokenType === DAI) {
              if (fromTokenType === ETH) {
                handleSetToken();
              }
              setToTokenType(ETH);
            }
            else if (toToken === DAI && toTokenType === ETH) {
              if (fromTokenType === DAI) {
                handleSetToken();
              }
              setToTokenType(DAI);
            }
          }}
        />
      </>
      <Rate
        baseToken={fromTokenType}
        swapForToken={toTokenType}
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
              : toTokenType === ETH
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
