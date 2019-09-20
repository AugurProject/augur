import { REPORTING, MARKET, DISPUTING } from "modules/routes/constants/views";

export const isOnTradePage = () => document.location.hash.includes(MARKET);
export const isOnReportingPage = () => document.location.hash.includes(REPORTING);
export const isOnDisputingPage = () => document.location.hash.includes(DISPUTING)
