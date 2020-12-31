import { CompilerConfiguration } from '../libraries/CompilerConfiguration';
import { ContractCompiler } from "../libraries/ContractCompiler";
require('source-map-support').install();

async function doWork(): Promise<void> {
    const configuration = CompilerConfiguration.create();
    const compiler = new ContractCompiler(configuration);
    const compilerOutput = await compiler.compileContracts();
    await compiler.writeABIFile(compilerOutput);
    await compiler.writeManyABIFiles(compilerOutput);
}

doWork().then(() => {
    process.exit();
}).catch(error => {
    console.log(error);
    process.exit(1);
});
