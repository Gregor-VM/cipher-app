import { createReducer, on } from '@ngrx/store';
import { setSettings, reset } from '../actions/settings.actions';

export const initialState = {
    initialized: false,
    autoFillFrequent: 0,
    autoFillRandom: 0,
    showHint: false,
    autocompleteHint: false,
    hintAmount: 3,
    showFrequencyOfCharacters: false,
    showFrecuencyOfLetters: false,
    showFrecuencyOfTwoLetters: false,
    showFrecuencyOfThreeLetters: false,
};

export type SettingState = typeof initialState;

export const settingsReducer = createReducer(
  initialState,
  on(setSettings, (state, payload) => ({...payload, initialized: true})),
  on(reset, (state) => initialState)
);