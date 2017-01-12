#!/usr/bin/env node

var Decimal = require("decimal.js");
var fzero = require("fzero");

// MSR parameters
var q = [new Decimal(10),      // outcome 1 shares
  new Decimal(10),      // outcome 2 shares
  new Decimal(10),      // outcome 3 shares
  new Decimal(10),      // outcome 4 shares
  new Decimal(10)];     // outcome 5 shares
var i = 1;                     // index of outcome to trade
var a = new Decimal("0.0079"); // LS-LMSR alpha
var xi = new Decimal("0.3");   // price cap

// LS-LMSR objective function (Eq. 6)
function f(n) {
  n = new Decimal(n);
  var numOutcomes = q.length;
  var qj = new Array(numOutcomes);
  var sum_q = new Decimal(0);
  for (var j = 0; j < numOutcomes; ++j) {
    qj[j] = q[j];
    sum_q = sum_q.plus(q[j]);
  }
  qj.splice(i, 1);
  var q_plus_n = n.plus(sum_q);
  var b = a.times(q_plus_n);
  var exp_qi = q[i].plus(n).dividedBy(b).exp();
  var exp_qj = new Array(numOutcomes);
  var sum_qj = new Decimal(0);
  var sum_exp_qj = new Decimal(0);
  var sum_qj_x_expqj = new Decimal(0);
  for (j = 0; j < numOutcomes - 1; ++j) {
    sum_qj = sum_qj.plus(qj[j]);
    exp_qj[j] = qj[j].dividedBy(b).exp();
    sum_exp_qj = sum_exp_qj.plus(exp_qj[j]);
    sum_qj_x_expqj = sum_qj_x_expqj.plus(q[j].times(exp_qj[j]));
  }
  return a.times(q[i].plus(n).dividedBy(b).exp().plus(sum_exp_qj).ln()).plus(
        exp_qi.times(sum_qj).minus(sum_qj_x_expqj).dividedBy(
            q_plus_n.times(exp_qi.plus(sum_exp_qj))
        ).minus(xi)
    );
}

console.log(fzero(f, [0.001, 10]).solution);
