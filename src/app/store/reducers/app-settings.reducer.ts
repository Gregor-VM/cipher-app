import { createReducer, on } from '@ngrx/store';
import { reset, setAppSettings } from '../actions/app-settings.actions';

export const initialState = {
    showConfetti: true,
    language: 'es'
};

export type AppSettingState = typeof initialState;

export const appSettingsReducer = createReducer(
  initialState,
  on(setAppSettings, (state, payload) => payload),
  on(reset, (state) => initialState)
);