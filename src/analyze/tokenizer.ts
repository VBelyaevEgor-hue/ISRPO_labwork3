import { Token } from './types';

export function tokenize(text: string): Token[] {
    let i = 0;
    const result: Token[] = [];
    while (i < text.length) {
        const ch = text[i];
        if (ch === '/') {
            if (i + 1 < text.length && text[i + 1] === '/') {
                while (i < text.length && text[i] !== '\n') {
                    i++;
                }
            }else if (i + 1 < text.length && text[i + 1] === '*') {
                i += 2; 
                while (i + 1 < text.length && !(text[i] === '*' && text[i + 1] === '/')) {
                    i++;
                }
                i += 2; 
                continue;
            }
        } else if (ch === '"' || ch === "'") {
            
            const quoteType = ch;
            i++; 
            while (i < text.length && text[i] !== quoteType) {
                if (text[i] === '\\') {
                    i++; 
                }
                i++;
            }
            i++; 
            continue;
        } else if (/\s/.test(ch)) {
        } else if (/[a-zA-Z_]/.test(ch)) {
            const start = i;
            while (i < text.length && /[a-zA-Z0-9_]/.test(text[i])) {
                i++;
            }
            result.push({ type: 'word', text: text.slice(start, i), strIndex: start });
            continue; 
        } else if (ch === '{') {
            result.push({ type: 'openBrace', text: ch, strIndex: i });
        } else if (ch === '}') {
            result.push({ type: 'closeBrace', text: ch, strIndex: i });
        } else if ((text.startsWith('||', i)) || (text.startsWith('&&', i))) {
            result.push({ type: 'operator', text: text.slice(i, i + 2), strIndex: i });
            i += 2; 
            continue;
        }else if (ch === '?'){
            result.push({ type: 'operator', text: ch, strIndex: i });
            continue;
        }
        i++;
    }
    return result;
}