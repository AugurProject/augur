import { ContractDeployer } from "augur-core";
import { AugurNodeController } from "augur-node";

export class Test extends ContractDeployer {
  private controller: AugurNodeController;

  public doThing(): boolean {
    return this.controller.dasdasd();
  }
}
