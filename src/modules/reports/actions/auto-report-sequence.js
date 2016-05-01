import * as async from 'async';
import * as AugurJS from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';
import { BRANCH_ID } from '../../app/constants/network';

export function autoReportSequence() {
    return function (dispatch, getState) {

        var { branch, blockchain, loginAccount } = getState();

        function penalizationCatchup() {
            AugurJS.penalizationCatchup({
                branch: BRANCH_ID,
                onSent: function (res) {
                    console.log("penalizationCatchup sent:", res);
                },
                onSuccess: function (res) {
                    console.log("penalizationCatchup success:", res);
                    dispatch(updateAssets());
                },
                onFailed: function (err) {
                    console.error("penalizationCatchup failed:", err);
                    if (err.error === "0") {
                        // already caught up
                    }
                }
            });
        }

        function penalizeNotEnoughReports() {
            AugurJS.penalizeNotEnoughReports({
                branch: BRANCH_ID,
                onSent: function (res) {
                    console.log("penalizeNotEnoughReports sent:", res);
                },
                onSuccess: function (res) {
                    console.log("penalizeNotEnoughReports success:", res);
                    dispatch(updateAssets());
                },
                onFailed: function (err) {
                    console.error("penalizeNotEnoughReports failed:", err);
                    if (err.error === "-1") {
                        // already called
                    } else if (err.error === "-2") {
                        // need to catch up
                        penalizationCatchup();
                    }
                }
            });
        }

        function penalizeWrongEvent(period, event, nextEvent) {
            AugurJS.getMarkets(event, function (markets) {
                if (!markets || markets.error) return console.error("getMarkets:", markets);
                AugurJS.getOutcome(event, function (outcome) {
                    if (outcome !== "0" && !outcome.error) {
                        AugurJS.getReportHash(BRANCH_ID, period, loginAccount, event, function (reportHash) {
                            if (reportHash && reportHash.error) return nextEvent(reportHash);
                            if (!reportHash || reportHash === "0x0") return nextEvent();
                            console.log("Calling penalizeWrong for:", BRANCH_ID, period, event);
                            AugurJS.penalizeWrong({
                                branch: BRANCH_ID,
                                event: event,
                                onSent: function (res) {
                                    console.log("penalizeWrong sent for event " + event, res);
                                    // if (!branch.calledPenalizeWrong) branch.calledPenalizeWrong = {};
                                    // branch.calledPenalizeWrong[event] = {
                                    //  branch: BRANCH_ID,
                                    //  event: event,
                                    //  reportPeriod: period
                                    // };
                                    // console.log("branch.calledPenalizeWrong:", branch.calledPenalizeWrong);
                                },
                                onSuccess: function (res) {
                                    console.log("penalizeWrong success for event " + event, res);
                                    nextEvent();
                                },
                                onFailed: function (err) {
                                    console.error("penalizeWrong failed for event" + event, err);
                                    if (err.error === "-3") {
                                        // if (branch.calledPenalizeWrong && branch.calledPenalizeWrong.length) {
                                        //  if (branch.calledPenalizeWrong[event]) {
                                        //      delete branch.calledPenalizeWrong[event];
                                        //  }
                                        // }
                                        // branch.calledPenalizeNotEnoughReports = false;
                                        penalizeNotEnoughReports();
                                    }
                                    nextEvent(err);
                                }
                            });
                        });
                    } else {
                        console.error("event", event, "does not yet have an outcome", markets[0]);
                        AugurJS.closeMarket(BRANCH_ID, markets[0], function (res) {
                            console.log("closeMarket sent:", res);
                        }, function (res) {
                            console.log("closeMarket success:", res);
                            penalizeWrongEvent(event);
                        }, function (err) {
                            console.error("closeMarket error:", err);
                            nextEvent(err);
                        });
                        // if (!branch.calledPenalizeWrong) branch.calledPenalizeWrong = {};
                        // branch.calledPenalizeWrong[event] = {
                        //  branch: BRANCH_ID,
                        //  event: event,
                        //  reportPeriod: period
                        // };
                    }
                });
            });
        }

        function penalizeWrong(period) {
            AugurJS.getEvents(BRANCH_ID, period, function (events) {
                if (!events || events.error) return console.error("getEvents:", events);
                async.eachSeries(events, function (event, nextEvent) {
                    // if (branch.calledPenalizeWrong && branch.calledPenalizeWrong[event]) {
                    //  return nextEvent();
                    // }
                    console.log("calling penalizeWrong for event:", event);
                    penalizeWrongEvent(period, event, nextEvent);
                }, function (err) {
                    if (err) console.error("each event error:", err);
                    console.log("penalizeWrong completed");
                });
            });
        }

        var prevPeriod = blockchain.reportPeriod - 1;

        // if this user has reputation
        if (loginAccount.rep) {

            // if we're in the first half of the reporting period
            if (!isReportConfirmationPhase) {
                if (!branch.calledPenalizeNotEnoughReports && !branch.calledPenalizationCatchup) {
                    AugurJS.getReportedPeriod(BRANCH_ID, prevPeriod, loginAccount, function (reported) {

                        // if the reporter submitted a report during the previous period,
                        // penalize if they did not submit enough reports.
                        if (reported === "1") penalizeNotEnoughReports();

                        // if the reporter did not submit a report during the previous period,
                        // dock 10% for each report-less period.
                        else penalizationCatchup();
                    });

                // number-of-reports penalties applied; now penalize wrong answers.
                } else {
                    penalizeWrong(prevPeriod);
                }

            // if we're in the second half of the reporting period
            } else {
                //
                // TODO
                // for each event in this report period:
                //  AugurJS.submitReport(reportOnThisEvent);
                //
                AugurJS.collectFees({
                    branch: BRANCH_ID,
                    onSent: function (res) {
                        console.log("collectFees sent:", res);
                    },
                    onSuccess: function (res) {
                        console.log("collectFees success:", res);
                        dispatch(updateAssets());
                    },
                    onFailed: function (err) {
                        console.error("collectFees error:", err);
                    }
                });
            }
        }
    };
}
