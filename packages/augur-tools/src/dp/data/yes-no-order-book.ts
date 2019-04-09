const exported = {
  buy: { 1: require("./single-outcome-bids") },
  sell: { 1: require("./single-outcome-asks") }
};

export default exported;

export const {
  buy,
  sell
} = exported;
