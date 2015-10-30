#!/usr/bin/env julia

using Winston

target = "getMarketsInfo"
(timing_data, labels) = readcsv("data/timing-" * target * ".csv", header=true)

num_markets = timing_data[:,1];
time_elapsed = timing_data[:,2];

P = plot(num_markets, time_elapsed, "b-");
xlabel(labels[1]);
ylabel(labels[2]);
title(target)

savefig(P, "data/timing-" * target * ".png")
