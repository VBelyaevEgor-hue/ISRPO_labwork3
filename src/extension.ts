
import * as vscode from 'vscode';
import { findFunctions } from './functionFounder';

export function activate(context: vscode.ExtensionContext) {
	const output = vscode.window.createOutputChannel( 'Complexity Analyzer' );

	const disposable = vscode.commands.registerCommand('complexity-analyzer.analyzeFile', async () => {
		const editor = 	vscode.window.activeTextEditor;
		if (!editor){
			vscode.window.showWarningMessage('Откройте C++ файл для анализа');
			return;
		}

		const functions = await findFunctions(editor.document);

		output.clear();
		if (functions.length === 0){
			output.appendLine("Функции не найдены. Проверьте, что открыт C++ файл и установлено расширение C/C++.");
		} else {
			output.appendLine(`Файл: ${editor.document.fileName}`);
			for (const fn of functions) {
				const line = fn.range.start.line + 1;
				output.appendLine(`${fn.name} (строка ${line}): сложность ${fn.metrics.complexity}, вложенноть ${fn.metrics.maxDepth}`);

			}
		}
		output.show(true);
	});

	context.subscriptions.push(disposable, output);
}

// This method is called when your extension is deactivated
export function deactivate() {}
