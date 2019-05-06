import { loadReportingHistory } from "modules/reports/actions/load-reporting-history";
import { updateTransactionsData } from "modules/transactions/actions/update-transactions-data";
import { SUCCESS } from "modules/common-elements/constants";
import { formatEther } from "utils/format-number";
import { convertUnixToFormattedDate } from "utils/format-date";
import logError from "utils/log-error";

export const constructBasicTransaction = ({
  eventName,
  hash,
  blockNumber,
  timestamp,
  message,
  description,
  gasFees = 0,
  status = SUCCESS
}) => {
  const transaction = { hash, status, data: {} };
  if (eventName) transaction.type = eventName;
  if (blockNumber) transaction.blockNumber = blockNumber;
  if (message) transaction.message = message;
  transaction.description = description || "";
  if (gasFees) transaction.gasFees = formatEther(gasFees);
  transaction.timestamp = convertUnixToFormattedDate(timestamp);
  return transaction;
};

export const constructTransaction = (log, callback = logError) => (
  dispatch,
  getState
) => {
  switch (log.eventName) {
    case "OrderCreated":
    case "OrderFilled":
    case "TokensTransferred":
    case "MarketCreated":
    case "CompleteSetsSold":
    case "MarketFinalized":
    case "InitialReportSubmitted":
    case "DesignatedReportSubmitted":
    case "ReportSubmitted":
    case "ReportsDisputed":
    case "DisputeCrowdsourcerCreated":
    case "DisputeCrowdsourcerContribution":
    case "DisputeCrowdsourcerCompleted":
    case "DisputeCrowdsourcerRedeemed":
    case "InitialReporterTransferred":
    case "InitialReporterRedeemed":
    case "FeeWindowRedeemed":
    case "UniverseCreated":
    case "UniverseForked":
      return dispatch(
        loadReportingHistory({
          reporter: getState().loginAccount.address,
          universe: getState().universe.id
        })
      );
    default:
      console.warn(
        `constructing default transaction for event ${
          log.eventName
        } (no handler found)`
      );
      dispatch(
        updateTransactionsData({
          [log.transactionHash]: constructBasicTransaction({
            eventName: log.eventName,
            hash: log.transactionHash,
            blockNumber: log.blockNumber,
            timestamp: log.timestamp,
            message: log.message,
            description: log.description
          })
        })
      );
  }
};
