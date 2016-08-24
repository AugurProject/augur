augur.createEvent({
    branchId: 1010101,
    description: "oh hi world",
    expDate: parseInt(new Date().getTime() / 995, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    resolution: "somewhere over the rainbow",
    onSent: function (res) {
        console.log("createEvent sent:", res);
    },
    onSuccess: function (res) {
        console.log("createEvent success:", res);
        var eventID = res.callReturn;
        augur.createMarket({
            branchId: 1010101,
            description: "oh hi world",
            takerFee: "0.02",
            tags: ["oh", "hi", "world"],
            makerFee: "0.01",
            extraInfo: "don't mind me, just screaming 'oh hi world' into the void",
            events: eventID,
            onSent: function (res) {
                console.log("createMarket sent:", res);
            },
            onSuccess: function (res) {
                console.log("createMarket success:", res);
            },
            onFailed: function (err) {
                console.error("createMarket failed:", err);
            }
        });
    },
    onFailed: function (err) {
        console.error("createEvent failed:", err);
    }
});
