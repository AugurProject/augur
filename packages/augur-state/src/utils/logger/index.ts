import { StandardLogger } from "./StandardLogger";
import { Logger } from "./logger";

const standardLogger = new StandardLogger();

// Export as singleton.
export const logger = new Logger();
logger.addLogger(standardLogger);
