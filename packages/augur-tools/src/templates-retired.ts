import { RetiredTemplate } from "./templates-template";


/*
  Templates can be retired for various reasons, failOnProcessing means markets using this hash will not be considered templated markets

  Update:
  - updating retired templates because of category validation bug. https://github.com/AugurProject/augur/issues/8761
  - retire REP templates because of confusing between REP and REPv2. https://github.com/AugurProject/augur/issues/8790
*/
export const retiredTemplates: RetiredTemplate[] = [
  {
    hash: '0xa03f74512ccf232268bef522ffe9ea39c47773e79fa95c4f3f3b69ed61bf4061',
    autoFail: false,
  },
  {
    hash: '0x15c80278a399d602a5575dff5c570fb6ca25829c902513c82ab14023974d488d',
    autoFail: false,
  },
  {
    hash: '0xd6834ae7dd57d0a386e654edcf45a87781b715ade80e6661e1dafc11ef4e520c',
    autoFail: false,
  },
  {
    hash: '0xfa9e34f291a4519cf0433c76e93561da1f2854d71a2550aebe9851055616f241',
    autoFail: false,
  }
]
