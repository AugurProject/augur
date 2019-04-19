import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "ignore-styles";

Enzyme.configure({ adapter: new Adapter() });

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;
