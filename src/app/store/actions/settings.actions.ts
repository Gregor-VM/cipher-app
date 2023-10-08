import { createAction, props } from '@ngrx/store';
import { SettingState } from '../reducers/settings.reducer';

export const setSettings = createAction(
    '[Setting Component] Set', 
    props<SettingState>());
export const reset = createAction('[Setting Component] Reset');