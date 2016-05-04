import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import testState from '../../testState';
import { INVALID_USERNAME_OR_PASSWORD, USERNAME_REQUIRED, PASSWORDS_DO_NOT_MATCH, PASSWORD_TOO_SHORT, USERNAME_TAKEN } from '../../../src/modules/auth/constants/form-errors';

describe(`modules/auth/selectors/auth-form.js`, () => {
  proxyquire.noPreserveCache();
  let mockState = Object.assign({}, testState);
  const mockStore = {
    default: {
      getState: () => mockState,
      dispatch: (something) => something
    }
  };
  let selector, out, test;

  selector = proxyquire('../../../src/modules/auth/selectors/auth-form', {
    '../../../store': mockStore
  });

  it(`should select the correct auth form`, () => {
    out = {
      title: 'Sign Up',
      isVisibleUsername: true,
      isVisiblePassword: true,
      isVisiblePassword2: true,
      topLinkText: 'Login',
      topLink: {
        href: '/login',
        onClick: () => {}
      },
      msg: null,
      msgClass: 'success',
      submitButtonText: 'Sign Up',
      submitButtonClass: 'register-button',
      onSubmit: () => {},
      closeLink: {
        href: '/',
        onClick: (href) => {}
      }
    };

    test = selector.default();

    assert.equal(test.title, out.title, `Title didn't return the expected value for register`);
    assert.equal(test.isVisibleUsername, out.isVisibleUsername, `isVisibleUsername didn't return the expected value for register`);
    assert.equal(test.isVisiblePassword, out.isVisiblePassword, `isVisiblePassword didn't return the expected value for register`);
    assert.equal(test.isVisiblePassword2, out.isVisiblePassword2, `isVisiblePassword2 didn't return the expected value for register`);
    assert.equal(test.topLinkText, out.topLinkText, `topLinkText didn't return the expected value for register`);
    assert.equal(test.msg, out.msg, `msg didn't return the expected value for register`);
    assert.equal(test.msgClass, out.msgClass, `msgClass didn't return the expected value for register`);
    assert.equal(test.submitButtonText, out.submitButtonText, `submitButtonText didn't return the expected value for register`);
    assert.equal(test.submitButtonClass, out.submitButtonClass, `submitButtonClass didn't return the expected value for register`);
    assert.equal(test.topLink.href, out.topLink.href, `topLink.href didn't return the expected value for register`);
    assert.equal(test.closeLink.href, out.closeLink.href, `closeLink.href didn't return the expected value for register`);

    mockState.auth.selectedAuthType = 'login';

    out = Object.assign(out, {
      title: 'Login',
      isVisiblePassword2: false,
      topLinkText: 'Sign Up',
      topLink: {
        href: '/register'
      },
      submitButtonText: 'Login',
      submitButtonClass: 'login-button'
    });

    test = selector.default();

    assert.equal(test.title, out.title, `Title didn't return the expected value for login`);
    assert.equal(test.isVisibleUsername, out.isVisibleUsername, `isVisibleUsername didn't return the expected value for login`);
    assert.equal(test.isVisiblePassword, out.isVisiblePassword, `isVisiblePassword didn't return the expected value for login`);
    assert.equal(test.isVisiblePassword2, out.isVisiblePassword2, `isVisiblePassword2 didn't return the expected value for login`);
    assert.equal(test.topLinkText, out.topLinkText, `topLinkText didn't return the expected value for login`);
    assert.equal(test.msg, out.msg, `msg didn't return the expected value for login`);
    assert.equal(test.msgClass, out.msgClass, `msgClass didn't return the expected value for login`);
    assert.equal(test.submitButtonText, out.submitButtonText, `submitButtonText didn't return the expected value for login`);
    assert.equal(test.submitButtonClass, out.submitButtonClass, `submitButtonClass didn't return the expected value for login`);
    assert.equal(test.topLink.href, out.topLink.href, `topLink.href didn't return the expected value for login`);
    assert.equal(test.closeLink.href, out.closeLink.href, `closeLink.href didn't return the expected value for login`);
  });

  it(`should handle possible basic auth errors`, () => {
    let err = 'error';

    mockState.auth.err = {code: INVALID_USERNAME_OR_PASSWORD, message: 'something bad happened!'};

    test = selector.default();
    out = 'invalid username or password';

    assert.equal(test.msg, out, `Didn't give correct error text from an '${INVALID_USERNAME_OR_PASSWORD}' error code`);
    assert.equal(test.msgClass, err, `Didn't give correct error class from an '${INVALID_USERNAME_OR_PASSWORD}' error code`);

    mockState.auth.err.code = USERNAME_REQUIRED;

    test = selector.default();
    out = 'username is required';

    assert.equal(test.msg, out, `Didn't give correct error text from an '${USERNAME_REQUIRED}' error code`);
    assert.equal(test.msgClass, err, `Didn't give correct error class from an '${USERNAME_REQUIRED}' error code`);

    mockState.auth.err.code = PASSWORDS_DO_NOT_MATCH;

    test = selector.default();
    out = 'passwords do not match';

    assert.equal(test.msg, out, `Didn't give correct error text from an '${PASSWORDS_DO_NOT_MATCH}' error code`);
    assert.equal(test.msgClass, err, `Didn't give correct error class from an '${PASSWORDS_DO_NOT_MATCH}' error code`);

    mockState.auth.err.code = PASSWORD_TOO_SHORT;

    test = selector.default();
    out = mockState.auth.err.message;

    assert.equal(test.msg, out, `Didn't give correct error text from an '${PASSWORD_TOO_SHORT}' error code`);
    assert.equal(test.msgClass, err, `Didn't give correct error class from an '${PASSWORD_TOO_SHORT}' error code`);

    mockState.auth.err.code = USERNAME_TAKEN;

    test = selector.default();
    out = 'username already registered';

    assert.equal(test.msg, out, `Didn't give correct error text from an '${USERNAME_TAKEN}' error code`);
    assert.equal(test.msgClass, err, `Didn't give correct error class from an '${USERNAME_TAKEN}' error code`);
  });

});
