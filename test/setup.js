import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'
