import * as vscode from 'vscode';
import { tokenize } from './analyze/tokenizer';
import { analyzeComplexity } from './analyze/complexity';
import { FunctionMetrics } from './analyze/types';


/** Информация об одной найденной функции и её метриках. */
export interface FunctionInfo {
    /** Имя функции, как его вернул провайдер символов (например, "main"). */
    name: string;
    /** Положение функции в документе (от начала до конца). */
    range: vscode.Range;
    /** Посчитанные сложность и вложенность. */
    metrics: FunctionMetrics;
}

/** Виды символов, которые считаем функциями: обычные функции, методы классов и конструкторы. */
const Functions = new Set<vscode.SymbolKind>([ vscode.SymbolKind.Function, vscode.SymbolKind.Method, vscode.SymbolKind.Constructor ]);

/**
 * Находит в документе все функции и считает для каждой метрики.
 * Список функций берётся у VS Code (его даёт расширение C/C++),
 * сами метрики считает наш анализатор.
 *
 * @param document открытый документ, который нужно проанализировать
 * @returns список функций с метриками (пустой, если функций нет или расширение не ответило)
 */
export async function findFunctions(document: vscode.TextDocument): Promise<FunctionInfo[]> {
    // просим VS Code вернуть дерево символов файла (функции, классы, переменные и т.д.)
    const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', document.uri);

    const result: FunctionInfo[] = [];
    // если расширение для языка не установлено или ещё не проиндексировало файл, символов не будет
    if (!symbols) {
        return result;
    }
    collectFunctions(symbols, document, result);
    return result;
}

/**
 * Обходит дерево символов и складывает найденные функции в result.
 * Рекурсия нужна, потому что функции могут лежать внутри классов и пространств имён.
 *
 * @param symbols символы текущего уровня дерева
 * @param document документ, из которого берём текст функций
 * @param result сюда добавляются найденные функции
 */
function collectFunctions(symbols: vscode.DocumentSymbol[], document: vscode.TextDocument, result: FunctionInfo[]): void {
    for (const symbol of symbols) {
        if (Functions.has(symbol.kind)){
            // берём из документа только текст этой функции
            const text = document.getText(symbol.range);
            // если в тексте нет "{", это просто объявление (прототип) без тела, пропускаем
            if (text.includes('{')) {
                const metrics = analyzeComplexity(tokenize(text));
                result.push({name: symbol.name, range: symbol.range, metrics});
            }
        }
        // заходим внутрь символа: там могут быть вложенные функции или методы
        collectFunctions(symbol.children, document, result);
    }
}