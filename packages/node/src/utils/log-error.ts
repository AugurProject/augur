import { logger } from "./logger";

export function logError(err?: Error|null): void {
  if (err != null) logger.error(err);
}
