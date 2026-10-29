/**
 * Вид части кода, которую находит анализатор:
 * - word: слово (if, for, имя переменной и т.п.)
 * - operator: логический оператор (&&, ||) или ?
 * - openBrace: открывающая фигурная скобка
 * - closeBrace: закрывающая фигурная скобка
 */
export type TokenType = 'word' | 'operator' | 'openBrace' | 'closeBrace'; 

/** Одна часть кода, найденная при разборе текста функции. */
export interface Token {
  /** Вид части кода. */
  type: TokenType;
  /** Сам текст, например "if" или "&&". */
  text: string;
  /** Позиция первого символа в исходном тексте. */
  strIndex: number;
}

/** Метрики одной функции. */
export interface FunctionMetrics {
    /** Цикломатическая сложность: 1 + число развилок. */
    complexity: number;
    /** Максимальная вложенность блоков внутри функции. */
    maxDepth: number;
}