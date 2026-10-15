import { Token, FunctionMetrics } from './types';

const words = new Set([ 'if', 'for', 'while', 'case', 'catch' ]);

const operators = new Set([ '&&', '||', '?' ]);

export function analyzeComplexity(tokens: Token[]): FunctionMetrics {
    let complexity = 1;
    let maxStackSize = 0;
    const stack: string[] = [];

    for (const token of tokens) {
        if (token.type === 'openBrace') {
            stack.push('{');
            maxStackSize = Math.max(maxStackSize, stack.length);
        } else if (token.type === 'closeBrace') {
            if (stack.length > 0) {
                stack.pop();
            }
        } else if (stack.length > 0) {
            if (token.type === 'word' && words.has(token.text)) {
                complexity++;
            } else if (token.type === 'operator' && operators.has(token.text)) {
                complexity++;
            }
        }
    }
    
    return {
        complexity: complexity,
        maxDepth: Math.max(0, maxStackSize - 1),
    };
}