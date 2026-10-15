export type TokenType = 'word' | 'operator' | 'openBrace' | 'closeBrace'; 
export interface Token {
  type: TokenType;
  text: string;
  strIndex: number;
}
export interface FunctionMetrics {
    complexity: number;
    maxDepth: number;
}