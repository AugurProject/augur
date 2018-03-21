

export default function (authForm) {
  assert.isDefined(authForm, `authForm isn't defined`)
  assert.isObject(authForm, `authForm isn't an object`)

  assert.isDefined(authForm.closeLink, `authFrom.closeLink isn't defined`)
  assert.isObject(authForm.closeLink, `authFrom.closeLink isn't an object`)

  assert.isDefined(authForm.closeLink.href, `authForm.closeLink.href isn't defined`)
  assert.isString(authForm.closeLink.href, `authForm.closeLink.href isn't a string`)

  assert.isDefined(authForm.closeLink.onClick, `authForm.closeLink.onClick isn't defined`)
  assert.isFunction(authForm.closeLink.onClick, `authForm.closeLink.onClick isn't a function`)

  if (authForm.title !== undefined) {
    assert.isDefined(authForm.title, `authForm.title isn't defined`)
    assert.isString(authForm.title, `authForm.title isn't a string`)

    assert.isDefined(authForm.type, `authForm.type isn't defined`)
    assert.isString(authForm.type, `authForm.type isn't a string`)

    assert.isDefined(authForm.isVisibleName, `authForm.isVisibleName isn't defined`)
    assert.isBoolean(authForm.isVisibleName, `authForm.isVisibleName isn't a boolean`)

    assert.isDefined(authForm.isVisibleId, `authForm.isVisibleId isn't defined`)
    assert.isBoolean(authForm.isVisibleId, `authForm.isVisibleId isn't a boolean`)

    assert.isDefined(authForm.isVisiblePassword, `authForm.isVisiblePassword isn't defined`)
    assert.isBoolean(authForm.isVisiblePassword, `authForm.isVisiblePassword isn't a boolean`)

    assert.isDefined(authForm.isVisiblePassword2, `authForm.isVisiblePassword2 isn't defined`)
    assert.isBoolean(authForm.isVisiblePassword2, `authForm.isVisiblePassword2 isn't a boolean`)

    assert.isDefined(authForm.isVisibleRememberMe, `authForm.isVisibleRememberMe isn't defined`)
    assert.isBoolean(authForm.isVisibleRememberMe, `authForm.isVisibleRememberMe isn't a boolean`)

    assert.isDefined(authForm.instruction, `authForm.instruction isn't defined`)
    assert.isString(authForm.instruction, `authForm.instruction isn't a string`)

    assert.isDefined(authForm.msgClass, `authForm.msgClass isn't defined`)
    assert.isString(authForm.msgClass, `authForm.msgClass isn't a string`)

    assert.isDefined(authForm.topLinkText, `authForm.topLinkText isn't defined`)
    assert.isString(authForm.topLinkText, `authForm.topLinkText isn't a string`)

    assert.isDefined(authForm.topLink, `authForm.topLink isn't defined`)
    assert.isObject(authForm.topLink, `authForm.topLink isn't an object`)

    assert.isDefined(authForm.topLink.href, `authForm.topLink.href isn't defined`)
    assert.isString(authForm.topLink.href, `authForm.topLink.href isn't a string`)

    assert.isDefined(authForm.topLink.onClick, `authForm.topLink.onClick isn't defined`)
    assert.isFunction(authForm.topLink.onClick, `authForm.topLink.onClick isn't a function`)

    assert.isDefined(authForm.submitButtonText, `authForm.submitButtonText isn't defined`)
    assert.isString(authForm.submitButtonText, `authForm.submitButtonText isn't a string`)

    assert.isDefined(authForm.submitButtonClass, `authForm.submitButtonClass isn't defined`)
    assert.isString(authForm.submitButtonClass, `authForm.submitButtonClass isn't a string`)

    assert.isDefined(authForm.onSubmit, `authForm.onSubmit isn't defined`)
    assert.isFunction(authForm.onSubmit, `authForm.onSubmit isn't a function`)
  }

  if (authForm.msgClass === 'error') {
    assert.isDefined(authForm.msg, `error was thrown but authForm.msg isn't defined to display`)
    assert.isString(authForm.msg, `error was thrown but authForm.msg isn't a string`)
  }
}
