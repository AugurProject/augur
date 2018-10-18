const selectState = jest.genMockFromModule("src/select-state");

const mocks = {};

selectState.selectMarketsDataState = jest.fn(() =>
  mocks.selectMarketsDataState()
);

selectState.selectMarketsDataState.__setSelectMarketsDataState = func =>
  selectState.__setMock("selectMarketsDataState", func);

selectState.__setMock = (name, func) => {
  mocks[name] = func;
};

module.exports = selectState;
