export default function(authForm) {
  expect(authForm).toBeDefined();
  expect(typeof authForm).toBe("object");

  expect(authForm.closeLink).toBeDefined();
  expect(typeof authForm.closeLink).toBe("object");

  expect(authForm.closeLink.href).toBeDefined();
  expect(typeof authForm.closeLink.href).toBe("string");

  expect(authForm.closeLink.onClick).toBeDefined();
  expect(typeof authForm.closeLink.onClick).toBe("function");

  if (authForm.title !== undefined) {
    expect(authForm.title).toBeDefined();
    expect(typeof authForm.title).toBe("string");

    expect(authForm.type).toBeDefined();
    expect(typeof authForm.type).toBe("string");

    expect(authForm.isVisibleName).toBeDefined();
    expect(typeof authForm.isVisibleName).toBe("boolean");

    expect(authForm.isVisibleId).toBeDefined();
    expect(typeof authForm.isVisibleId).toBe("boolean");

    expect(authForm.isVisiblePassword).toBeDefined();
    expect(typeof authForm.isVisiblePassword).toBe("boolean");

    expect(authForm.isVisiblePassword2).toBeDefined();
    expect(typeof authForm.isVisiblePassword2).toBe("boolean");

    expect(authForm.isVisibleRememberMe).toBeDefined();
    expect(typeof authForm.isVisibleRememberMe).toBe("boolean");

    expect(authForm.instruction).toBeDefined();
    expect(typeof authForm.instruction).toBe("string");

    expect(authForm.msgClass).toBeDefined();
    expect(typeof authForm.msgClass).toBe("string");

    expect(authForm.topLinkText).toBeDefined();
    expect(typeof authForm.topLinkText).toBe("string");

    expect(authForm.topLink).toBeDefined();
    expect(typeof authForm.topLink).toBe("object");

    expect(authForm.topLink.href).toBeDefined();
    expect(typeof authForm.topLink.href).toBe("string");

    expect(authForm.topLink.onClick).toBeDefined();
    expect(typeof authForm.topLink.onClick).toBe("function");

    expect(authForm.submitButtonText).toBeDefined();
    expect(typeof authForm.submitButtonText).toBe("string");

    expect(authForm.submitButtonClass).toBeDefined();
    expect(typeof authForm.submitButtonClass).toBe("string");

    expect(authForm.onSubmit).toBeDefined();
    expect(typeof authForm.onSubmit).toBe("function");
  }

  if (authForm.msgClass === "error") {
    expect(authForm.msg).toBeDefined();
    expect(typeof authForm.msg).toBe("string");
  }
}
