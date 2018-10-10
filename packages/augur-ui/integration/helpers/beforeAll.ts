import { dismissDisclaimerModal } from "./dismiss-disclaimer-modal";
import { toDefaultView } from "./navigation-helper";

beforeAll(async () => {
  await toDefaultView();

  // TODO: Determine what a 'typical' desktop resolution would be for our users
  await page.setViewport({
    height: 1200,
    width: 1200
  });

  await dismissDisclaimerModal(page);
});
