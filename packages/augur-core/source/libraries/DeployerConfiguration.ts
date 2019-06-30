import * as path from 'path';

const ARTIFACT_OUTPUT_ROOT  = (typeof process.env.ARTIFACT_OUTPUT_ROOT === 'undefined') ? path.join(__dirname, '../../output/contracts') : path.normalize(<string> process.env.ARTIFACT_OUTPUT_ROOT);

const PRODUCTION_LEGACY_REP_CONTRACT_ADDRESS = "0x1985365e9f78359a9B6AD760e32412f4a445E862";
const PRODUCTION_CASH_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO when MC CASH is released
const PRODUCTION_REP_PRICE_ORACLE_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO when uniswap price oracle is released

export class DeployerConfiguration {
    public readonly contractInputPath: string;
    public readonly contractAddressesOutputPath: string;
    public readonly uploadBlockNumbersOutputPath: string;
    public readonly augurAddress: string|undefined;
    public readonly createGenesisUniverse: boolean;
    public readonly useNormalTime: boolean;
    public readonly isProduction: boolean;
    public readonly legacyRepAddress: string;
    public readonly cashAddress: string;
    public readonly repPriceOracleAddress: string;
    public readonly writeArtifacts: boolean;

    public constructor(
      contractInputRoot: string,
      artifactOutputRoot: string|null,
      augurAddress: string|undefined,
      createGenesisUniverse: boolean = true,
      isProduction: boolean = false,
      useNormalTime: boolean = true,
      legacyRepAddress: string = PRODUCTION_LEGACY_REP_CONTRACT_ADDRESS,
      cashAddress: string = PRODUCTION_CASH_CONTRACT_ADDRESS,
      repPriceOracleAddress: string = PRODUCTION_REP_PRICE_ORACLE_CONTRACT_ADDRESS,
    ) {
        this.isProduction = isProduction;
        this.augurAddress = augurAddress;
        this.createGenesisUniverse = createGenesisUniverse;
        this.useNormalTime = isProduction || useNormalTime;
        this.legacyRepAddress = legacyRepAddress;
        this.cashAddress = cashAddress;
        this.repPriceOracleAddress = repPriceOracleAddress;
        this.writeArtifacts = artifactOutputRoot !== null;

        this.contractInputPath = path.join(contractInputRoot, 'contracts.json');

        if (artifactOutputRoot !== null) {
          this.contractAddressesOutputPath = path.join(artifactOutputRoot, 'addresses.json');
          this.uploadBlockNumbersOutputPath = path.join(artifactOutputRoot, 'upload-block-numbers.json');
        }
    }

    public static create(contractInputRoot:string=path.join(__dirname, '../../output/contracts'), artifactOutputRoot: string=ARTIFACT_OUTPUT_ROOT, isProduction: boolean=false, legacyRepAddress: string=PRODUCTION_LEGACY_REP_CONTRACT_ADDRESS, cashAddress: string=PRODUCTION_CASH_CONTRACT_ADDRESS, repPriceOracleAddress: string=PRODUCTION_REP_PRICE_ORACLE_CONTRACT_ADDRESS): DeployerConfiguration {
        const augurAddress = process.env.AUGUR_ADDRESS;
        const createGenesisUniverse = (typeof process.env.CREATE_GENESIS_UNIVERSE === 'undefined') ? true : process.env.CREATE_GENESIS_UNIVERSE === 'true';
        const useNormalTime = (typeof process.env.USE_NORMAL_TIME === 'string') ? process.env.USE_NORMAL_TIME === 'true' : true;
        isProduction = (typeof process.env.IS_PRODUCTION === 'string') ? process.env.IS_PRODUCTION === 'true' : isProduction;

        return new DeployerConfiguration(contractInputRoot, artifactOutputRoot, augurAddress, createGenesisUniverse, isProduction, useNormalTime, legacyRepAddress, cashAddress, repPriceOracleAddress);
    }

    public static createWithControlledTime(legacyRepAddress: string=PRODUCTION_LEGACY_REP_CONTRACT_ADDRESS, isProduction: boolean=false, artifactOutputRoot: string=ARTIFACT_OUTPUT_ROOT, cashAddress: string=PRODUCTION_CASH_CONTRACT_ADDRESS, repPriceOracleAddress: string=PRODUCTION_REP_PRICE_ORACLE_CONTRACT_ADDRESS): DeployerConfiguration {
        const contractInputRoot = (typeof process.env.CONTRACT_INPUT_ROOT === 'undefined') ? path.join(__dirname, '../../output/contracts') : path.normalize(<string> process.env.CONTRACT_INPUT_ROOT);
        const augurAddress = process.env.AUGUR_ADDRESS;
        const createGenesisUniverse = (typeof process.env.CREATE_GENESIS_UNIVERSE === 'undefined') ? true : process.env.CREATE_GENESIS_UNIVERSE === 'true';
        const useNormalTime = false;
        isProduction = (typeof process.env.IS_PRODUCTION === 'string') ? process.env.IS_PRODUCTION === 'true' : isProduction;

        return new DeployerConfiguration(contractInputRoot, artifactOutputRoot, augurAddress, createGenesisUniverse, isProduction, useNormalTime, legacyRepAddress, cashAddress, repPriceOracleAddress);
    }
}
