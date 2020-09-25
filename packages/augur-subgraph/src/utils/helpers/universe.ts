import { Universe } from "../../../generated/schema";

export function getOrCreateUniverse(
  id: String,
  createIfNotFound: boolean = true
): Universe {
  let universe = Universe.load(id);

  if (universe == null && createIfNotFound) {
    universe = new Universe(id);
  }

  return universe as Universe;
}
