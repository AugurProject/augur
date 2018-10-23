"use strict";

const EventEmitter = require("events").EventEmitter;
const { Subscriptions } = require("src/server/subscriptions");

describe("server/subscriptions", () => {
  let emitter;
  let subscriptions;

  beforeEach(() => {
    emitter = new EventEmitter();
    subscriptions = new Subscriptions(emitter);
  });

  test("subscribes to an event", (done) => {

    let params = [];
    let subscription = subscriptions.subscribe("MarketCreated", null, (data) => {
      params.push(data);
    });

    expect(emitter.listeners("MarketCreated").length).toEqual(1);
    expect(subscriptions.listeners("MarketCreated").length).toEqual(1);
    expect(subscriptions.listeners("unsubscribe:" + subscription).length).toEqual(1);
    expect(subscriptions.listeners("removeAllListeners").length).toEqual(1);

    done();
  });

  test("subscribes to an event and gets outputs", (done) => {

    let params = [];
    subscriptions.subscribe("MarketCreated", null, (data) => {
      params.push(data);
    });

    emitter.emit("MarketCreated", 1);
    emitter.emit("MarketCreated", "string");
    emitter.emit("MarketCreated", { s: "string again", n: 123 });

    expect(params).toEqual([1, "string", { s: "string again", n: 123 }]);
    done();
  });

  test("unsubscribes from a single event", (done) => {
    let subscription1 = subscriptions.subscribe("MarketCreated", null, (data) => { });
    let subscription2 = subscriptions.subscribe("MarketCreated", null, (data) => { });

    expect(subscription1).not.toEqual(subscription2);

    expect(emitter.listeners("MarketCreated").length).toEqual(2);
    expect(subscriptions.listeners("MarketCreated").length).toEqual(2);
    expect(subscriptions.listeners("unsubscribe:" + subscription1).length).toEqual(1);

    subscriptions.unsubscribe(subscription1);

    expect(emitter.listeners("MarketCreated").length).toEqual(1);
    expect(subscriptions.listeners("MarketCreated").length).toEqual(1);
    expect(subscriptions.listeners("unsubscribe:" + subscription1).length).toEqual(0);

    done();
  });

  test("unsubscribes from all events", (done) => {
    let subscription1 = subscriptions.subscribe("MarketCreated", null, (data) => { });
    let subscription2 = subscriptions.subscribe("MarketCreated", null, (data) => { });

    expect(subscription1).not.toEqual(subscription2);

    expect(emitter.listeners("MarketCreated").length).toEqual(2);
    expect(subscriptions.listeners("MarketCreated").length).toEqual(2);
    expect(subscriptions.listeners("unsubscribe:" + subscription1).length).toEqual(1);

    subscriptions.removeAllListeners();

    expect(emitter.listeners("MarketCreated").length).toEqual(0);
    expect(subscriptions.listeners("MarketCreated").length).toEqual(0);
    expect(subscriptions.listeners("unsubscribe:" + subscription1).length).toEqual(0);
    expect(subscriptions.listeners("unsubscribe:" + subscription2).length).toEqual(0);
    expect(subscriptions.listeners("removeAllListeners" + subscription2).length).toEqual(0);

    done();
  });
});
