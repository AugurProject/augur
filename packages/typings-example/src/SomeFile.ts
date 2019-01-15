import { ContractDeployer } from "augur-core";
import { AugurNodeController } from "augur-node";

export class Test extends ContractDeployer {
    public doThing(): boolean {
        return this.controller.dasdasd();
    }
}
