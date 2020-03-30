import { loadReportingHistory } from "modules/reports/actions/load-reporting-history";
import { updateTransactionsData } from "modules/transactions/actions/update-transactions-data";
import { SUCCESS } from "modules/common/constants";
import { formatEther } from "utils/format-number";
import { convertUnixToFormattedDate } from "utils/format-date";
import logError from "utils/log-error";
import { AppState } from "appStore";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { FormattedNumber, DateFormattedObject } from "modules/types";

export interface TransactionObject {
  hash: any;
  status: any;
  data: any;
  type?: string;
  eventName?: string;
  blockNumber?: string;
  message?: string;
  gasFees?: FormattedNumber;
  description?: string;
  timestamp?: DateFormattedObject;
}

export const constructBasicTransaction = ({
  eventName,
  hash,
  blockNumber,
  timestamp,
  message,
  description,
  gasFees = 0,
  status = SUCCESS,
}: any) => {
  const transaction: TransactionObject = { hash, status, data: {} };
  if (eventName) transaction.type = eventName;
  if (blockNumber) transaction.blockNumber = blockNumber;
  if (message) transaction.message = message;
  transaction.description = description || "";
  if (gasFees) transaction.gasFees = formatEther(gasFees);
  transaction.timestamp = convertUnixToFormattedDate(timestamp);
  return transaction;
};

export const constructTransaction = (
  log: any,
  callback: NodeStyleCallback = logError,
): ThunkAction<any, any, any, any> => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  switch (log.eventName) {
    case "OrderCreated":
    case "OrderFilled":
    case "TokensTransferred":
    case "MarketCreated":
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
          universe: getState().universe.id,
        }),
      );
    default:
      console.warn(
        `constructing default transaction for event ${
          log.eventName
        } (no handler found)`,
      );
      dispatch(
        updateTransactionsData({
          [log.transactionHash]: constructBasicTransaction({
            eventName: log.eventName,
            hash: log.transactionHash,
            blockNumber: log.blockNumber,
            timestamp: log.timestamp,
            message: log.message,
            description: log.description,
          }),
        }),
      );
  }
};
