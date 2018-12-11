const moduleObject = jest.genMockFromModule(
  "modules/notifications/actions/notifications"
);

moduleObject.updateNotification = jest.fn((id, notification) => ({
  type: "UPDATE_NOTIFICATION"
}));

module.exports = moduleObject;
