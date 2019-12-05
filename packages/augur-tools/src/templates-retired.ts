import { RetiredTemplate } from "./templates-template";


/*
  Templates can be retired for various reasons, failOnProcessing means markets using this hash will not be considered templated markets
*/
export const retiredTemplates: RetiredTemplate[] = [
  {
    hash: 'Just An Example Hash',
    autoFail: true,
  }
]
