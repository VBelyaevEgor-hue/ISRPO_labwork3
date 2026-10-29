import { Token } from './types';

/**
 * Разбирает текст функции на части кода: слова, операторы (&&, ||, ?)
 * и фигурные скобки. Комментарии, строки и символьные литералы пропускаются,
 * чтобы слова вроде "if" внутри них не считались развилками.
 *
 * @param text исходный текст функции
 * @returns список найденных частей кода в порядке их появления
 */
export function tokenize(text: string): Token[] {
    // i - позиция символа, который сейчас разбираем
    let i = 0;
    const result: Token[] = [];
    while (i < text.length) {
        const ch = text[i];
        if (ch === '/') {
            if (i + 1 < text.length && text[i + 1] === '/') {
                // однострочный комментарий: идём до конца строки
                while (i < text.length && text[i] !== '\n') {
                    i++;
                }
            }else if (i + 1 < text.length && text[i + 1] === '*') {
                // многострочный комментарий: пропускаем "/*", затем идём до "*/"
                i += 2; 
                while (i + 1 < text.length && !(text[i] === '*' && text[i + 1] === '/')) {
                    i++;
                }
                // перескакиваем через закрывающие "*/"
                i += 2; 
                continue;
            }
            // одиночный "/" (деление) никак не обрабатываем, просто пойдём дальше
        } else if (ch === '"' || ch === "'") {
            // строка или символьный литерал: запоминаем, каким видом кавычки открыли
            const quoteType = ch;
            i++; 
            while (i < text.length && text[i] !== quoteType) {
                if (text[i] === '\\') {
                    // экранированный символ (например \" ) пропускаем вместе со слэшем
                    i++; 
                }
                i++;
            }
            // пропускаем закрывающую кавычку
            i++; 
            continue;
        } else if (/\s/.test(ch)) {
            // пробелы, табуляции и переносы строк нас не интересуют
        } else if (/[a-zA-Z_]/.test(ch)) {
            // слово: начинается с буквы или _, дальше могут идти ещё и цифры
            const start = i;
            while (i < text.length && /[a-zA-Z0-9_]/.test(text[i])) {
                i++;
            }
            result.push({ type: 'word', text: text.slice(start, i), strIndex: start });
            // i уже стоит на первом символе после слова, поэтому общий i++ не нужен
            continue; 
        } else if (ch === '{') {
            result.push({ type: 'openBrace', text: ch, strIndex: i });
        } else if (ch === '}') {
            result.push({ type: 'closeBrace', text: ch, strIndex: i });
        } else if ((text.startsWith('||', i)) || (text.startsWith('&&', i))) {
            // двухсимвольный оператор: сохраняем оба символа и прыгаем сразу через них
            result.push({ type: 'operator', text: text.slice(i, i + 2), strIndex: i });
            i += 2; 
            continue;
        }else if (ch === '?'){
            // тернарный оператор; i сдвинется общим i++ внизу цикла
            result.push({ type: 'operator', text: ch, strIndex: i });
        }
        // шаг на один символ вперёд для всех веток, которые не сдвинули i сами
        i++;
    }
    return result;
}