import { Action } from '@ngrx/store';
import omit from 'lodash/omit';
import { createSelector } from 'reselect';

import { AppState } from './app.state';
import * as resolutionActions from '../actions/resolutions.actions';
import { GetAll } from '../actions/resolutions.actions';
import { Task } from '../models';
import { reorder } from '../util';
import { milstonesReducer } from './milestones.reducer';

export interface ResolutionsState {
	loaded: boolean;
	loading: boolean;
	resolutions: { [id: string]: Task },
	resolutionIds: string[],
	currentResolutionId: string
}

const initialState: ResolutionsState = {
	loaded: false,
	loading: false,
	resolutions: {},
	resolutionIds: [],
	currentResolutionId: undefined
}

// ============= REDUCER =============

export function resolutionsReducer(state: ResolutionsState = initialState, action: Action): ResolutionsState {
	let reducerHandle = reducerCases[action.type];

	if (reducerHandle) {
		return reducerHandle(state, action);
	}

	return milstonesReducer(state, action);
}

let reducerCases = {};

reducerCases[resolutionActions.actions.GET_ALL] =
	function (state: ResolutionsState, action: Action) {
		return Object.assign({}, state, { loading: true });
	}

reducerCases[resolutionActions.actions.GET_ALL_SUCCESS] =
	function (state: ResolutionsState, action: Action) {
		let resolutionsArray = action.payload, resolutions = {}, resolutionIds = [];
				
		resolutionsArray.forEach((r) => {
			resolutions[r.id] = r;
			resolutionIds.push(r.id);
		});

		return Object.assign({}, state, { loading: false, loaded: true, resolutions, resolutionIds });
	}

reducerCases[resolutionActions.actions.CREATE_SUCCESS] =
	function (state: ResolutionsState, action: Action) {
		let newResolution = action.payload as Task;
		return Object.assign({}, state, {
			resolutions: Object.assign({}, state.resolutions, { [newResolution.id]: newResolution, }),
			resolutionIds: state.resolutionIds.concat(newResolution.id)
		});
	}

reducerCases[resolutionActions.actions.DELETE_SUCCESS] =
	function (state: ResolutionsState, action: Action) {
		let removedResolution = action.payload as Task;
		return Object.assign({}, state, {
			resolutions: omit(state.resolutions, removedResolution.id),
			resolutionIds: state.resolutionIds.filter((id) => { return id !== removedResolution.id })
		});
	}

reducerCases[resolutionActions.actions.UPDATE_SUCCESS] =
	function (state: ResolutionsState, action: Action) {
		let editedResolution = action.payload as Task;
		return Object.assign({}, state, {
			resolutions: Object.assign({}, state.resolutions, { [editedResolution.id]: editedResolution })
		});
	}

reducerCases[resolutionActions.actions.REORDER_SUCCESS] =
	function (state: ResolutionsState, action: Action) {
		return Object.assign({}, state, { resolutionIds: reorder(state.resolutionIds, action.payload) });
	}

reducerCases[resolutionActions.actions.SET_CURRENT] =
	function (state: ResolutionsState, action: Action) {
		return Object.assign({}, state, { currentResolutionId: action.payload.id });
	}

// ============= SELECTORS =============

export const getResolutionsState = (state: AppState) => state.resolutions;
export const getLoaded = createSelector(getResolutionsState, state => state.loaded);
export const getLoading = createSelector(getResolutionsState, state => state.loading);
export const getResolutionsMap = createSelector(getResolutionsState, state => state.resolutions);
export const getResolutionIds = createSelector(getResolutionsState, state => state.resolutionIds);
export const getCurrentResolutionId = createSelector(getResolutionsState, state => state.currentResolutionId);
export const getResolutions = createSelector(getResolutionsMap, getResolutionIds, (resolutions, ids) => {
	return ids.map((id) => { return resolutions[id] });
});
export const getCurrentResolution = createSelector(getResolutionsMap, getCurrentResolutionId, (resolutions, id) => {
	return resolutions[id];
});
export const getMilestones = createSelector(getCurrentResolution, (r) => { return r.milestones });