/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

    getEventInfo: function (eventId, callback) {
        // eventId: hash id
        var self = this;
        var parse_info = function (info) {
            // eventinfo = string(7*32 + length)
            // eventinfo[0] = self.Events[event].branch
            // eventinfo[1] = self.Events[event].expirationDate 
            // eventinfo[2] = self.Events[event].outcome
            // eventinfo[3] = self.Events[event].minValue
            // eventinfo[4] = self.Events[event].maxValue
            // eventinfo[5] = self.Events[event].numOutcomes
            // eventinfo[6] = self.Events[event].bond
            if (info && info.length) {
                info[0] = abi.hex(info[0]);
                info[1] = abi.bignum(info[1]).toFixed();
                info[2] = abi.unfix(info[2], "string");
                info[3] = abi.unfix(abi.hex(info[3], true), "string");
                info[4] = abi.unfix(abi.hex(info[4], true), "string");
                info[5] = parseInt(info[5]);
                info[6] = abi.unfix(info[6], "string");
            }
            return info;
        };
        var tx = clone(this.tx.Events.getEventInfo);
        tx.params = eventId;
        if (utils.is_function(callback)) {
            this.fire(tx, function (info) {
                callback(parse_info(info));
            });
        } else {
            return parse_info(this.fire(tx));
        }
    }
};
