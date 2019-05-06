import { Augur, FormattedEventLog } from "../../types";
import { processOrderCanceledLog, processOrderCanceledLogRemoval } from "./order-canceled";
import { processOrderCreatedLog, processOrderCreatedLogRemoval } from "./order-created";
import { processOrderFilledLog, processOrderFilledLogRemoval } from "./order-filled";
import Knex from "knex";

enum OrderEventType {
    Create,
    Cancel,
    PriceChanged,
    Fill
}

export async function processOrderEventLog(augur: Augur, log: FormattedEventLog) {
    log = unpackOrderEventLog(log);
    if (log.eventType === OrderEventType.Create) {
        return await processOrderCreatedLog(augur, log);
    } else if (log.eventType === OrderEventType.Cancel) {
        return await processOrderCanceledLog(augur, log);
    } else {
        return await processOrderFilledLog(augur, log);
    }
}

export async function processOrderEventLogRemoval(augur: Augur, log: FormattedEventLog) {
    log = unpackOrderEventLog(log);
    if (log.eventType === OrderEventType.Create) {
        return await processOrderCreatedLogRemoval(augur, log);
    } else if (log.eventType === OrderEventType.Cancel) {
        return await processOrderCanceledLogRemoval(augur, log);
    } else {
        return await processOrderFilledLogRemoval(augur, log);
    }
}

export function unpackOrderEventLog(log: FormattedEventLog): FormattedEventLog {
    log.creator = log.addressData[1];
    log.filler = log.addressData[2];
    log.price = log.uint256Data[0];
    log.amount = log.uint256Data[1];
    log.outcome = log.uint256Data[2];
    log.tokenRefund = log.uint256Data[3];
    log.sharesRefund = log.uint256Data[4];
    log.fees = log.uint256Data[5];
    log.amountFilled = log.uint256Data[6];
    log.timestamp = log.uint256Data[7];
    return log;
}
