let React = require("react");
let utils = require("../../libs/utilities");
let Shepherd = require("tether-shepherd");
let tour;

module.exports = {
    show: function(market) {
        let outcomes = market.outcomes;
        let outcomeNames = utils.getOutcomeNames(market);
        let price0 = utils.getOutcomePrice(outcomes[0]);
        let price1 = utils.getOutcomePrice(outcomes[1]);
        let percent0 = utils.priceToPercent(outcomes[0].price);
        let percent1 = utils.priceToPercent(outcomes[1].price);

        Shepherd.once('cancel', () => localStorage.setItem("tourComplete", true));

        tour = new Shepherd.Tour({
            defaults: {
                classes: "shepherd-element shepherd-open shepherd-theme-arrows",
                showCancelLink: true
            }
        });

        tour.addStep("outcome1-price", {
            title: "Market Price for " + outcomeNames[0].toUpperCase(),
            text: "<div style='max-width:22rem;'><p>The current price of <b>" + outcomeNames[0].toUpperCase() + "</b> is " + price0 + " a share.</p>"+
                "<p>That means people believe there's about a " + percent0 + " chance that the answer to</p>"+
                "<p><i><b>" + market.description + "</b></i></p>"+
                "<p>will be <b>" + outcomeNames[0].toUpperCase() + "</b>.</p></div>",
            attachTo: ".outcome-" + outcomes[0].id + " .cash-per-share right",
            buttons: [{
                text: "Exit",
                classes: "shepherd-button-secondary",
                action: tour.cancel
            }, {
                text: "Next",
                action: tour.next
            }]
        });

        tour.addStep("outcome2-price", {
            title: "Market Price for " + outcomeNames[1].toUpperCase(),
            text: "<div style='max-width:22rem;'><p>The current price of <b>" + outcomeNames[1].toUpperCase() + "</b> is " + price1 + " a share.</p>"+
                "<p>That means the market thinks there's about a <b>" + percent1 + "</b> chance the result will be " + outcomeNames[1].toUpperCase() + ".",
            attachTo: ".outcome-" + outcomes[1].id + " .cash-per-share right",
            buttons: [{
                text: "Back",
                classes: "shepherd-button-secondary",
                action: tour.back
            },
            {
                text: "Next",
                action: tour.next
            }]
        });

        tour.addStep("is-market-right", {
            title: "What do you think?",
            text: "<p>Is the market right?</p>" +
                  "<p>Do you agree that the odds of a <b>" + outcomeNames[0].toUpperCase() + "</b> outcome is " + percent0 +
                  " and a <b>" + outcomeNames[1].toUpperCase() + "</b> outcome " + percent1 + "?</p>",
            buttons: [{
                text: "Back",
                classes: "shepherd-button-secondary",
                action: tour.back
            }, {
                text: "Next",
                action: tour.next
            }]
        });

        tour.addStep("believe-one", {
            title: outcomeNames[0].toUpperCase() + " should be higher",
            text: "<p>If you think the probability of <b>" +  outcomeNames[0].toUpperCase() + "</b> occurring is higher than " + percent0 +
                  ", buy some shares in the <b>" + outcomeNames[0].toUpperCase() + "</b>.</p>",
            attachTo: ".outcome-" + outcomes[0].id + " .tradeAction-buy right",
            buttons: [{
                text: "Back",
                classes: "shepherd-button-secondary",
                action: tour.back
            }, {
                text: "Next",
                action: tour.next
            }]
        });

        tour.addStep("believe-two", {
            title: outcomeNames[1].toUpperCase() + " should be higher",
            text: "<p>If you think the probability of <b>" +  outcomeNames[1].toUpperCase() + "</b> occurring is higher than " + percent1 +
                  ", buy some shares in the <b>" + outcomeNames[1].toUpperCase() + "</b>.</p>",
            attachTo: ".outcome-" + outcomes[1].id + " .tradeAction-buy right",
            buttons: [{
                text: "Back",
                classes: "shepherd-button-secondary",
                action: tour.back
            }, {
                text: "Next",
                action: tour.next
            }]
        });

        tour.addStep("believe-either", {
            title: "Profit!",
            text: "<p>Whichever position you choose, you will make money if you're right!</p>",
            buttons: [{
                text: "Done",
                action: tour.complete
            }]
        });

        tour.start();
    },

    hide: function() {
        tour && tour.hide();
    }
};
