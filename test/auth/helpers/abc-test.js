//
// import sinon from 'sinon'

// import selectABC, { __RewireAPI__ as selectABCRewireAPI } from 'modules/auth/helpers/abc'

// describe('modules/auth/helpers/abc.js', () => {
//   const test = t => it(t.description, done => t.assertions(done))

//   test({
//     description: `should call 'selectABCUIContext'`,
//     assertions: (done) => {
//       const makeABCUIContext = sinon.stub()
//       selectABCRewireAPI.__Rewire__('makeABCUIContext', makeABCUIContext)

//       selectABC()

//       assert(makeABCUIContext.calledOnce, `didn't call 'makeABCUIContext' once as expected`)

//       done()
//     },
//   })
// })
