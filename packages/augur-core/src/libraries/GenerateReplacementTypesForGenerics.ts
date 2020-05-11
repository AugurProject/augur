import * as ts from "typescript";
import * as path from "path";

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

    buildAliases(genericFilePath:string) {
        const statements:ts.Statement[] = [];
        const outFile = ts.createSourceFile(
            "",
            "",
            ts.ScriptTarget.Latest
        );

        // Import 'bignumber.js'
        const bignumberIdentifier = ts.createIdentifier("BigNumber");
        const bignumberNamedImports = ts.createNamedImports([ts.createImportSpecifier(undefined, bignumberIdentifier)]);
        const bignumberModuleName = ts.createStringLiteral("bignumber.js");
        const bignumberImportClause = ts.createImportClause(undefined, bignumberNamedImports);
        statements.push(ts.createImportDeclaration(undefined, undefined, bignumberImportClause, bignumberModuleName));

        const bignumberBigNumberTypeNode = ts.createTypeReferenceNode("BigNumber", undefined);

        // GenericContractInterface file import.
        const genericFileName = path.parse(genericFilePath).name;

        // Assuming it is relative to wherever the output of this function is written.
        const sourceFileName = ts.createStringLiteral(`./${genericFileName}`);

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
                const i = ts.createExpressionWithTypeArguments([bignumberBigNumberTypeNode], r);
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
