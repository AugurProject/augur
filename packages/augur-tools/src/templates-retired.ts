import { RetiredTemplate } from "./templates-template";


/*
  Templates can be retired for various reasons, failOnProcessing means markets using this hash will not be considered templated markets

  Update:
  - updating retired templates because of category validation bug. https://github.com/AugurProject/augur/issues/8761
*/
export const retiredTemplates: RetiredTemplate[] = [
  {
    hash: '0xa03f74512ccf232268bef522ffe9ea39c47773e79fa95c4f3f3b69ed61bf4061',
    autoFail: true,
  }
]
