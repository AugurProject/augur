document.documentElement.className +=
  "ontouchstart" in document.documentElement
    ? " touch-enabled"
    : " touch-disabled";
if (window.navigator && navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length === 0) return;
    const p = registrations.map(registration => registration.unregister());

    return Promise.all(p).then(() => {
      // We must reload to prevent unregistered service workers from running.
      window.location.reload();
    });
  });
}
