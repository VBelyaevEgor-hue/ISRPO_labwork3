import { Token, FunctionMetrics } from './types';

/** Слова, каждое из которых добавляет в функцию ещё одну развилку. */
const words = new Set([ 'if', 'for', 'while', 'case', 'catch' ]);

/**
 * Операторы, каждый из которых добавляет ещё одну развилку:
 * логическое И, логическое ИЛИ и тернарный оператор.
 */
const operators = new Set([ '&&', '||', '?' ]);

/**
 * Считает цикломатическую сложность и максимальную вложенность функции
 * по списку её частей кода (слов, операторов и фигурных скобок).
 * Сложность = 1 + количество развилок (слова из words и операторы из operators).
 * Вложенность считается по стеку фигурных скобок.
 *
 * @param tokens части кода одной функции (результат работы tokenize)
 * @returns сложность и максимальная вложенность функции
 */
export function analyzeComplexity(tokens: Token[]): FunctionMetrics {
    // у любой функции есть как минимум один путь выполнения, поэтому начинаем с 1
    let complexity = 1;
    // самая большая глубина стека, которая встретилась
    let maxStackSize = 0;
    // стек открытых скобок: его размер равен текущей глубине вложенности
    const stack: string[] = [];

    for (const token of tokens) {
        if (token.type === 'openBrace') {
            // зашли в новый блок, кладём скобку в стек и обновляем максимум
            stack.push('{');
            maxStackSize = Math.max(maxStackSize, stack.length);
        } else if (token.type === 'closeBrace') {
            // вышли из блока; проверка нужна, чтобы лишняя } не ломала стек
            if (stack.length > 0) {
                stack.pop();
            }
        } else if (stack.length > 0) {
            // считаем развилки только внутри тела функции (стек не пустой),
            // чтобы && в сигнатуре (например, std::string&& s) не влиял на результат
            if (token.type === 'word' && words.has(token.text)) {
                // слово из набора: if, for, while, case, catch
                complexity++;
            } else if (token.type === 'operator' && operators.has(token.text)) {
                // оператор из набора: &&, ||, ?
                complexity++;
            }
        }
    }

    return {
        complexity: complexity,
        // внешние скобки самой функции вложенностью не считаем, поэтому минус 1 (но не меньше 0)
        maxDepth: Math.max(0, maxStackSize - 1),
    };
}