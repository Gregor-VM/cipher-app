import Quote from './quote.model';
export interface SharedCode{
    quote: Quote;
    settings: any;
    code: any;
    hint: string | null;
    originalCode: string;
    uniqueChars: string[];
    charCount: any;
}