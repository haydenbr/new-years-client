import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import * as fromActions from '../actions/resolution.actions';
import { ResolutionService } from '../resolution/services';
import { State } from '../reducers';
import { reorder } from '../util';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Injectable()
export class ResolutionEffects {
	constructor(private actions: Actions, private resolutionService: ResolutionService, private store: Store<State>) {}

	// startWith operator causes run on app start
	@Effect()
	loadResolutions: Observable<Action> = this.actions
		.ofType(fromActions.actions.GET_ALL)
		.startWith(new fromActions.GetAll())
		.switchMap(() => {
			return this.resolutionService
				.getResolutions()
				.map(resolutions => new fromActions.GetAllSuccess(resolutions))
				.catch(error => of(new fromActions.GetAllFail(error)));
		});

	@Effect()
	addResolution: Observable<Action> = this.actions
		.ofType(fromActions.actions.CREATE)
		.map((action: fromActions.Create) => action.payload)
		.switchMap(resolution => {
			return this.resolutionService
				.addResolution(resolution)
				.map(() => new fromActions.CreateSuccess(resolution))
				.catch(error => of(new fromActions.CreateFail(error)));
		});

	@Effect()
	removeResolution: Observable<Action> = this.actions
		.ofType(fromActions.actions.DELETE)
		.map((action: fromActions.Delete) => action.payload)
		.switchMap(resolution => {
			return this.resolutionService
				.removeResolution(resolution)
				.map(() => new fromActions.DeleteSuccess(resolution))
				.catch(error => of(new fromActions.DeleteFail(error)));
		});

	@Effect()
	reorderResolution: Observable<Action> = this.actions
		.ofType(fromActions.actions.REORDER)
		.withLatestFrom(this.store)
		.map(([action, state]) =>
			Object.assign({}, { resolutionIds: state.resolutions.resolutionIds, index: action['payload'] })
		)
		.map(payload => {
			let index = payload.index;
			let reorderedResolutionIds = reorder(payload.resolutionIds, index);

			return new fromActions.ReorderDone({ reorderedResolutionIds, index });
		});

	@Effect()
	reorderDone: Observable<Action> = this.actions
		.ofType(fromActions.actions.REORDER_DONE)
		.map((action: fromActions.ReorderDone) => action.payload)
		.switchMap(payload => {
			let reorderedResolutionIds = payload.reorderedResolutionIds;
			let index = payload.index;

			return this.resolutionService
				.reorderResolutions(reorderedResolutionIds, index)
				.map(() => new fromActions.ReorderSuccess())
				.catch(() => of(new fromActions.ReorderFail({ reorderedResolutionIds, index })));
		});

	@Effect()
	editResolution: Observable<Action> = this.actions
		.ofType(fromActions.actions.UPDATE)
		.map((action: fromActions.Update) => action.payload)
		.switchMap(resolution => {
			return this.resolutionService
				.updateResolution(resolution)
				.map(() => new fromActions.UpdateSuccess(resolution))
				.catch(error => of(new fromActions.UpdateFail(error)));
		});

	@Effect()
	clearResolutions: Observable<Action> = this.actions.ofType(fromActions.actions.DELETE_ALL).switchMap(() => {
		return this.resolutionService
			.clearResolutions()
			.map(() => new fromActions.DeleteAllSuccess())
			.catch(error => of(new fromActions.DeleteAllFail(error)));
	});
}
