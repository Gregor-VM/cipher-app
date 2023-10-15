import esPhrases from "./es.text";
import enPhrases from "./en.text";


const phrases = {
    'es': esPhrases,
    'en': enPhrases,
}

export type LangKey = keyof typeof phrases;

export const removeAccents = (text: string) => {
    const vowels: any = {'á': 'a', 'é':'e', 'í':'i', 'ó':'o', 'ú':'u'};
    const keys = Object.keys(vowels);
    return text.split("").map(chart => keys.includes(chart) ? vowels[chart] : chart).join("");
};
  
export const randomizeArray = (array: string[], length = array.length, suffledArray: string[] = []): string[] => {
  
    const random = Math.floor(Math.random() * length);
    suffledArray.push(array[random]);
    array.splice(random, 1);
    
    if(length < 2) return suffledArray;
    
    return randomizeArray(array, length - 1, suffledArray);
};

const encrypt = (text: string, completeAlphabet: any) => {
  
    const keys = Object.keys(completeAlphabet);
  
    return text.split("").map(chart => {

      //if(chart === " ") return "    ";
  
      const normalizeChart = removeAccents( chart.toLowerCase() )
  
      return (keys.includes(normalizeChart) ? completeAlphabet[normalizeChart] : chart);
  
    }).join("");
  
}

const getRandomEncrypt = (text: string) => {
  
    const alphabet = "abcdefghijklmnñopqrstuvwxyz";
    const secret = "円#✤%✚▶❤&♦し⊥8★<>✖☐＠ツ∅Σ∀⋂⋃△▽Π";
  
    const suffledSecret = randomizeArray(secret.split("")).join("");
  
    let completeAlphabet = {};
  
    alphabet.split("").forEach((chart, i) => {
  
      completeAlphabet = {...completeAlphabet, [chart]:suffledSecret[i]};
  
    });
  
    return encrypt(text,completeAlphabet);
  
}

const getRandomTextIndex = (lang: LangKey, hintAmount: number | undefined = undefined): number => {

    const array = phrases[lang];

    const random = Math.floor(Math.random() * array.length);

    if(hintAmount && hintAmount > 0){
        if(getRandomWord(array[random].quote, hintAmount)){
            return random;
        } else {
            return getRandomTextIndex(lang, hintAmount);
        }
    }

    return random;
}

const getText = (lang: LangKey, index: number | null = null) => {
    
    const array = phrases[lang];

    if(index === null) index = getRandomTextIndex(lang);
  
    const quote = array[index];

    return ({...quote, normalizedText: normalizeText(quote.quote)});
  
};

const getPhrasesSize = (lang: LangKey) => {
    return phrases[lang].length;
}
  
const getRandomWord = (text: string, amountOfLetters = 3) => {

    text = normalizeText(text);
  
    const filteredText = text.split(" ").filter(e => e.length === amountOfLetters);
  
    const random = Math.floor(Math.random() * filteredText.length);

    if(!filteredText[random]) return null;
  
    return filteredText[random].replace("/r", "");
}

export const normalizeText = (text: string) => {
    text = text.split("").map(l => removeAccents(l)).join("");
    return text.split("\n").join(" ").trim()
        .replace(/[^A-Za-zñ ]/g, '')
}

export {getRandomEncrypt, getText, getRandomWord, getRandomTextIndex, getPhrasesSize};