#!/usr/bin/env node

var numeric = require("numeric");

// Newton's method parameters
var tolerance = 0.00000001;
var epsilon = 0.0000000000001;
var maxIter = 250;

// MSR parameters
var q = [10, 10, 10, 10, 10]; // shares
var i = 1;                    // outcome to trade
var a = 0.0079;               // LS-LMSR alpha
var xi = 0.3;                 // ceiling/floor

// Find roots of f using Newton-Raphson.
// http://www.turb0js.com/a/Newton%E2%80%93Raphson_method
function solve(f, fprime, x0) {
    var next_x0;
    for (var i = 0; i < maxIter; ++i) {
        var denominator = fprime(x0);
        if (Math.abs(denominator) < epsilon) return null;
        next_x0 = x0 - f(x0) / denominator;
        if (Math.abs(next_x0 - x0) < tolerance) return next_x0;
        x0 = next_x0;
    }
}

// LS-LMSR price function (Eq. 6)
function f(n) {
    var qj = numeric.clone(q);
    qj.splice(i, 1);
    var q_plus_n = n + numeric.sum(q);
    var b = a * q_plus_n;
    var exp_qi = Math.exp((q[i] + n) / b);
    var exp_qj = numeric.exp(numeric.div(qj, b));
    var sum_exp_qj = numeric.sum(exp_qj);
    return a*Math.log(Math.exp((q[i] + n)/b) + sum_exp_qj) +
        (exp_qi*numeric.sum(qj) - numeric.sum(numeric.mul(qj, exp_qj))) /
        (q_plus_n*(exp_qi + sum_exp_qj)) - xi;
};

// First derivative of f
function fprime(n) {
    return (f(n + 0.000001) - f(n - 0.000001)) / 0.000002;
};

console.log(solve(f, fprime, 0.05));
