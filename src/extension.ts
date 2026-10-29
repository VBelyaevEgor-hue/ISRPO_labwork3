import * as vscode from 'vscode';
import { findFunctions } from './functionFounder';

/**
 * Вызывается VS Code при первом запуске команды плагина (см. activationEvents в package.json).
 * Создаёт панель вывода и регистрирует команду "Analyze Complexity".
 *
 * @param context контекст расширения; всё, что добавлено в context.subscriptions,
 * VS Code само освободит при выключении плагина
 */
export function activate(context: vscode.ExtensionContext) {
	// отдельная вкладка в панели Output, куда будем выводить результат
	const output = vscode.window.createOutputChannel( 'Complexity Analyzer' );

	// привязываем код к команде, которая объявлена в package.json (contributes.commands)
	const disposable = vscode.commands.registerCommand('complexity-analyzer.analyzeFile', async () => {
		// файл, который сейчас открыт в редакторе
		const editor = 	vscode.window.activeTextEditor;
		// если ни один файл не открыт, анализировать нечего: предупреждаем и выходим
		if (!editor){
			vscode.window.showWarningMessage('Откройте C++ файл для анализа');
			return;
		}

		// ждём, пока VS Code вернёт список функций, и считаем для них метрики
		const functions = await findFunctions(editor.document);

		// убираем результат прошлого запуска, чтобы строки не копились
		output.clear();
		if (functions.length === 0){
			output.appendLine("Функции не найдены. Проверьте, что открыт C++ файл и установлено расширение C/C++.");
		} else {
			output.appendLine(`Файл: ${editor.document.fileName}`);
			for (const fn of functions) {
				// в VS Code строки считаются с нуля, а человеку привычнее с единицы
				const line = fn.range.start.line + 1;
				output.appendLine(`${fn.name} (строка ${line}): сложность ${fn.metrics.complexity}, вложенность ${fn.metrics.maxDepth}`);

			}
		}
		// показываем панель Output; true значит "не забирать фокус у редактора"
		output.show(true);
	});

	// регистрируем команду и панель, чтобы VS Code убрал их при выключении плагина
	context.subscriptions.push(disposable, output);
}

/** Вызывается VS Code при выключении плагина. Освобождать вручную нечего: это делает context.subscriptions. */
export function deactivate() {}