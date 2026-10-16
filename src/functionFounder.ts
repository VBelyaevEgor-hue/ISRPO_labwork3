import * as vscode from 'vscode';
import { tokenize } from './analyze/tokenizer';
import { analyzeComplexity } from './analyze/complexity';
import { FunctionMetrics } from './analyze/types';


export interface FunctionInfo {
    name: string;
    range: vscode.Range;
    metrics: FunctionMetrics;
}

const Functions = new Set<vscode.SymbolKind>([ vscode.SymbolKind.Function, vscode.SymbolKind.Method, vscode.SymbolKind.Constructor ]);

export async function findFunctions(document: vscode.TextDocument): Promise<FunctionInfo[]> {
    const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', document.uri);

    const result: FunctionInfo[] = [];
    if (!symbols) {
        return result;
    }
    collectFunctions(symbols, document, result);
    return result;
}

function collectFunctions(symbols: vscode.DocumentSymbol[], document: vscode.TextDocument, result: FunctionInfo[]): void {
    for (const symbol of symbols) {
        if (Functions.has(symbol.kind)){
            const text = document.getText(symbol.range);
            if (text.includes('{')) {
                const metrics = analyzeComplexity(tokenize(text));
                result.push({name: symbol.name, range: symbol.range, metrics});
            }
        }
        collectFunctions(symbol.children, document, result);
    }
}