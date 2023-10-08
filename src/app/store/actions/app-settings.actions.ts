import { createAction, props } from '@ngrx/store';
import { AppSettingState } from '../reducers/app-settings.reducer';

export const setAppSettings = createAction(
    '[AppSetting Component] Set', 
    props<AppSettingState>());
export const reset = createAction('[AppSetting Component] Reset');