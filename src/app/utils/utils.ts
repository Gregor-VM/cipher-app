import phrases from "./text";

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

const getRandomTextIndex = (hintAmount: number | undefined = undefined): number => {

    const array = phrases;

    const random = Math.floor(Math.random() * array.length);

    if(hintAmount && hintAmount > 0){
        if(getRandomWord(array[random].quote, hintAmount)){
            return random;
        } else {
            return getRandomTextIndex(hintAmount);
        }
    }

    return random;
}

const getText = (index: number | null = null) => {
    
    const array = phrases;

    if(index === null) index = getRandomTextIndex();
  
    const quote = array[index];

    return ({...quote, normalizedText: normalizeText(quote.quote)});
  
};

const getPhrasesSize = () => {
    return phrases.length;
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
        .replaceAll('.', '')
        .replaceAll(',', '')
        .replaceAll(';', '')
        .replaceAll(':', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll("'", '')
        .replaceAll('"', '')
        .replaceAll('?', '')
        .replaceAll('¿', '')
        .replaceAll('!', '')
        .replaceAll('¡', '')
}

export {getRandomEncrypt, getText, getRandomWord, getRandomTextIndex, getPhrasesSize};