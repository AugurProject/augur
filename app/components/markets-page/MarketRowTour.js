let React = require("react");
let utils = require("../../libs/utilities");
let Shepherd = require("tether-shepherd");
let tour;

module.exports = {
    show: function(market, tradeButtonRef) {
        let outcomes = market.outcomes;
        let outcomeNames = utils.getOutcomeNames(market);

        Shepherd.once('cancel', () => localStorage.setItem("tourComplete", true));

        tour = new Shepherd.Tour({
            defaults: {
                classes: "shepherd-element shepherd-open shepherd-theme-arrows",
                showCancelLink: true
            }
        });

        // TODO add glowing border to current top market
        tour.addStep("markets-list", {
            title: "Welcome to the Augur beta test!",
            text: "<p>On Augur, you can trade the probability of any real-world event happening. (Note: from now until the end of the beta test, everything on Augur is just play money!  Please do <b>not</b> send real Ether to your Augur beta account.)<br /></p>"+
                "<p>In this market, you are considering:<br /><br /><b><i>" + market.description + "</i></b></p>",
            attachTo: ".market-row .description top",
            buttons: [{
                text: "Exit",
                classes: "shepherd-button-secondary",
                action: tour.cancel
            }, {
                text: "Next",
                action: tour.next
            }]
        });

        // TODO highlight outcome labels
        let outcomeList = "";
        for (let i = 0; i < outcomeNames.length; ++i) {
            outcomeList += "<li>" + outcomeNames[i] + " has a probability of " + utils.getPercentageFormatted(market, outcomes[i]) + "</li>";
        }
        tour.addStep("outcomes", {
            text: "<p>This event has " + outcomeNames.length + " possible outcomes: " + outcomeNames.join(" or ") + "</p>" +
                "<p>According to the market:</p>"+
                "<ul class='tour-outcome-list'>" + outcomeList + "</ul>",
            attachTo: ".outcomes right",
            buttons: [{
                text: "Back",
                classes: "shepherd-button-secondary",
                action: tour.back
            }, {
                text: "Next",
                action: tour.next
            }]
        });

        // TODO highlight trade button
        tour.addStep("trade-button", {
            title: "What do you think?",
            text: "<p>" + market.description + " " + outcomeNames.join(" or ") + "?</p>"+
                "<p>If you feel strongly enough, put your money where your mouth is and trade it!</p>",
            attachTo: ".market-row .trade-button left",
            buttons: [{
                text: "Exit Tour",
                classes: "shepherd-button-secondary",
                action: tour.cancel
            }, {
                text: "Back",
                classes: "shepherd-button-secondary",
                action: tour.back
            }],
            when: {
                show: function() {
                    if (tradeButtonRef) {
                        tradeButtonRef.className += ' btn-warning super-highlight';
                    }
                },

                hide: function() {
                    if (tradeButtonRef) {
                        tradeButtonRef.className = tradeButtonRef.className.replace(' btn-warning super-highlight', '');
                    }
                }
            },
            advanceOn: '.trade-button click'
        });

        setTimeout(() => tour.start(), 3000);
    },

    hide: function() {
        tour && tour.hide();
    }
};
