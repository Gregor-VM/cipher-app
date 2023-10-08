export const difficultyHelpMessages = {
    easy: 'NEW_GAME.EASY_HELP',
    normal: 'NEW_GAME.NORMAL_HELP',
    difficult: 'NEW_GAME.DIFFICULT_HELP'
}

export const difficulties = {
    easy: {
        autoFillFrequent: 0,
        autoFillRandom: 8,
        showHint: true,
        autocompleteHint: true,
        hintAmount: 6,
        showFrequencyOfCharacters: true,
        showFrecuencyOfLetters: true,
        showFrecuencyOfTwoLetters: true,
        showFrecuencyOfThreeLetters: true,
    },
    normal: {
        autoFillFrequent: 0,
        autoFillRandom: 0,
        showHint: true,
        autocompleteHint: true,
        hintAmount: 3,
        showFrequencyOfCharacters: true,
        showFrecuencyOfLetters: true,
        showFrecuencyOfTwoLetters: true,
        showFrecuencyOfThreeLetters: true,
    },
    difficult: {
        autoFillFrequent: 0,
        autoFillRandom: 0,
        showHint: false,
        autocompleteHint: false,
        hintAmount: 3,
        showFrequencyOfCharacters: true,
        showFrecuencyOfLetters: true,
        showFrecuencyOfTwoLetters: true,
        showFrecuencyOfThreeLetters: true,
    }
}

export enum DIFFICULTIES {
    'easy' = 'easy',
    'normal' = 'normal',
    'difficult' = 'difficult',
    'custom' = 'custom'
}