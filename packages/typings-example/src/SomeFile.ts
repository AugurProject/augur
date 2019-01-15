import { ContractDeployer } from "@augurproject/core";
import { AugurNodeController } from "@augurproject/node";

export class Test extends ContractDeployer {
    private controller:AugurNodeController;

    public doThing(): boolean {
        return this.controller.dasdasd();
    }
}
