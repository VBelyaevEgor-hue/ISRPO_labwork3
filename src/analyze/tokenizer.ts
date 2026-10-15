import { Token } from './types';

export function tokenize(text: string): Token[] {
    let i = 0;
    const result: Token[] = [];
    while (i < text.length) {
        const ch = text[i];
        if (ch === '/') {
            if (i + 1 < text.length && text[i + 1] === '/') {
                // Skip the rest of the line
                while (i < text.length && text[i] !== '\n') {
                    i++;
                }
            }else if (i + 1 < text.length && text[i + 1] === '*') {
                // Skip the block comment
                i += 2; // Skip the '/*'
                while (i + 1 < text.length && !(text[i] === '*' && text[i + 1] === '/')) {
                    i++;
                }
                i += 2; // Skip the '*/'
                continue;
            }
        } else if (ch === '"' || ch === "'") {
            // Skip the string literal
            const quoteType = ch;
            i++; // Skip the opening quote
            while (i < text.length && text[i] !== quoteType) {
                if (text[i] === '\\') {
                    i++; // Skip the escaped character
                }
                i++;
            }
            i++; // Skip the closing quote
            continue;
        } else if (/\s/.test(ch)) {
            // Skip whitespace
        } else if (/[a-zA-Z_]/.test(ch)) {
            // It's a word token
            const start = i;
            while (i < text.length && /[a-zA-Z0-9_]/.test(text[i])) {
                i++;
            }
            result.push({ type: 'word', text: text.slice(start, i), strIndex: start });
            continue; // Skip the increment of i at the end of the loop
        } else if (ch === '{') {
            result.push({ type: 'openBrace', text: ch, strIndex: i });
        } else if (ch === '}') {
            result.push({ type: 'closeBrace', text: ch, strIndex: i });
        } else if ((text.startsWith('||', i)) || (text.startsWith('&&', i))) {
            result.push({ type: 'operator', text: text.slice(i, i + 2), strIndex: i });
            i += 2; // Skip the next character as well
            continue;
        }else if (ch === '?'){
            result.push({ type: 'operator', text: ch, strIndex: i });
            continue;
        }
        i++;
    }
    return result;
}