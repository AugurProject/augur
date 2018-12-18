import * as ts from "typescript";

const printer = ts.createPrinter();

export class GenerateReplacementTypesForGenerics {
    constructor(public nodesToAlias:ts.ClassDeclaration[] = []) {}
    parse(contents:string) {
        // Read and parse contents
        const t = ts.createSourceFile(
            "somefile.ts",
            contents,
            ts.ScriptTarget.Latest
        );

        ts.forEachChild(t, this.visit.bind(this));
        return printer.printFile(t);
    }

    visit(n:ts.Node) {
        if(ts.isClassDeclaration(n) && n.typeParameters) {
            const item = n.typeParameters.find((m) =>
                m.name.escapedText === "TBigNumber"
            );

            if(item) {
                this.nodesToAlias.push(n)
            }
        }
    }

    buildAliases() {
        const statements:ts.Statement[] = [];
        const outFile = ts.createSourceFile(
            "ContractInterfaces.ts",
            "",
            ts.ScriptTarget.Latest
        );

        // Import 'bn.js'
        const bigNumberIdentifier = ts.createIdentifier("BN");

        const bigNumberTypeReferenceNode = ts.createTypeReferenceNode(bigNumberIdentifier, undefined);
        const moduleReferenceExpression = ts.createStringLiteral("bn.js");
        const externalModuleReference = ts.createExternalModuleReference(moduleReferenceExpression);
        statements.push(ts.createImportEqualsDeclaration(undefined, undefined, bigNumberIdentifier, externalModuleReference));

        // GenericContractInterface file import.
        const sourceFileName = ts.createStringLiteral('./ContractInterfaces');

        const sourceFileNamespaceIdentifier = ts.createIdentifier("c");
        const sourceFileNamespaceImport = ts.createNamespaceImport(sourceFileNamespaceIdentifier);
        const sourceFileImportClause = ts.createImportClause(undefined, sourceFileNamespaceImport);
        const sourceFileImportDeclaration = ts.createImportDeclaration(undefined, undefined, sourceFileImportClause, sourceFileName);
        statements.push(sourceFileImportDeclaration);

        // re-export everything from the GenericContractInterfaces. Will override below.
        statements.push(ts.createExportDeclaration(undefined, undefined, undefined, sourceFileName));

        this.nodesToAlias.forEach((t) => {
            if(t.name) {
                const r = ts.createPropertyAccess(sourceFileNamespaceIdentifier, t.name);
                const i = ts.createExpressionWithTypeArguments([bigNumberTypeReferenceNode], r);
                const h = ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [i]);
                const e = ts.createClassDeclaration(undefined, [
                    ts.createToken(ts.SyntaxKind.ExportKeyword)
                ], t.name, undefined, [h], []);

                statements.push(e)
            }
        });

        let n = ts.updateSourceFileNode(outFile, statements);
        return printer.printFile(n);
    }
}

